import PublicationType from '../models/publications-types.model.js';
import { FailedResponses } from '../../config/responses.js';

export const getAllPublicationType = async (req, res) => {
    try {
        const types = await PublicationType.findAll();
        res.status(200).json(types);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const getPublicationTypeById = async (req, res) => {
    try {
        const type = await PublicationType.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!type) {
            res.status(200).json({
                success: false,
                message: FailedResponses.PUBLICATION_TYPE_NOT_FOUND
            });
            return;
        }
        res.json(type);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};