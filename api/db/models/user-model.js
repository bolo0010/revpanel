const { Sequelize } = require('sequelize');
const db = require('../db.js');
const Role = require('./role-model.js');

const { DataTypes } = Sequelize;

const User = db.define(
    'users',
    {
        id: {
            defaultValue: Sequelize.UUIDV4,
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        hash: {
            type: DataTypes.CHAR(128),
            allowNull: false
        },
        salt: {
            type: DataTypes.CHAR(64),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(64),
            unique: true,
            allowNull: false
        },
        nick: {
            type: DataTypes.STRING(32),
            unique: true,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING(24),
            allowNull: false
        },
        secondName: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
        },
        id_role: {
            type: DataTypes.STRING(2),
            allowNull: false
        },
        isActive: {
            type: DataTypes.TINYINT(4),
            allowNull: false,
            defaultValue: 1
        },
        isTermsAccepted: {
            type: DataTypes.TINYINT(4),
            allowNull: false,
            defaultValue: 0
        },
        province: {
            type: DataTypes.STRING(36),
            defaultValue: ''
        },
        city: {
            type: DataTypes.STRING(50),
            defaultValue: ''
        },
        phoneNumber: {
            type: DataTypes.STRING(10),
            defaultValue: ''
        },
        inpost: {
            type: DataTypes.CHAR(6),
            defaultValue: ''
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(100),
            defaultValue: ''
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

User.hasOne(Role, {
    foreignKey: 'id',
    sourceKey: 'id_role'
});

module.exports = User;
