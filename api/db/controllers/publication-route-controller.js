const PublicationRoute = require('../models/publication-route.model.js');


const getPublicationRoutes = async (req, res) => {
    try {
        const routes = await PublicationRoute.findAll();
        res.status(200).json(routes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const getPublicationRouteById = async (req, res) => {
    try {
        const route = await PublicationRoute.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(route);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

module.exports = {
    getPublicationRouteById,
    getPublicationRoutes
}