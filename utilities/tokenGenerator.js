const jwt = require('jsonwebtoken');

const genToken = (user) => {
    const obj = {
        id: user.id,
        email: user.email,
        displayName: user.display_name
    }
    return jwt.sign({ data: obj }, process.env.APPSETTING_JWT_SALT, { expiresIn: 86400, issuer: 'https://shmoogle.world' }); //expiresin 1 day.
}

module.exports = { genToken };