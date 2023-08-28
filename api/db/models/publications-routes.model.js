import { Sequelize } from 'sequelize';
import Database from '../database.js';

const { DataTypes } = Sequelize;

const PublicationRoute = Database.define('publications_routes', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    route: {
        type: DataTypes.STRING(75),
        allowNull: false
    },
    message: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default PublicationRoute;