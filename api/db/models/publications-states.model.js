import { Sequelize } from 'sequelize';
import Database from '../database.js';

const { DataTypes } = Sequelize;

const PublicationState = Database.define('publications_states', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING(32),
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default PublicationState;