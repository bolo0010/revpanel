const PublicationState = require('../models/publication-state-model.js');

const getAllPublicationState = async (req, res) => {
    try {
        const states = await PublicationState.findAll();
        res.status(200).json(states);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const getPublicationStateById = async (req, res) => {
    try {
        const state = await PublicationState.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!state) {
            res.status(200).json({
                success: false,
                message: 'Nie znaleziono takiego stanu.'
            });
            return;
        }
        res.json(state);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

module.exports = {
    getAllPublicationState,
    getPublicationStateById
}
