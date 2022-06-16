const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const { dirname, join } = require('path');
const { fileURLToPath } = require('url');

const pathToKey = join(__dirname, '..', 'keys', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

function validPassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

function issueJWT(user, role) {
    const id = user.id;
    const roleId = role.id;

    const payload = {
        sub: id,
        role: roleId,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        algorithm: 'RS256'
    });

    return {
        token: signedToken
    };
}

module.exports = {
    validPassword,
    genPassword,
    issueJWT
}
