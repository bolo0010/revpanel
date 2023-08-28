import Publication from '../models/publications.model.js';
import User from '../models/users.model.js';
import PublicationComment from '../models/publication-comments.model.js';
import Role from '../models/roles.model.js';
import { PUBLICATION_MAX_LENGTH, } from '../../config/length.js';
import { initialDate } from '../../config/initial-date.js';
import { PublicationStates } from '../../config/publication-states.js';
import PublicationType from '../models/publications-types.model.js';
import PublicationRoute from '../models/publications-routes.model.js';
import PublicationState from '../models/publications-states.model.js';
import Op from 'sequelize/lib/operators';
import { FailedResponses, SuccessResponses } from '../../config/responses.js';
import { getPagination, getPagingData } from '../../config/pagination.js';
import moment from 'moment';
import { AdminsGroup, CorrectorsGroup, ModeratorsGroup, ReviewersGroup, Roles } from '../../config/roles.js';
import Database from '../database.js';

export const getAllPublicationForPanel = async (req, res) => {
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
    const { id, role } = req.user;

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
            [Op.between]: [
                searchFromDateCreateQuery || initialDate,
                searchToDateCreateQuery || moment().local()
            ]
        },
        updatedAt: {
            [Op.or]: {
                [Op.between]: [
                    searchFromDateUpdateQuery || initialDate,
                    searchToDateUpdateQuery || moment().local()
                ],
                [Op.is]: null
            }
        },
        publishedAt: {
            [Op.or]: {
                [Op.between]: [
                    searchFromDatePublishQuery || initialDate,
                    searchToDatePublishQuery || new Date('2199')
                ],
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
        if (!AdminsGroup.includes(role)) {
            res.status(401).json({
                success: false,
                message: FailedResponses.DONT_HAVE_PERMISSIONS
            });
        }
    }

    if (Roles.CORRECTOR === role) {
        let subQuery = {
            [Op.and]: [
                { id_corrector: null },
                { id_publications_states: PublicationStates.FOR_CORRECTION }
            ]
        };
        query[Op.or] = [{ ...subQuery }, { id_corrector: id }, { id_author: id }];
    } else if ([...AdminsGroup, ...ModeratorsGroup].includes(role)) {
        let subQuery = {};
        subQuery.id_publications_states = {};
        subQuery.id_publications_states[Op.ne] = PublicationStates.DRAFT;
        query[Op.or] = [{ ...subQuery }, { id_author: id }];
    } else {
        query.id_author = {};
        query.id_author[Op.eq] = id;
    }

    let orderPublication = [
        [Database.fn('isnull', Database.col('updatedAt')), 'DESC'],
        ['updatedAt', 'DESC']
    ];

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
            attributes: [
                'id',
                'title',
                'content',
                'createdAt',
                'updatedAt',
                'publishedAt',
                'isArchived'
            ],
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
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const getPublicationsForWebsite = async (req, res) => {
    const { route } = req.params;

    try {
        const publications = await Publication.findAll({
            attributes: ['id', 'title', 'content', 'publishedAt'],
            where: {
                id_publications_states: PublicationStates.PUBLISHED
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
                    where: { route }
                }
            ]

        });
        res.status(200).json(publications);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const getPublicationById = async (req, res) => {
    const { id } = req.params;

    try {
        const publication = await Publication.findOne({
            where: { id },
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
                message: FailedResponses.PUBLICATION_NOT_FOUND
            });
            return;
        }
        res.status(200).json(publication);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const createPublication = async (req, res) => {
    const { id, id_author } = req.body;
    const id_publications_states = 0;
    const createdAt = new Date();

    try {
        await Publication.create({ id, id_author, createdAt, id_publications_states });
        res.json({
            success: true,
            message: SuccessResponses.PUBLICATION_CREATE_SUCCESS,
            id
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const archivePublication = async (req, res) => {
    const { isArchived } = req.body;
    const { id } = req.params;
    const { role } = req.user;

    if (![...CorrectorsGroup, ...ModeratorsGroup, ...AdminsGroup].includes(role)) {
        res.status(401).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
        return;
    }

    if (isArchived && !AdminsGroup.includes(role)) {
        res.status(401).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
        return;
    }

    let state;

    if (isArchived) {
        state = PublicationStates.IN_CORRECTION;
    } else {
        state = PublicationStates.ARCHIVED;
    }
    try {
        await Publication.update(
            { isArchived: !isArchived, id_publications_states: state },
            { where: { id } }
        );
        return res.status(200).json({
            success: true,
            message: isArchived
                ? SuccessResponses.PUBLICATION_RESTORE_SUCCESS
                : SuccessResponses.PUBLICATION_ARCHIVE_SUCCESS
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const updateStateOfPublication = async (req, res) => {
    const {
        previous_state,
        next_state,
        id_publications_states,
        id_author,
        id_corrector,
        route
    } = req.body;
    const { id } = req.params;
    const { role, id: user_id } = req.user;

    let newState;
    let corrector;
    let publisher;

    if (next_state !== undefined && previous_state !== undefined) {
        if (
            id_publications_states === PublicationStates.ARCHIVED ||
            id_publications_states === PublicationStates.FOR_CORRECTION ||
            id_publications_states === PublicationStates.DRAFT ||
            ReviewersGroup.includes(role)
        ) {
            res.status(401).json({
                success: false,
                message: FailedResponses.DONT_HAVE_PERMISSIONS
            });
            return;
        }
    } else if (next_state !== undefined) {
        if (id_publications_states === PublicationStates.DRAFT && user_id === id_author) {
            newState = PublicationStates.FOR_CORRECTION;
        } else if (
            id_publications_states === PublicationStates.FOR_CORRECTION &&
            [...AdminsGroup, ...ModeratorsGroup, ...CorrectorsGroup].includes(role) &&
            (id_corrector !== null ? id_corrector === user_id : true)
        ) {
            newState = PublicationStates.IN_CORRECTION;
            if (id_corrector === null) {
                corrector = user_id;
            }
        } else if (
            id_publications_states === PublicationStates.IN_CORRECTION &&
            [...AdminsGroup, ...ModeratorsGroup].includes(role)
        ) {
            newState = PublicationStates.TO_PUBLISH;
        } else if (
            id_publications_states === PublicationStates.TO_PUBLISH &&
            [...AdminsGroup, ...ModeratorsGroup].includes(role)
        ) {
            if (route === null || route === '-1') {
                res.status(400).json({
                    success: false,
                    message: FailedResponses.PUBLICATION_NOT_SELECTED_ROUTE
                });
                return;
            }
            newState = PublicationStates.PUBLISHED;
            publisher = user_id;
        } else {
            res.status(401).json({
                success: false,
                message: FailedResponses.DONT_HAVE_PERMISSIONS
            });
            return;
        }
    } else if (previous_state !== undefined) {
        if (id_publications_states === PublicationStates.FOR_CORRECTION && user_id === id_author) {
            newState = PublicationStates.DRAFT;
        } else if (
            id_publications_states === PublicationStates.IN_CORRECTION &&
            [...AdminsGroup, ...ModeratorsGroup, ...CorrectorsGroup].includes(role)
        ) {
            newState = PublicationStates.DRAFT;
        } else if (
            id_publications_states === PublicationStates.TO_PUBLISH &&
            [...AdminsGroup, ...ModeratorsGroup].includes(role)
        ) {
            newState = PublicationStates.IN_CORRECTION;
        } else if (
            id_publications_states === PublicationStates.PUBLISHED &&
            [...AdminsGroup, ...ModeratorsGroup].includes(role)
        ) {
            newState = PublicationStates.TO_PUBLISH;
        } else {
            res.status(401).json({
                success: false,
                message: FailedResponses.DONT_HAVE_PERMISSIONS
            });
            return;
        }
    }

    const updatedAt = moment().local();

    let publishedAt;
    if (next_state && newState === PublicationStates.PUBLISHED) {
        publishedAt = moment().local();
    } else {
        publishedAt = null;
    }

    try {
        await Publication.update(
            {
                publishedAt,
                updatedAt,
                id_corrector: id_corrector ? id_corrector : corrector,
                id_publisher: publisher ? publisher : null,
                id_publications_states: newState
            },
            {
                where: { id }
            }
        );

        res.status(200).json({
            success: true,
            message: SuccessResponses.PUBLICATION_STATUS_CHANGE_SUCCESS
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};


export const updatePublication = async (req, res) => {
    const {
        content,
        title,
        id_publications_types = null,
        id_publications_routes = null,
        id_author,
        id_corrector,
        id_publications_states
    } = req.body;
    const { id } = req.params;
    const { id: id_user, role } = req.user;

    if (id_user === id_author && id_publications_states === PublicationStates.DRAFT) {
        res.status(401).json({
            success: false,
            message: FailedResponses.DONT_HAVE_PERMISSIONS
        });
        return;
    } else if (id_corrector === id_user && id_publications_states === PublicationStates.IN_CORRECTION) {
        res.status(401).json({
            success: false,
            message: FailedResponses.DONT_HAVE_PERMISSIONS
        });
        return;
    } else if (
        [...AdminsGroup, ...ModeratorsGroup].includes(role) &&
        id_publications_states !== PublicationStates.PUBLISHED &&
        id_publications_states !== PublicationStates.DRAFT &&
        id_publications_states !== PublicationStates.ARCHIVED &&
        id_publications_states !== PublicationStates.FOR_CORRECTION
    ) {
        res.status(401).json({
            success: false,
            message: FailedResponses.DONT_HAVE_PERMISSIONS
        });
        return;
    }

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
            message: FailedResponses.PUBLICATION_LENGTH
        });
        return;
    }

    if (!title) {
        if (title.length > 255) {
            res.status(200).json({
                success: false,
                message: FailedResponses.PUBLICATION_TITLE_LENGTH
            });
            return;
        }
    }

    const updatedAt = moment().local();

    try {
        await Publication.update({
            title,
            updatedAt,
            id_publications_routes,
            id_publications_types,
            content: contentRaw
        }, {
            where: { id }
        });
        res.status(200).json({
            success: true,
            message: SuccessResponses.PUBLICATION_SAVE_SUCCESS
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const deletePublication = async (req, res) => {
    const { id_publications_states, id_author, id } = req.body;
    const { id: id_user } = req.user;

    if (id_publications_states !== PublicationStates.DRAFT || id_user !== id_author) {
        res.status(401).json({
            success: false,
            message: FailedResponses.DONT_HAVE_PERMISSIONS
        });
        return;
    }

    try {
        await Publication.destroy({
            where: { id }
        });
        res.status(200).json({
            success: true,
            message: SuccessResponses.PUBLICATION_DELETE_SUCCESS
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};
