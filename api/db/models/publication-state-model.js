const { Sequelize } = require('sequelize');
const db = require('../db.js');

const { DataTypes } = Sequelize;

const PublicationState = db.define('publications_states', {
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

module.exports = PublicationState;