const { adminRoles, mainAdminRole } = require('../config/user-data.js');

const checkUserHaveAdminRoles = (role) => {
    return adminRoles.includes(role);
};

const checkUserHaveHeadAdminRole = (role) => {
    return mainAdminRole === role;
};

const canSeeRoles = (req, res, next) => {
    if (checkUserHaveAdminRoles(req.user.role)) next();
    else {
        res.status(401).json({
            success: false,
            message: 'Nie posiadasz uprawnień potrzebnych do wyświetlenia i zarządzania rolami!'
        });
    }
};

const canModifyAndSeeUsers = (req, res, next) => {
    if (checkUserHaveAdminRoles(req.user.role)) next();
    else {
        res.status(401).json({
            success: false,
            message: 'Nie posiadasz uprawnień potrzebnych do zarządzania użytkownikami!'
        });
    }
};

module.exports = {
    canSeeRoles,
    canModifyAndSeeUsers
}