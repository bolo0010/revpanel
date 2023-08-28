import { Sequelize } from 'sequelize';
import Database from '../database.js';
import User from './users.model.js';

const { DataTypes } = Sequelize;

const PublicationComment = Database.define('publications_comments', {
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

export default PublicationComment;