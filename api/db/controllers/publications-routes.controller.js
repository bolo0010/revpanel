import PublicationRoute from '../models/publications-routes.model.js';
import { FailedResponses } from '../../config/responses.js';

export const getPublicationRoutes = async (req, res) => {
    try {
        const routes = await PublicationRoute.findAll();
        res.status(200).json(routes);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const getPublicationRouteById = async (req, res) => {
    const { id } = req.params;

    try {
        const route = await PublicationRoute.findOne({
            where: { id }
        });
        res.status(200).json(route);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};