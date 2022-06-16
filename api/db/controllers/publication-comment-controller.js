const PublicationComment = require('../models/publication-comment-model.js');
const {
    COMMENT_MAX_LENGTH,
    rolesCanCommentInCorrection,
    rolesCanCommentInPublish
} = require('../../config/publication-managment.js');
const { publicationStates } = require('../../config/publication-states.js');


const getPublicationCommentsById = async (req, res) => {
    try {
        const publicationComment = await PublicationComment.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!publicationComment) {
            res.json({
                success: false,
                message: 'Nie znaleziono takiego komentarza do publikacji.'
            });
            return;
        }
        res.json(publicationComment);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Przepraszamy, wystąpił błąd. Spróbuj ponownie później.'
        });
    }
};

const createPublicationComment = async (req, res) => {
    const { id_publication, comment, id_publications_states, corrector_id } = req.body;
    const createdAt = new Date();

    if (rolesCanCommentInCorrection.includes(req.user.role) && corrector_id === req.user.id) {
        if (id_publications_states !== publicationStates.IN_CORRECTION) {
            res.status(401).json({
                success: false,
                message: 'Nie masz takich uprawnień.'
            });
            return;
        }
    } else if (rolesCanCommentInPublish.includes(req.user.role)) {
        if (!(id_publications_states === publicationStates.IN_CORRECTION
            || id_publications_states === publicationStates.TO_PUBLISH
        )) {
            res.status(401).json({
                success: false,
                message: 'Nie masz takich uprawnień.'
            });
            return;
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'Nie masz takich uprawnień.'
        });
        return;
    }

    if (comment === undefined || comment === '') {
        res.status(400).json({
            success: false,
            message: 'Komentarz nie może być pusty.'
        });
        return;
    }

    if (comment.length > COMMENT_MAX_LENGTH) {
        res.status(400).json({
            success: false,
            message: `Komentarz nie może przekroczyć ${COMMENT_MAX_LENGTH} znaków.`
        });
        return;
    }

    if (id_publication === undefined) {
        res.status(400).json({
            success: false,
            message: 'Brak ID publikacji, której dodawany komentarz dotyczy.'
        });
        return;
    }

    try {
        await PublicationComment.create({ id_user: req.user.id, id_publication, comment, createdAt });
        res.status(200).json({
            success: true,
            message: 'Komentarz został utworzony!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Przepraszamy, wystąpił błąd. Spróbuj ponownie później.'
        });
    }
};

const deletePublicationComment = async (req, res) => {
    const { id_author, id } = req.body;

    if (req.user.id !== id_author) {
        res.status(401).json({
            success: false,
            message: 'Nie możesz usunąć czyjegoś komentarza.'
        });
        return;
    }

    try {
        await PublicationComment.destroy({
            where: {
                id
            }
        });
        res.status(200).json({
            success: true,
            message: 'Komentarz do publikacji został usunięty.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Przepraszamy, wystąpił błąd. Spróbuj ponownie później.'
        });
    }
};

module.exports = {
    getPublicationCommentsById,
    createPublicationComment,
    deletePublicationComment
}