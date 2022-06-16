const { Strategy } = require('passport-jwt');
const { dirname, join } = require('path');
const { fileURLToPath } = require('url');
const fs  = require('fs');
const User = require('../db/models/user-model.js');

const pathToKey = join(__dirname, '..', 'keys', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const cookieExtractor = (req) => {
    let jwt = null;

    if (req && req.cookies['token']) {
        jwt = req.cookies['token'];
    }

    return jwt;
};

const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

module.exports = passport => {
    passport.use(
        new Strategy(options, (jwt_payload, done) => {
            User.findOne({
                where: { id: jwt_payload.sub }
            })
                .then((user) => {
                    if (user) {
                        const data = {
                            id: jwt_payload.sub,
                            role: jwt_payload.role
                        };
                        return done(null, data);
                    }
                    return done(null, false);
                })
                .catch((err) => console.error(err));
        })
    );
}