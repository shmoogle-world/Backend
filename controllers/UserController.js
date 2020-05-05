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
        if (!req.body.email || !req.body.displayName) throw { status: 500, error: "Missing variables" };

        const q1 = "SELECT * FROM `users` WHERE `email` = '" + req.body.email + "'";
        const args1 = [req.body.email];
        let data = await Connector.query(q1, args1);
        if (data.length != 0) throw { status: 409, error: "EMAIL_EXISTS" };
        const salt = genSalt(16);
        const hash = sha512(req.body.password, salt);
        const q2 = "INSERT INTO `users`(`id`, `email`, `display_name`, `password`, `salt`) VALUES (NULL, ?, ?, ?, ?)";
        const args2 = [req.body.email, req.body.displayName, hash, salt];
        data = await Connector.query(q2, args2);
        data = await Connector.query(q1, args1);
        return data[0];
    }

    static async fetch(req) {
        const q = "SELECT * FROM `users` WHERE `email` = ?";
        const args = [req.body.email];
        const data = await Connector.query(q, args);
        if (data.length == 0) throw { status: 203, error: "EMAIL_NOT_FOUND" };

        const hash = sha512(req.body.password, data[0].salt);
        if (hash !== data[0].password) throw { status: 401, error: "INVALID_PASSWORD" };

        return data[0];
    }

    static async authenticate(email) {
        const q = "SELECT * FROM `users` WHERE `email` = ?";
        const args = [email];
        const data = await Connector.query(q, args);
        if (data.length == 0) throw { status: 401, error: "EMAIL_NOT_FOUND" };
        return data[0];
    }
}

module.exports = UserController;