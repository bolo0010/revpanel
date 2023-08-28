import PublicationComment from '../models/publication-comments.model.js';
import { COMMENT_MAX_LENGTH } from '../../config/length.js';
import { PublicationStates } from '../../config/publication-states.js';
import { FailedResponses, SuccessResponses } from '../../config/responses.js';
import { AdminsGroup, CorrectorsGroup, ModeratorsGroup, ReviewersGroup } from '../../config/roles.js';


export const getPublicationCommentsById = async (req, res) => {
    const { id } = req.params;

    try {
        const publicationComment = await PublicationComment.findOne({
            where: { id }
        });
        if (!publicationComment) {
            res.json({
                success: false,
                message: FailedResponses.PUBLICATION_COMMENT_NOT_FOUND
            });
            return;
        }
        res.json(publicationComment);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const createPublicationComment = async (req, res) => {
    const { id_publication, comment, id_publications_states, id_corrector } = req.body;
    const { id: id_user, role } = req.user;

    if (id_publication === undefined) {
        res.status(400).json({
            success: false,
            message: FailedResponses.PUBLICATION_COMMENT_PUBLICATION_NOT_FOUND
        });
        return;
    }

    const checkIfUserHasNotCorrectorFunction = () => {
        if (id_publications_states !== PublicationStates.IN_CORRECTION || id_corrector !== id_user) {
            res.status(400).json({
                success: false,
                message: FailedResponses.DONT_HAVE_PERMISSIONS
            });
            return true;
        } else {
            return false;
        }
    };

    switch (role) {
        case ReviewersGroup.includes(role):
            res.status(400).json({
                success: false,
                message: FailedResponses.DONT_HAVE_PERMISSIONS
            });
            return;
        case CorrectorsGroup.includes(role):
            if (checkIfUserHasNotCorrectorFunction()) return;
            break;
        case [...ModeratorsGroup, ...AdminsGroup].includes(role):
            if ([PublicationStates.DRAFT, PublicationStates.FOR_CORRECTION, PublicationStates.ARCHIVED].includes(id_publications_states)) {
                res.status(400).json({
                    success: false,
                    message: FailedResponses.DONT_HAVE_PERMISSIONS
                });
                return;
            }
            if (checkIfUserHasNotCorrectorFunction()) return;
            break;
    }

    if (comment === undefined || comment === '') {
        res.status(400).json({
            success: false,
            message: FailedResponses.PUBLICATION_COMMENT_EMPTY
        });
        return;
    }

    if (comment.length > COMMENT_MAX_LENGTH) {
        res.status(400).json({
            success: false,
            message: FailedResponses.PUBLICATION_COMMENT_LENGTH
        });
        return;
    }

    const createdAt = new Date();

    try {
        await PublicationComment.create({ id_user, id_publication, comment, createdAt });
        res.status(200).json({
            success: true,
            message: SuccessResponses.PUBLICATION_COMMENT_CREATE_SUCCESS
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const deletePublicationComment = async (req, res) => {
    const { id_author, id } = req.body;
    const { id: id_user } = req.user;

    if (id_user !== id_author) {
        res.status(401).json({
            success: false,
            message: FailedResponses.PUBLICATION_COMMENT_DELETE_NOT_AUTHOR
        });
        return;
    }

    try {
        await PublicationComment.destroy({
            where: { id }
        });
        res.status(200).json({
            success: true,
            message: SuccessResponses.PUBLICATION_COMMENT_DELETE_SUCCESS
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};