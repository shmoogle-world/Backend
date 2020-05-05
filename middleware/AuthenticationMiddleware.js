const UserController = require('../controllers/UserController');
const { genToken } = require('../utilities/tokenGenerator');


class Authentication {
    static async signup(req, res) {
        try {
            const user = await UserController.create(req);
            const token = genToken(user);
            res.status(200).json({
                email: user.email,
                displayName: user.display_name,
                jwt: token
            });
        } catch (e) {
            console.log(e);
            const status = e.status ? e.status : 500;
            const error = e.error ? e.error : 'An Error Has Occured';
            res.status(status).send(error);
        }
    }

    static async login(req, res) {
        try {
            const user = await UserController.fetch(req);
            const token = genToken(user);
            res.status(200).json({
                email: user.email,
                displayName: user.display_name,
                jwt: token
            });
        } catch (e) {
            console.log(e);
            const status = e.status ? e.status : 500;
            const error = e.error ? e.error : 'An Error Has Occured';
            res.status(status).send(error);
        }
    }
}

module.exports = Authentication;