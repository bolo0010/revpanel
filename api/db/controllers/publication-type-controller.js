const PublicationType = require('../models/publication-type-model.js');

const getAllPublicationType = async (req, res) => {
    try {
        const types = await PublicationType.findAll();
        res.status(200).json(types);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const getPublicationTypeById = async (req, res) => {
    try {
        const type = await PublicationType.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!type) {
            res.status(200).json({
                success: false,
                message: 'Nie znaleziono takiego typu.'
            });
            return;
        }
        res.json(type);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

module.exports = {
    getAllPublicationType,
    getPublicationTypeById
}