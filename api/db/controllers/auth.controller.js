import User from '../models/users.model.js';
import Role from '../models/roles.model.js';
import { issueJWT, validPassword } from '../../config/jwt.js';
import { FailedResponses, SuccessResponses } from '../../config/responses.js';

export const loginUser = (req, res, next) => {
    let cookieAge = 86400000; //1 day

    if (req.body.remember) {
        cookieAge = 1209600000; //14 days
    }

    User.findOne({ where: { nick: req.body.login } })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ success: false, message: FailedResponses.LOGIN_FAILED });
            }

            const isValid = validPassword(req.body.password, user.hash, user.salt);

            if (isValid) {
                Role.findOne({
                    where: {
                        id: user.id_role
                    }
                }).then((role) => {
                    const { token } = issueJWT(user, role);

                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                        maxAge: cookieAge
                    });

                    res.status(200).json({
                        success: true,
                        message: SuccessResponses.LOGIN_SUCCESS
                    });
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: FailedResponses.LOGIN_FAILED
                });
            }
        })
        .catch((err) => {
            next(err);
        });
};

export const logoutUser = (req, res) => {
    if (req.cookies['token']) {
        res.clearCookie('token').status(200).json({
            success: true,
            message: SuccessResponses.LOGOUT_SUCCESS
        });
    } else {
        res.status(401).json({
            success: false,
            message: FailedResponses.LOGOUT_FAILED
        });
    }
};

export const userIsLogged = (req, res) => {
    const { id } = req.user;

    User.findOne({
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
    })
        .then((user) => {
            if (!user) {
                res.status(401).json({
                    success: false,
                    isLogged: false,
                    isActive: false,
                    isTermsAccepted: false,
                    message: FailedResponses.LOGIN_FAILED
                });
            } else {
                if (user.isActive) {
                    if (user.isTermsAccepted) {
                        res.status(200).json({
                            success: true,
                            isTermsAccepted: true,
                            isLogged: true,
                            isActive: true,
                            user
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            isTermsAccepted: false,
                            isLogged: true,
                            isActive: true,
                            message: FailedResponses.TERMS_REJECTED,
                            user
                        });
                    }
                } else {
                    res.status(401).json({
                        success: false,
                        isLogged: false,
                        isActive: false,
                        isTermsAccepted: false,
                        message: FailedResponses.USER_IS_BLOCKED
                    });
                }
            }
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).json({
                success: false,
                isLogged: false,
                isActive: false,
                isTermsAccepted: false,
                message: FailedResponses.SERVER_ERROR
            });
        });
};
