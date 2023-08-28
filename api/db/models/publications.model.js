import { Sequelize } from 'sequelize';
import Database from '../database.js';
import PublicationType from './publications-types.model.js';
import PublicationState from './publications-states.model.js';
import User from './users.model.js';
import PublicationComment from './publication-comments.model.js';
import PublicationRoute from './publications-routes.model.js';
const { DataTypes } = Sequelize;

const Publication = Database.define(
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

export default Publication;
