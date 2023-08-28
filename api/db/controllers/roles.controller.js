import Role from '../models/roles.model.js';
import { Op } from 'sequelize';
import { Roles } from '../../config/roles.js';
import { FailedResponses } from '../../config/responses.js';

export const getAllRole = async (req, res) => {
    let excludeHeadAdminRole = [];
    if (req.user.role !== Roles.HEADADMIN) excludeHeadAdminRole = [Roles.HEADADMIN, Roles.ADMIN];
    try {
        const roles = await Role.findAll({ where: { id: { [Op.not]: excludeHeadAdminRole } } });
        res.json(roles);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const getRoleById = async (req, res) => {
    const { id } = req.params;

    try {
        const role = await Role.findOne({ where: { id } });
        if (!role) {
            res.json({
                success: false,
                message: FailedResponses.ROLE_NOT_FOUND
            });
            return;
        }
        res.json(role);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};
