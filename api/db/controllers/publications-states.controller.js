import PublicationState from '../models/publications-states.model.js';
import { FailedResponses } from '../../config/responses.js';

export const getAllPublicationState = async (req, res) => {
    try {
        const states = await PublicationState.findAll();
        res.status(200).json(states);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const getPublicationStateById = async (req, res) => {
    const { id } = req.params;

    try {
        const state = await PublicationState.findOne({ where: { id } });
        if (!state) {
            res.status(200).json({
                success: false,
                message: FailedResponses.PUBLICATION_STATE_NOT_FOUND
            });
            return;
        }
        res.json(state);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};
