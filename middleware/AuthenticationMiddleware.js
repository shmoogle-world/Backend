const jwt = require('jsonwebtoken');
const UserController = require('../controllers/UserController');

class Authentication {
    static signup(req, res) {
        const user = UserController.create(req);
        if (user.error) { res.send(user.error); return; }
        const secret = user.salt;
        const token = jwt.sign({ data: user }, secret, { expiresIn: 86400 }); //expiresin 1 day.
        res.cookie('jwt', token);
        res.send(true);
    }

    static login(req, res) {
        const user = UserController.fetch(req);
        if (user === null) { res.send(false); return; }
        const secret = user.salt;
        const token = jwt.sign({ data: user }, secret, { expiresIn: 86400 }); //expiresin 1 day.
        res.cookie('jwt', token);
        res.send(true);
    }
}

module.exports = Authentication;