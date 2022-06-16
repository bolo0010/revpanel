const { Sequelize } = require('sequelize');
const db = require('../db.js');
const User = require('./user-model.js');

const { DataTypes } = Sequelize;

const PublicationComment = db.define('publications_comments', {
    id: {
        defaultValue: Sequelize.UUIDV4,
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    id_user: {
        type: DataTypes.UUID,
        allowNull: false
    },
    id_publication: {
        type: DataTypes.UUID,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING(1200),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    }
}, {
    freezeTableName: true,
    timestamps: false
});

PublicationComment.hasOne(User, {
    foreignKey: 'id',
    sourceKey: 'id_user'
});

module.exports = PublicationComment;