export const Roles = {
    REVIEWER: '0',
    EDITOR: '1',
    SPECIALIST: '2',
    CORRECTOR: '3',
    MODERATOR: '4',
    ADMIN: '8',
    HEADADMIN: '9'
};

export const ReviewersGroup = [Roles.REVIEWER, Roles.EDITOR, Roles.SPECIALIST]
export const CorrectorsGroup = [Roles.CORRECTOR]
export const ModeratorsGroup = [Roles.MODERATOR]
export const AdminsGroup = [Roles.ADMIN, Roles.HEADADMIN]