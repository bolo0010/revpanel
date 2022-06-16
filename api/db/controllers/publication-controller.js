const Publication = require('../models/publication-model.js');
const User = require('../models/user-model.js');
const PublicationComment = require('../models/publication-comment-model.js');
const Role = require('../models/role-model.js');
const {
    PUBLICATION_MAX_LENGTH,
    rolesCanArchiveInCorrection,
    rolesCanArchiveInPublish,
    rolesCanCorrect,
    rolesCanPublish,
    rolesCanReturnInCorrection,
    rolesCanReturnInPublish
} = require('../../config/publication-managment.js');
const { startInitialDate } = require('../../config/initial-dates.js');
const { publicationStates } = require('../../config/publication-states.js');
const PublicationType = require('../models/publication-type-model.js');
const PublicationRoute = require('../models/publication-route.model.js');
const { adminRoles, correctorRoles } = require('../../config/user-data.js');
const PublicationState = require('../models/publication-state-model.js');
const { basicDataShow } = require('../../config/publication-data.js');
const Op = require('sequelize/lib/operators');
const { publishRoles } = require('../../config/user-data');

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: publications } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, totalPages, currentPage, publications };
};

const getAllPublicationForPanel = async (req, res) => {
    const {
        page,
        size,
        sortBy,
        searchFromDateCreateQuery,
        searchToDateCreateQuery,
        searchFromDateUpdateQuery,
        searchToDateUpdateQuery,
        searchFromDatePublishQuery,
        searchToDatePublishQuery,
        searchIsArchived,
        searchCategory,
        searchQuery,
        csv = false
    } = req.query;

    let authorQuery;
    let correctorQuery;
    let publisherQuery;
    let publicationStateQuery;
    let publicationTypeQuery;
    let publicationRouteQuery;

    let query = {
        title: {
            [Op.or]: {
                [Op.like]: [searchQuery && searchCategory === 'title' ? `%${searchQuery}%` : `%`],
                [Op.is]: null
            }
        },
        createdAt: {
            [Op.between]: [searchFromDateCreateQuery || startInitialDate, searchToDateCreateQuery || new Date()]
        },
        updatedAt: {
            [Op.or]: {
                [Op.between]: [searchFromDateUpdateQuery || startInitialDate, searchToDateUpdateQuery || new Date()],
                [Op.is]: null
            }
        },
        publishedAt: {
            [Op.or]: {
                [Op.between]: [searchFromDatePublishQuery || startInitialDate, searchToDatePublishQuery || new Date()],
                [Op.is]: null
            }
        }
    };

    if (searchQuery && searchCategory === 'author.nick') {
        authorQuery = {};
        authorQuery.nick = {};
        authorQuery.nick[Op.like] = `%${searchQuery}%`;
    }

    if (searchQuery && searchCategory === 'corrector.nick') {
        correctorQuery = {};
        correctorQuery.nick = {};
        correctorQuery.nick[Op.like] = `%${searchQuery}%`;
    }

    if (searchQuery && searchCategory === 'publisher.nick') {
        publisherQuery = {};
        publisherQuery.nick = {};
        publisherQuery.nick[Op.like] = `%${searchQuery}%`;
    }

    if (searchQuery && searchCategory === 'type_pl') {
        publicationTypeQuery = {};
        publicationTypeQuery.type_pl = {};
        publicationTypeQuery.type_pl[Op.like] = `%${searchQuery}%`;
    }

    if (searchQuery && searchCategory === 'status') {
        publicationStateQuery = {};
        publicationStateQuery.status = {};
        publicationStateQuery.status[Op.like] = `%${searchQuery}%`;
    }

    if (searchQuery && searchCategory === 'message') {
        publicationRouteQuery = {};
        publicationRouteQuery.message = {};
        publicationRouteQuery.message[Op.like] = `%${searchQuery}%`;
    }

    if (searchCategory === 'isArchived') {
        query.isArchived = {};
        if (searchIsArchived === '1') {
            query.isArchived[Op.eq] = true;
        } else if (searchIsArchived === '0') query.isArchived[Op.eq] = false;
        else {
            query.isArchived[Op.in] = [true, false];
        }
    }

    if (csv) {
        if (!adminRoles.includes(req.user.role)) {
            res.status(401).json({
                success: false,
                message: 'Nie masz uprawnień do generowania pliku CSV.'
            });
        }
    }

    if (correctorRoles.includes(req.user.role)) {
        let subQuery = {
            [Op.and]: [
                { id_corrector: null },
                { id_publications_states: publicationStates.FOR_CORRECTION }
            ]
        };
        query[Op.or] = [
            { ...subQuery },
            { id_corrector: req.user.id },
            { id_author: req.user.id }
        ];
    } else if (publishRoles.includes(req.user.role)) {
        let subQuery = {};
        subQuery.id_publications_states = {};
        subQuery.id_publications_states[Op.ne] = publicationStates.DRAFT;
        query[Op.or] = [
            { ...subQuery },
            { id_author: req.user.id }
        ];
    } else {
        query.id_author = {};
        query.id_author[Op.eq] = req.user.id;
    }

    let orderPublication = [['id_publications_states', 'ASC']];
    if (sortBy) {
        const sortByObject = JSON.parse(sortBy);
        if (sortByObject.id === 'author.nick') {
            orderPublication = [[{ model: User, as: 'author' }, 'nick', sortByObject.desc ? 'DESC' : 'ASC']];
        } else if (sortByObject.id === 'corrector.nick') {
            orderPublication = [[{ model: User, as: 'corrector' }, 'nick', sortByObject.desc ? 'DESC' : 'ASC']];
        } else if (sortByObject.id === 'publisher.nick') {
            orderPublication = [[{ model: User, as: 'publisher' }, 'nick', sortByObject.desc ? 'DESC' : 'ASC']];
        } else if (sortByObject.id === 'publications_type.type_pl') {
            orderPublication = [[PublicationType, 'type_pl', sortByObject.desc ? 'DESC' : 'ASC']];
        } else if (sortByObject.id === 'publications_state.status') {
            orderPublication = [[PublicationState, 'status', sortByObject.desc ? 'DESC' : 'ASC']];
        } else if (sortByObject.id === 'publications_route.message') {
            orderPublication = [[PublicationRoute, 'message', sortByObject.desc ? 'DESC' : 'ASC']];
        } else {
            orderPublication = [[sortByObject.id, sortByObject.desc ? 'DESC' : 'ASC']];
        }
    }

    const { limit, offset } = getPagination(page, size);
    try {
        const publications = await Publication.findAndCountAll({
            attributes: basicDataShow,
            where: query,
            order: orderPublication,
            limit,
            offset,
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'secondName', 'nick'],
                    as: 'author',
                    where: authorQuery
                },
                {
                    model: User,
                    attributes: ['firstName', 'secondName', 'nick'],
                    as: 'corrector',
                    where: correctorQuery
                },
                {
                    model: User,
                    attributes: ['firstName', 'secondName', 'nick'],
                    as: 'publisher',
                    where: publisherQuery
                },
                {
                    model: PublicationState,
                    attributes: ['status', 'id'],
                    where: publicationStateQuery
                },
                {
                    model: PublicationType,
                    attributes: ['type_pl'],
                    where: publicationTypeQuery
                },
                {
                    model: PublicationRoute,
                    attributes: ['message'],
                    where: publicationRouteQuery
                }
            ]
        });
        const response = getPagingData(publications, page, limit);
        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const getPublicationsForWebsite = async (req, res) => {
    try {
        const publications = await Publication.findAll({
            attributes: ['id', 'title', 'content', 'publishedAt'],
            where: {
                id_publications_states: publicationStates.PUBLISHED
            },
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'secondName', 'nick'],
                    as: 'author'
                },
                {
                    model: PublicationType,
                    attributes: ['type_pl']
                },
                {
                    model: PublicationRoute,
                    where: {
                        route: req.params.route
                    }
                }
            ]

        });
        res.status(200).json(publications);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Przepraszamy, wystąpił błąd. Proszę spróbować później.'
        });
    }
};

