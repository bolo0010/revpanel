import { AdminsGroup } from '../config/roles.js';

const checkUserHaveAdminRoles = (role) => {
    return AdminsGroup.includes(role);
};
export const canSeeRoles = (req, res, next) => {
    if (checkUserHaveAdminRoles(req.user.role)) next();
    else {
        res.status(401).json({
            success: false,
            message: 'Nie posiadasz uprawnień potrzebnych do wyświetlenia i zarządzania rolami!'
        });
    }
};

export const canModifyAndSeeUsers = (req, res, next) => {
    if (checkUserHaveAdminRoles(req.user.role)) next();
    else {
        res.status(401).json({
            success: false,
            message: 'Nie posiadasz uprawnień potrzebnych do zarządzania użytkownikami!'
        });
    }
};