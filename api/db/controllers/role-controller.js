const Role = require('../models/role-model.js');
const { adminRoles, excludeAdminRoles, mainAdminRole } = require('../../config/user-data.js');
const { Op } = require('sequelize');

const getAllRole = async (req, res) => {
    let excludeHeadAdminRole = [];
    if (req.user.role !== '9') excludeHeadAdminRole = adminRoles;
    try {
        const roles = await Role.findAll({ where: { id: { [Op.not]: excludeHeadAdminRole } } });
        res.json(roles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!role) {
            res.json({
                success: false,
                message: 'Nie znaleziono takiej roli.'
            });
            return;
        }
        res.json(role);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

module.exports = {
    getAllRole,
    getRoleById
}