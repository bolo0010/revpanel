import { Sequelize } from 'sequelize';
import Database from '../database.js';

const { DataTypes } = Sequelize;

const Role = Database.define(
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

export default Role;
