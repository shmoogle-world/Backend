const jwt = require('jsonwebtoken');
const UserController = require('../controllers/UserController');

class Authentication {
    static async signup(req, res) {
        try {
            const user = await UserController.create(req);
            if (!user || user.bool) { res.status(404).end(); return; }
            const secret = user.salt;
            const obj = {
                id: user.id,
                email: user.email,
                displayName: user.display_name
            }
            const token = jwt.sign({ data: obj }, secret, { expiresIn: 86400 }); //expiresin 1 day.
            res.status(200).send({'jwt': token});
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    static async login(req, res) {
        try {
            const user = await UserController.fetch(req);
            if (!user || user.bool || user === null) { res.status(404).end(); return; }
            const secret = user.salt;
            const obj = {
                id: user.id,
                email: user.email,
                displayName: user.display_name
            }
            const token = jwt.sign({ data: obj }, secret, { expiresIn: 86400 }); //expiresin 1 day.
            res.status(200).send({'jwt': token});
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }
}

module.exports = Authentication;