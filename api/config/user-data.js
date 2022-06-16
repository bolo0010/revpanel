const basicDataShow = [
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
];

const advancedDataShow = [...basicDataShow, 'id', 'createdAt'];

const basicDataUpdate = ['province', 'city', 'phoneNumber', 'inpost'];

const advancedDataUpdate = [
    ...basicDataUpdate,
    'email',
    'nick',
    'firstName',
    'secondName',
    'title',
    'dateOfBirth',
    'isActive',
    'isTermsAccepted',
    'id_role',
    'hash',
    'salt'
];

const adminRoles = ['8', '9'];
const correctorRoles = ['3'];
const publishRoles = ['4', ...adminRoles];
const mainAdminRole = '9';
const excludeAdminRoles = adminRoles;

module.exports = {
    basicDataShow,
    advancedDataShow,
    basicDataUpdate,
    advancedDataUpdate,
    adminRoles,
    correctorRoles,
    publishRoles,
    mainAdminRole,
    excludeAdminRoles
}