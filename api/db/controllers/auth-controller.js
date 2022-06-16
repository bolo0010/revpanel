const User = require('../models/user-model.js');
const Role = require('../models/role-model.js');
const { issueJWT, validPassword } = require('../../config/jwt.js');
const { basicDataShow } = require('../../config/user-data.js');

const loginUser = (req, res, next) => {
    let cookieAge = 86400000; //1 day (default)

    if (req.body.remember) {
        cookieAge = 1209600000; //14 days
    }

    User.findOne({ where: { nick: req.body.login } })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ success: false, message: 'Nieprawidłowy login lub hasło!' });
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
                        maxAge: cookieAge,
                        secure: true
                    });

                    res.status(200).json({
                        success: true,
                        message: 'Zalogowano pomyślnie.'
                        // user_id: user.id
                    });
                });
            } else {
                res.status(401).json({ success: false, message: 'Nieprawidłowy login lub hasło!' });
            }
        })
        .catch((err) => {
            next(err);
        });
};

const logoutUser = (req, res) => {
    if (req.cookies['token']) {
        res.clearCookie('token').status(200).json({
            success: true,
            message: 'Wylogowano pomyślnie.'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Niepoprawny token.'
        });
    }
};

const userIsLogged = (req, res) => {
    User.findOne({
        attributes: basicDataShow,
        where: { id: req.user.id },
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
                    message: 'Nieprawidłowy login lub hasło!'
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
                            user,
                            message: 'Nie zaakceptowano regulaminu.'
                        });
                    }
                } else {
                    res.status(401).json({
                        success: false,
                        isLogged: false,
                        isActive: false,
                        isTermsAccepted: false,
                        message: 'Ten użytkownik jest zablokowany!'
                    });
                }
            }
        })
        .catch((error) => {
            console.error(error.message);
            res.status(500).json({
                success: false,
                isLogged: false,
                isActive: false,
                isTermsAccepted: false,
                message: 'Wystąpił błąd, spróbuj ponownie później.'
            });
        });
};

module.exports = {
    loginUser,
    logoutUser,
    userIsLogged
}