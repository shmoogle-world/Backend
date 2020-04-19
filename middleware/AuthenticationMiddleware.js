const jwt = require('jsonwebtoken');
const UserController = require('../controllers/UserController');

class Authentication {
    static async signup(req, res) {
        try {
            const user = await UserController.create(req);
            if (!user || user.bool) { res.send(user.error); return; }
            const secret = user.salt;
            const obj = {
                id: user.id,
                email: user.email,
                displayName: user.display_name
            }
            const token = jwt.sign({ data: obj }, secret, { expiresIn: 86400 }); //expiresin 1 day.
            res.cookie('jwt', token);
            res.send(true);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    static async login(req, res) {
        try {
            const user = await UserController.fetch(req);
            if (!user || user.bool || user === null) { res.send(false); return; }
            const secret = user.salt;
            const obj = {
                id: user.id,
                email: user.email,
                displayName: user.display_name
            }
            const token = jwt.sign({ data: obj }, secret, { expiresIn: 86400 }); //expiresin 1 day.
            res.cookie('jwt', token);
            res.send(true);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }
}

module.exports = Authentication;