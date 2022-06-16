class AuthError extends Error {
}

class LoginError extends Error {
}

class NotFoundError extends Error {
}


//TODO zmienić zarządzanie błędami
const handleError = (err, req, res, next) => {
    console.error(err);
    const success = false;
    const isLogged = false;

    let status = 500;
    let message = 'Przepraszamy, spróbuj ponownie później';
    let response = {
        status,
        message,
        success
    };

    if (err instanceof AuthError) {
        status = 401;
        response = {
            success,
            message: err.message
        };
    } else if (err instanceof LoginError) {
        status = 401;
        response = {
            success,
            isLogged,
            message: err.message
        };
    } else if (err instanceof NotFoundError) {
        status = 404;
        response = {
            success,
            message: err.message
        };
    }

    res.status(status).json(response);
};

module.exports = {
    AuthError,
    LoginError,
    NotFoundError,
    handleError
}