var crypto = require('crypto');
const Connector = require('../interfaces/SqlConnector');
const ControllerInterface = require('../interfaces/ControllerInterface');

const genSalt = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

const sha512 = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};

class UserController extends ControllerInterface {
    static async create(req) {
        let q1 = "SELECT * FROM `users` WHERE `email` = '" + req.body.email + "'";
        let data = await Connector.query(q1);
        if (data.length != 0) {
            return {
                "bool": true,
                "error": "User already exists"
            };
        }
        const salt = genSalt(16);
        const hash = sha512(req.body.password, salt);
        let q2 = "INSERT INTO `users`(`id`, `email`, `display_name`, `password`, `salt`) VALUES (NULL,'" + req.body.email + "','" + req.body.displayName + "', '" + hash + "', '" + salt + "')";
        data = await Connector.query(q2);
        data = await Connector.query(q1);
        return data[0];
    }

    static async fetch(req) {
        let q1 = "SELECT * FROM `users` WHERE `email` = '" + req.body.email + "'";
        let data = await Connector.query(q1);
        if (data.length == 0) {
            throw {
                "bool": true,
                "error": "User doesnt exists"
            };
        }
        const hash = sha512(req.body.password, data[0].salt);
        if (hash === data[0].password)
            return data[0];
        return null;
    }
}

module.exports = UserController;