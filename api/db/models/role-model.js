const { Sequelize } = require('sequelize');
const db = require('../db.js');

const { DataTypes } = Sequelize;

const Role = db.define(
    'roles',
    {
        id: {
            type: DataTypes.STRING(2),
            allowNull: false,
            primaryKey: true
        },
        role: {
            type: DataTypes.STRING(18),
            allowNull: false
        },
        role_pl: {
            type: DataTypes.STRING(24),
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Role;
