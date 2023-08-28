import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { Op } from 'sequelize';
import User from '../models/users.model.js';
import { genPassword } from '../../config/jwt.js';
import Role from '../models/roles.model.js';
import { sendRegisterConfirmationEmail } from '../../config/send-email.js';
import { initialDate } from '../../config/initial-date.js';
import { FailedResponses, SuccessResponses } from '../../config/responses.js';
import { AdminsGroup, Roles } from '../../config/roles.js';
import { getPagination, getPagingData } from '../../config/pagination.js';
import Database from '../database.js';

export const getAllUsers = async (req, res) => {
    const {
        page,
        size,
        searchQuery,
        searchFromDateQuery,
        searchToDateQuery,
        searchIsActive,
        searchIsTermsAccepted,
        searchCategory,
        sortBy
    } = req.query;

    let query = {
        dateOfBirth: {
            [Op.between]: [searchFromDateQuery || initialDate, searchToDateQuery || new Date()]
        }
    };

    switch (searchCategory) {
        case 'nick': {
            query.nick = {};
            query.nick[Op.like] = `%${searchQuery}%`;
            break;
        }
        case 'email': {
            query.email = {};
            query.email[Op.like] = `%${searchQuery}%`;
            break;
        }
        case 'firstName': {
            query.firstName = {};
            query.firstName[Op.like] = `%${searchQuery}%`;
            break;
        }
        case 'secondName': {
            query.secondName = {};
            query.secondName[Op.like] = `%${searchQuery}%`;
            break;
        }
        case 'title': {
            query.title = {};
            query.title[Op.like] = `%${searchQuery}%`;
            break;
        }
        case 'province': {
            query.province = {};
            query.province[Op.like] = `%${searchQuery}%`;
            break;
        }
        case 'city': {
            query.city = {};
            query.city[Op.like] = `%${searchQuery}%`;
            break;
        }
        case 'inpost': {
            query.inpost = {};
            query.inpost[Op.like] = `%${searchQuery}%`;
            break;
        }
        case 'isTermsAccepted': {
            if (searchIsTermsAccepted === '-1') break;
            query.isTermsAccepted = {};
            if (searchIsTermsAccepted === '1') {
                query.isTermsAccepted[Op.eq] = true;
            } else if (searchIsTermsAccepted === '0') query.isTermsAccepted[Op.eq] = false;
            break;
        }
        case 'isActive': {
            if (searchIsActive === '-1') break;
            query.isActive = {};
            if (searchIsActive === '1') {
                query.isActive[Op.eq] = true;
            } else if (searchIsActive === '0') query.isActive[Op.eq] = false;
            break;
        }
    }

    let roleQuery = {};
    if (searchCategory === 'role') {
        roleQuery.role_pl = {};
        roleQuery.role_pl[Op.like] = `%${searchQuery}%`;
    }

    let orderUser = [['isActive', 'DESC']];
    if (sortBy) {
        const sortByObject = JSON.parse(sortBy);
        if (sortByObject.id !== 'role.role_pl')
            orderUser = [[sortByObject.id, sortByObject.desc ? 'DESC' : 'ASC']];
        else if (sortByObject.id === 'role.role_pl')
            orderUser = [[Role, 'role_pl', sortByObject.desc ? 'DESC' : 'ASC']];
    }

    const { limit, offset } = getPagination(page, size);

    try {
        const users = await User.findAndCountAll({
            attributes: [
                'id',
                'email',
                'nick',
                'firstName',
                'secondName',
                'title',
                'province',
                'city',
                'phoneNumber',
                'inpost',
                'dateOfBirth',
                'isActive',
                'isTermsAccepted',
                'createdAt'
            ],
            where: query,
            order: orderUser,
            limit,
            offset,
            include: [
                {
                    model: Role,
                    attributes: ['id', 'role_pl'],
                    where: roleQuery
                }
            ]
        });
        const response = getPagingData(users, page, limit);
        res.status(200).json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const getUserBirthday = async (req, res) => {
    try {
        const users = await User.findAndCountAll({
            attributes: ['dateOfBirth', 'firstName', 'secondName'],
            where: {
                [Op.and]: [
                    Database.where(Database.fn('DAY', Database.col('dateOfBirth')), moment().format('DD')),
                    Database.where(Database.fn('MONTH', Database.col('dateOfBirth')), moment().format('MM'))
                ]
            }
        });
        if (users.count < 1) {
            res.status(200).json({
                success: false,
                message: SuccessResponses.BIRTHDAY_NONE
            });
        } else {
            res.status(200).json({
                success: true,
                users
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({
            attributes: [
                'id',
                'email',
                'nick',
                'firstName',
                'secondName',
                'title',
                'province',
                'city',
                'phoneNumber',
                'inpost',
                'dateOfBirth',
                'isActive',
                'isTermsAccepted'
            ],
            where: { id },
            include: [
                {
                    model: Role,
                    attributes: ['id', 'role_pl']
                }
            ]
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: FailedResponses.USER_NOT_FOUND
            });
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const createUser = async (req, res) => {
    const { email, nick, firstName, secondName, title, dateOfBirth, id_role, password } = req.body;
    const { role } = req.user;

    if (!email || !nick || !firstName || !secondName || !title || !id_role || !password) {
        res.status(401).json({
            success: false,
            message: FailedResponses.INPUTS_ARE_EMPTY
        });
        return;
    }

    if (id_role === Roles.ADMIN || id_role === Roles.HEADADMIN && role !== Roles.HEADADMIN) {
        res.status(401).json({
            success: false,
            message: FailedResponses.DONT_HAVE_PERMISSIONS
        });
        return;
    }

    const saltHash = genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const createdAt = new Date();

    try {
        await User.create({
            id: uuid(),
            email,
            nick,
            firstName,
            secondName,
            title,
            dateOfBirth,
            hash,
            salt,
            id_role,
            createdAt
        });
        await sendRegisterConfirmationEmail({ email, firstName, nick, password });
        res.status(200).json({
            success: true,
            message: SuccessResponses.USER_CREATE_SUCCESS
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const updateUser = async (req, res) => {
    const {
        inpost,
        province,
        phoneNumber,
        city,
        firstName,
        secondName,
        title,
        dateOfBirth,
        nick,
        isTermsAccepted,
        password
    } = req.body;
    const { id, role } = req.user;

    if (AdminsGroup.includes(role)) {
        if (!firstName || !secondName || !title || !dateOfBirth || !nick)
            res.status(400).json({
                success: false,
                message: FailedResponses.INPUTS_ARE_EMPTY
            });
    }

    let salt = '';
    let hash = '';

    if (password) {
        const saltHash = genPassword(password);
        salt = saltHash.salt;
        hash = saltHash.hash;
    }

    const whatUpdate = () => {
        if (password) {
            return { salt, hash };
        }
        if (isTermsAccepted) {
            return { isTermsAccepted };
        }
        if (AdminsGroup.includes(role)) {
            return { inpost, province, phoneNumber, city, firstName, secondName, title, dateOfBirth, nick };
        }

        return { inpost, province, phoneNumber, city };
    };

    try {
        await User.update(whatUpdate(), {
            where: { id }
        });
        res.status(200).json({
            success: true,
            message: SuccessResponses.USER_UPDATE_SUCCESS
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const updateAllUsers = async (req, res) => {
    const { isTermsAccepted, isActive } = req.body;

    try {
        await User.update({ isTermsAccepted, isActive }, {
            attributes: [isTermsAccepted, isActive],
            where: {
                id_role: {
                    [Op.notIn]: AdminsGroup
                }
            }
        });
        res.status(200).json({
            success: true,
            message: SuccessResponses.USERS_UPDATE_SUCCESS
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const getCurrentUser = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await User.findOne({
            attributes: [
                'id',
                'email',
                'nick',
                'firstName',
                'secondName',
                'title',
                'province',
                'city',
                'phoneNumber',
                'inpost',
                'dateOfBirth',
                'isActive',
                'isTermsAccepted',
            ],
            where: { id },
            include: [
                {
                    model: Role,
                    attributes: ['id', 'role_pl']
                }
            ]
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: FailedResponses.USER_NOT_FOUND
            });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};

export const updateUserById = async (req, res) => {
    const {
        email,
        nick,
        firstName,
        secondName,
        title,
        dateOfBirth,
        id_role,
        province,
        city,
        phoneNumber,
        inpost,
        isActive,
        isTermsAccepted,
        password
    } = req.body;
    const { role } = req.user;
    const { id } = req.params;

    if (!email || !nick || !firstName || !secondName || !title || !dateOfBirth) {
        res.status(400).json({
            success: false,
            message: FailedResponses.INPUTS_ARE_EMPTY
        });
        return;
    }

    try {
        const user = await User.findOne({
            attributes: ['id_role'],
            where: { id }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: FailedResponses.USER_NOT_FOUND
            });
            return;
        }
        if ((user.id_role === Roles.ADMIN || user.id_role === Roles.HEADADMIN) && role !== Roles.HEADADMIN) {
            res.status(401).json({
                success: false,
                message: FailedResponses.DONT_HAVE_PERMISSIONS
            });
            return;
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }

    if ((id_role === Roles.ADMIN || id_role === Roles.HEADADMIN) && role !== Roles.HEADADMIN) {
        res.status(401).json({
            success: false,
            message: FailedResponses.DONT_HAVE_PERMISSIONS
        });
        return;
    }

    let salt = '';
    let hash = '';
    if (password) {
        const saltHash = genPassword(password);
        salt = saltHash.salt;
        hash = saltHash.hash;
    }

    const whatUpdate = () => {
        const attributes = {
            email,
            nick,
            firstName,
            secondName,
            title,
            dateOfBirth,
            id_role,
            province,
            city,
            phoneNumber,
            inpost,
            isActive,
            isTermsAccepted
        };

        if (password) {
            return { hash, salt, ...attributes };
        } else {
            return attributes;
        }
    };

    try {
        await User.update(whatUpdate(), {
            where: { id }
        });
        res.status(200).json({
            success: true,
            message: SuccessResponses.USER_UPDATE_SUCCESS
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: FailedResponses.SERVER_ERROR
        });
    }
};