const { Sequelize } = require('sequelize');
const db = require('../db.js');

const { DataTypes } = Sequelize;

const PublicationRoute = db.define('publications_routes', {
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

module.exports = PublicationRoute;