const getPublicationById = async (req, res) => {
    try {
        const publication = await Publication.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: PublicationComment,
                    attributes: ['id', 'comment', 'createdAt'],
                    include: [
                        {
                            model: User,
                            attributes: ['firstName', 'secondName', 'nick', 'id'],
                            include: [
                                {
                                    model: Role,
                                    attributes: ['role_pl']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['firstName', 'secondName', 'nick', 'id'],
                    include: [
                        {
                            model: Role,
                            attributes: ['role_pl']
                        }
                    ],
                    as: 'author'
                },
                {
                    model: User,
                    attributes: ['firstName', 'secondName', 'nick', 'id'],
                    include: [
                        {
                            model: Role,
                            attributes: ['role_pl']
                        }
                    ],
                    as: 'corrector'
                },
                {
                    model: User,
                    attributes: ['firstName', 'secondName', 'nick', 'id'],
                    include: [
                        {
                            model: Role,
                            attributes: ['role_pl']
                        }
                    ],
                    as: 'publisher'
                }
            ]
        });
        if (!publication) {
            res.status(400).json({
                success: false,
                message: 'Nie znaleziono takiej publikacji.'
            });
            return;
        }
        res.status(200).json(publication);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createPublication = async (req, res) => {
    const { id, id_author } = req.body;
    const createdAt = new Date();
    const id_publications_states = 0;

    try {
        await Publication.create({id, id_author, createdAt, id_publications_states});
        res.json({
            success: true,
            message: 'Publikacja została utworzona!',
            id
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Przepraszamy, wystąpił błąd. Proszę spróbować później.'
        });
    }
};

const updatePublication = async (req, res) => {
    const {
        content,
        title,
        previous_state,
        next_state,
        isArchived,
        id_publications_states,
        id_publications_types = null,
        id_publications_routes = null,
        corrector_id,
        author_id
    } = req.body;

    //SAVE CONTENT && TITLE -----------------------------------------------------------------------
    let contentRaw;
    let length = 0;
    if (content !== undefined) {
        content.blocks.forEach((block) => {
            if (block.text !== '') length += block.text.length;
        });
        contentRaw = JSON.stringify(content);
    }

    if (length > PUBLICATION_MAX_LENGTH) {
        res.status(200).json({
            success: false,
            message: 'Zmiany nie zostały zapisane. Przekroczono limit znaków.'
        });
        return;
    }

    if (title !== undefined) {
        if (title.length > 255) {
            res.status(200).json({
                success: false,
                message: 'Zmiany nie zostały zapisane. Tytuł jest za długi. Maksymalna długość to 255 znaków.'
            });
            return;
        }
    }

    //ARCHIVE || RESTORE --------------------------------------------------------------------------
    let publicationArchiveState;
    let archiveState;
    if (isArchived !== undefined) {
        if (typeof isArchived !== 'boolean') {
            res.status(401).json({
                success: false,
                message: 'Błędne dane wejściowe.'
            });
            console.error('Parametr isArchived nie jest typem boolean!');
            return;
        }

        if (isArchived && rolesCanArchiveInPublish.includes(req.user.role)) {
            publicationArchiveState = publicationStates.TO_PUBLISH;
            archiveState = false;
        } else if (!isArchived
            && id_publications_states === publicationStates.IN_CORRECTION
            && rolesCanArchiveInCorrection.includes(req.user.role)
            && corrector_id === req.user.id) {
            publicationArchiveState = publicationStates.ARCHIVED;
            archiveState = true;
        } else if (!isArchived
            && id_publications_states === publicationStates.IN_CORRECTION
            && rolesCanArchiveInPublish.includes(req.user.role)
            && corrector_id === req.user.id) {
            publicationArchiveState = publicationStates.ARCHIVED;
            archiveState = true;
        } else if (!isArchived
            && (id_publications_states === publicationStates.TO_PUBLISH
                || id_publications_states === publicationStates.PUBLISHED)
            && rolesCanArchiveInPublish.includes(req.user.role)) {
            publicationArchiveState = publicationStates.ARCHIVED;
            archiveState = true;
        } else {
            res.status(401).json({
                success: false,
                message: 'Nie masz uprawnień do przeprowadzenia tej zmiany.'
            });
            return;
        }
    }

    //SEND ----------------------------------------------------------------------------------------
    let next;
    let corrector;
    let publisher;
    if (next_state !== undefined) {
        if (id_publications_states === publicationStates.DRAFT && req.user.id === author_id) {
            next = publicationStates.FOR_CORRECTION;
        } else if (id_publications_states === publicationStates.FOR_CORRECTION
            && rolesCanCorrect.includes(req.user.role)
            && (corrector_id !== null ? corrector_id === req.user.id : true)) {
            next = publicationStates.IN_CORRECTION;
            if (corrector_id === null) {
                corrector = req.user.id;
            }
        } else if (id_publications_states === publicationStates.IN_CORRECTION
            && rolesCanCorrect.includes(req.user.role)
            && corrector_id === req.user.id) {
            next = publicationStates.TO_PUBLISH;
        } else if (id_publications_states === publicationStates.TO_PUBLISH
            && rolesCanPublish.includes(req.user.role)) {
            next = publicationStates.PUBLISHED;
            publisher = req.user.id;
        } else {
            res.status(401).json({
                success: false,
                message: 'Nie masz uprawnień do przeprowadzenia tej zmiany.'
            });
            return;
        }
    }

    //RETURN --------------------------------------------------------------------------------------
    let previous;
    if (previous_state !== undefined) {
        if (id_publications_states === publicationStates.FOR_CORRECTION
            && req.user.id === author_id) {
            previous = publicationStates.DRAFT;
        } else if (id_publications_states === publicationStates.IN_CORRECTION
            && rolesCanReturnInPublish.includes(req.user.role)) {
            previous = publicationStates.FOR_CORRECTION;
        } else if (id_publications_states === publicationStates.IN_CORRECTION
            && rolesCanReturnInCorrection.includes(req.user.role)
            && corrector_id === req.user.id) {
            previous = publicationStates.FOR_CORRECTION;
        } else if (id_publications_states === publicationStates.TO_PUBLISH
            && rolesCanReturnInPublish.includes(req.user.role)) {
            previous = publicationStates.IN_CORRECTION;
        } else if (id_publications_states === publicationStates.PUBLISHED
            && rolesCanReturnInPublish.includes(req.user.role)) {
            previous = publicationStates.TO_PUBLISH;
        } else {
            res.status(401).json({
                success: false,
                message: 'Nie masz uprawnień do przeprowadzenia tej zmiany.'
            });
            return;
        }
    }

    //PUBLICATION STATE ---------------------------------------------------------------------------
    let state;
    if (id_publications_states !== undefined) {
        if (next !== undefined) {
            state = next;
        } else if (previous !== undefined) {
            state = previous;
        } else if (publicationArchiveState !== undefined) {
            state = publicationArchiveState;
        } else
            state = id_publications_states;
    }

    //UPDATED AT ----------------------------------------------------------------------------------
    let updated_date;
    if (content !== undefined || title !== undefined) {
        updated_date = new Date();
    }

    //PUBLISHED AT --------------------------------------------------------------------------------
    let published_date;
    if (next_state && next === publicationStates.PUBLISHED) {
        published_date = new Date();
    } else {
        published_date = null;
    }

    try {
        await Publication.update({
            title,
            isArchived: archiveState,
            publishedAt: published_date,
            updatedAt: updated_date,
            id_corrector: corrector_id ? corrector_id : corrector,
            id_publisher: publisher ? publisher : null,
            id_publications_states: state,
            id_publications_routes,
            id_publications_types,
            content: contentRaw
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            success: true,
            message: 'Zapisano pomyślnie.'
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Przepraszamy, wystąpił błąd. Spróbuj ponownie później.'
        });
    }
};

const deletePublication = async (req, res) => {
    const { id_publications_states, id_author, id } = req.body;

    if (id_publications_states !== publicationStates.DRAFT || req.user.id !== id_author) {
        res.status(401).json({
            success: false,
            message: 'Nie można usunąć publikacji z takim stanem edycji lub nie masz uprawnień by to zrobić.'
        });
        return;
    }

    try {
        await Publication.destroy({
            where: {
                id
            }
        });
        res.status(200).json({
            success: true,
            message: 'Publikacja została usunięta!'
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Przepraszamy, wystąpił błąd. Spróbuj ponownie później.'
        });
    }
};

module.exports = {
    getAllPublicationForPanel,
    getPublicationsForWebsite,
    getPublicationById,
    createPublication,
    updatePublication,
    deletePublication
}