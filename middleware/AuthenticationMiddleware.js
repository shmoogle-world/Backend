const UserController = require('../controllers/UserController');
const { genToken } = require('../utilities/tokenGenerator');


class Authentication {
    static async signup(req, res) {
        try {
            const user = await UserController.create(req);
            if (!user) { console.log(user.error); res.status(401).end(); return; }
            if (user.error) { console.log(user.error); res.status(409).send(user.error); return; }

            const token = genToken(user);
            res.status(200).json({
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
            if (!user || user.bool || user === null) { console.log(user.error); res.status(401).end(); return; }
            const token = genToken(user);
            res.status(200).json({
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