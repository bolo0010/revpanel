const moment = require('moment');
const sequelize = require('sequelize');
const { v4: uuid } = require('uuid');
const { Op } = require('sequelize');
const User = require('../models/user-model.js');
const { genPassword } = require('../../config/jwt.js');
const {
    adminRoles,
    advancedDataShow,
    advancedDataUpdate,
    basicDataShow,
    mainAdminRole
} = require('../../config/user-data.js');
const Role = require('../models/role-model.js');
const { sendRegisterConfirmationEmail } = require('../../config/send-email.js');
const { startInitialDate } = require('../../config/initial-dates.js');
const { basicDataAdminUpdate } = require('../../config/user-data');

moment.suppressDeprecationWarnings = true;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, totalPages, currentPage, users };
};

const getAllUsers = async (req, res) => {
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
            [Op.between]: [searchFromDateQuery || startInitialDate, searchToDateQuery || new Date()]
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
        const user = await User.findAndCountAll({
            attributes: advancedDataShow,
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
        const response = getPagingData(user, page, limit);
        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const getUserBirthdayOfToday = async (req, res) => {
    try {
        const users = await User.findAndCountAll({
            attributes: ['dateOfBirth', 'firstName', 'secondName'],
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('DAY', sequelize.col('dateOfBirth')), moment().format('DD')),
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('dateOfBirth')), moment().format('MM'))
                ]
            }
        });
        if (users.count < 1) {
            res.status(200).json({
                success: false,
                message: 'Dzisiaj nikt nie świętuje.'
            });
            return;
        }
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: req.params.all ? advancedDataShow : basicDataShow,
            where: {
                id: req.params.id
            },
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
                message: 'Nie znaleziono użytkownika.'
            });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const createUser = async (req, res) => {
    const { email, nick, firstName, secondName, title, dateOfBirth, id_role, password } = req.body;
    const createdAt = new Date();

    if (!email || !nick || !firstName || !secondName || !title || !id_role) {
        res.status(401).json({
            success: false,
            message: 'Niektóre wymagane pola są puste!'
        });
        return;
    }

    if (id_role === '8' || id_role === '9' && req.user.role !== mainAdminRole) {
        res.status(401).json({
            success: false,
            message: 'Nie masz uprawnień do nadania takiej roli.'
        });
        return;
    }

    if (!password) {
        res.status(401).json({
            success: false,
            message: 'Nie podano hasła!'
        });
        return;
    }
    const saltHash = genPassword(password);

    let id = req.id;
    if (req.id !== '') {
        id = uuid();
    }

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    try {
        await User.create({
            email,
            nick,
            firstName,
            secondName,
            title,
            dateOfBirth,
            hash,
            salt,
            id_role,
            id,
            createdAt
        });
        await sendRegisterConfirmationEmail({ email, firstName, nick, password });
        res.status(200).json({
            success: true,
            message: 'Użytkownik został utworzony.'
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const updateUser = async (req, res) => {
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
        isTermsAccepted
    } = req.body;
    const { role } = req.user;

    let admin = false;

    if (adminRoles.includes(role)) admin = true;

    if (admin) {
        if (firstName === '' || secondName === '' || title === '' || dateOfBirth === '' || nick === '')
            res.status(400).json({
                success: false,
                message: 'Wymagane pola nie mogą być puste.'
            });
    }

    let salt = '';
    let hash = '';

    if (req.body.password) {
        const saltHash = genPassword(req.body.password);
        salt = saltHash.salt;
        hash = saltHash.hash;
    }

    try {
        await User.update(
            req.body.password ? { salt, hash }
                : isTermsAccepted ? { isTermsAccepted }
                    : admin ?
                        { inpost, province, phoneNumber, city, firstName, secondName, title, dateOfBirth, nick }
                        : { inpost, province, phoneNumber, city },
            {
                where: {
                    id: req.user.id
                }
            });
        res.status(200).json({
            success: true,
            message: 'Użytkownik został zaktualizowany.'
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const updateAllUsers = async (req, res) => {
    const { isTermsAccepted, isActive } = req.body;

    if (isTermsAccepted === undefined && isActive === undefined) {
        res.status(401).json({
            success: false,
            message: 'Nie otrzymano wymaganych danych do przeprowadzenia aktualizacji.'
        });
        return;
    }

    try {
        await User.update({ isTermsAccepted, isActive }, {
            attributes: [isTermsAccepted, isActive],
            where: {
                id_role: {
                    [Op.notIn]: adminRoles
                }
            }
        });
        res.status(200).json({
            success: true,
            message: 'Użytkownicy zostali zaktualizowani.'
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

const updateUserById = async (req, res) => {
    let salt = '';
    let hash = '';

    if (!req.body.email || !req.body.nick || !req.body.firstName || !req.body.secondName || !req.body.title || !req.body.dateOfBirth) {
        res.status(400).json({
            success: false,
            message: 'Nie można zaktualizować danych o pusty formularz!'
        });
        return;
    }

    try {
        const user = await User.findOne({
            attributes: ['id_role'],
            where: {
                id: req.params.id
            }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Nie znaleziono użytkownika.'
            });
            return;
        }
        if ((user.id_role === '8' || user.id_role === '9') && req.user.role !== mainAdminRole) {
            res.status(401).json({
                success: false,
                message: 'Nie masz uprawnień do zmiany danych tego użytkownika.'
            });
            return;
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }

    if ((req.body.id_role === '8' || req.body.id_role === '9') && req.user.role !== mainAdminRole) {
        res.status(401).json({
            success: false,
            message: 'Nie masz uprawnień do nadania takiej roli.'
        });
        return;
    }

    if (req.body.password) {
        const saltHash = genPassword(req.body.password);
        salt = saltHash.salt;
        hash = saltHash.hash;
    }


    const values = hash ? { salt, hash, ...req.body } : { ...req.body };
    try {
        await User.update(values, {
            attributes: req.body.password ? ['salt', 'hash', ...advancedDataUpdate] : advancedDataUpdate,
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            success: true,
            message: 'Użytkownik został zaktualizowany.'
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Wystąpił błąd, spróbuj ponownie później.'
        });
    }
};

module.exports = {
    getAllUsers,
    getUserBirthdayOfToday,
    getUserById,
    createUser,
    updateUser,
    updateAllUsers,
    updateUserById
};
