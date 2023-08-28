import { Sequelize } from 'sequelize';
import Database from '../database.js';

const { DataTypes } = Sequelize;

const PublicationType = Database.define('publications_types', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING(24),
        allowNull: false
    },
    type_pl: {
        type: DataTypes.STRING(36),
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default PublicationType;