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
        try {
            if (!req.body.email || !req.body.displayName) throw { error: "Missing variables" };

            const q1 = "SELECT * FROM `users` WHERE `email` = '" + req.body.email + "'";
            const args1 = [req.body.email];
            let data = await Connector.query(q1, args);
            if (data.length != 0) throw { error: "User doesnt exists" };
            const salt = genSalt(16);
            const hash = sha512(req.body.password, salt);
            const q2 = "INSERT INTO `users`(`id`, `email`, `display_name`, `password`, `salt`) VALUES (NULL, ?, ?, ?, ?)";
            const args = [req.body.email, req.body.displayName, hash, salt];
            data = await Connector.query(q2, args);
            data = await Connector.query(q1, args1);
            return data[0];
        } catch (e) {
            throw e;
        }
    }

    static async fetch(req) {
        try {
            let q1 = "SELECT * FROM `users` WHERE `email` = '" + req.body.email + "'";
            let data = await Connector.query(q1);
            if (data.length == 0) throw { error: "User doesnt exists" };

            const hash = sha512(req.body.password, data[0].salt);
            if (hash === data[0].password)
                return data[0];
            return null;
        } catch (e) {
            throw e;
        }
    }

    static async authenticate(email) {
        try {
            let q1 = "SELECT * FROM `users` WHERE `email` = '" + email + "'";
            let data = await Connector.query(q1);
            if (data.length == 0) throw { error: "User doesnt exists" };
            return data;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = UserController;