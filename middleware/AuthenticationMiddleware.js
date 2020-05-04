const jwt = require('jsonwebtoken');
const UserController = require('../controllers/UserController');

class Authentication {
    static async signup(req, res) {
        try {
            const user = await UserController.create(req);
            console.log(user);
            if (!user || user.bool) { res.status(401).end(); return; }
            const obj = {
                id: user.id,
                email: user.email,
                displayName: user.display_name
            }
            const token = jwt.sign({ data: obj }, process.env.APPSETTING_JWT_SALT, { expiresIn: 86400, issuer: 'https://shmoogle.world' }); //expiresin 1 day.
            res.status(200).send({
                email: user.email,
                displayName: user.display_name,
                jwt: token
            });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    static async login(req, res) {
        try {
            const user = await UserController.fetch(req);
            if (!user || user.bool || user === null) { res.status(401).end(); return; }
            const obj = {
                id: user.id,
                email: user.email,
                displayName: user.display_name
            }
            const token = jwt.sign({ data: obj }, process.env.APPSETTING_JWT_SALT, { expiresIn: 86400, issuer: 'https://shmoogle.world' }); //expiresin 1 day.
            res.status(200).send({
                email: user.email,
                displayName: user.display_name,
                jwt: token
            });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }
}

module.exports = Authentication;