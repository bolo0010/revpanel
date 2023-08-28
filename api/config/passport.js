import { Strategy } from 'passport-jwt';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import User from '../db/models/users.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

export default passport => {
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