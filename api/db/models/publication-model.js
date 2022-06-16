const { Sequelize } = require('sequelize');
const db = require('../db.js');
const PublicationType = require('./publication-type-model.js');
const PublicationState = require('./publication-state-model.js');
const User = require('./user-model.js');
const PublicationComment = require('./publication-comment-model.js');
const PublicationRoute = require('./publication-route.model.js');
const { DataTypes } = Sequelize;

const Publication = db.define(
    'publications',
    {
        id: {
            defaultValue: Sequelize.UUIDV4,
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(255),
            defaultValue: 'Brak tytułu',
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(25000),
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
        },
        updatedAt: DataTypes.DATE,
        publishedAt: DataTypes.DATE,
        id_author: {
            type: DataTypes.UUID,
            allowNull: false
        },
        id_corrector: {
            type: DataTypes.UUID,
            allowNull: true
        },
        id_publisher: {
            type: DataTypes.UUID,
            allowNull: true
        },
        id_publications_types: {
            type: DataTypes.UUID,
            allowNull: true
        },
        id_publications_states: {
            type: DataTypes.UUID,
            defaultValue: 0,
            allowNull: false
        },
        id_publications_routes: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isArchived: {
            type: DataTypes.TINYINT(4),
            defaultValue: 0,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

Publication.hasOne(PublicationType, {
    foreignKey: 'id',
    sourceKey: 'id_publications_types'
});

Publication.hasOne(PublicationState, {
    foreignKey: 'id',
    sourceKey: 'id_publications_states'
});

Publication.hasOne(PublicationRoute, {
    foreignKey: 'id',
    sourceKey: 'id_publications_routes'
});

Publication.hasOne(User, {
    foreignKey: 'id',
    sourceKey: 'id_author',
    as: 'author'
});

Publication.hasOne(User, {
    foreignKey: 'id',
    sourceKey: 'id_corrector',
    as: 'corrector'
});

Publication.hasOne(User, {
    foreignKey: 'id',
    sourceKey: 'id_publisher',
    as: 'publisher'
});

Publication.hasMany(PublicationComment, {
    foreignKey: 'id_publication',
    sourceKey: 'id'
});

module.exports = Publication;
