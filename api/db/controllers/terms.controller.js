import Term from '../models/terms.model.js';
import { FailedResponses, SuccessResponses } from '../../config/responses.js';

export const getTerms = async (req, res) => {
    try {
        const term = await Term.findOne({
            attributes: ['text', 'link', 'name']
        });
        res.json(term);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const updateTerms = async (req, res) => {
    // noinspection JSDeprecatedSymbols
    const { text, link, name } = req.body;

    try {
        // noinspection JSDeprecatedSymbols
        await Term.update({ text, link, name }, {
            where: { id: 1 }
        });
        res.status(200).json({
            success: true,
            message: SuccessResponses.TERMS_CHANGED_SUCCESS
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};