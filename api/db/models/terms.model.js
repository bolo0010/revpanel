import { Sequelize } from 'sequelize';
import Database from '../database.js';

const { DataTypes } = Sequelize;

const Term = Database.define(
    'terms',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        link: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

export default Term;