const Term = require('../models/term-model.js');

const getTerms = async (req, res) => {
    try {
        const term = await Term.findOne({
            attributes: ['text', 'link', 'name']
        });
        res.json(term);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const updateTerms = async (req, res) => {
    const { text, link, name } = req.body;

    try {
        await Term.update({ text, link, name }, {
            where: {
                id: 1
            }
        });
        res.status(200).json({
            success: true,
            message: 'Dane komunikatu zostały zaktualizowane.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

module.exports = {
    getTerms,
    updateTerms
}