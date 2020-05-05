const Connector = require('../interfaces/SqlConnector');
const ControllerInterface = require('../interfaces/ControllerInterface');
const { genToken } = require('../utilities/tokenGenerator');

class UserController extends ControllerInterface {
    static async fetchAll(req, res) {
        try {
            let q = "SELECT * FROM `boards` WHERE `user_id` = ? " + req.params.id !== req.user.id ? " AND visible = 1" : "";
            const args = [req.params.id];
            await Connector.query(q, args);
            let token = genToken(user);
            let data = await Connector.query(q);
            res.status(200).json({ data: data, jwt: token });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    }

    static async fetch(req, res) {
        try {
            let q = "SELECT * FROM `boards` WHERE `id` = ?";
            const args = [req.params.id];
            let data = await Connector.query(q, args);
            if (data.length == 0) { res.status(203).send('No Content'); return; }
            if (data[0].visible === 0 && req.params.id !== data[0].user_id) res.status(401).send('Unauthorized Access');
            data = data[0];
            let token = genToken(user);
            res.status(200).json({ data: data, jwt: token });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    }

    static async fetchItems(req, res) {
        try {
            let q = "SELECT * FROM `boards` WHERE `id` = ?";
            const args = [req.params.id];
            let data = await Connector.query(q, args);
            if (data.length == 0) { res.status(203).send('No Content'); return; }
            if (data[0].visible === 0 && req.params.id !== data[0].user_id) res.status(401).send('Unauthorized Access');

            q = "SELECT * FROM `searches` WHERE `board_id` = ?";
            data = await Connector.query(q, args);
            if (data.length == 0) { res.status(203).send('No Content'); return; }

            let token = genToken(user);
            res.status(200).json({ data: data, jwt: token });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    }

    static async remove(req, res) {
        try {
            let q = "SELECT * FROM `boards` WHERE `id` = ?";
            let args = [req.params.id];
            let data = await Connector.query(q, args);
            if (data.length == 0) { res.status(203).send('No Content'); return; }

            q = "DELETE FROM `boards` WHERE `id` = ?";
            await Connector.query(q, args);
            let token = genToken(user);
            res.status(200).json({ data: 'Successfully deleted', jwt: token });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    }

    static async create(req, res) {
        try {
            if (!req.body.userId || !req.body.title) res.status(409).send('Error missing parameters');
            const q = "INSERT INTO `boards` (`id`, `user_id`, `title`, `visible`) VALUES (NULL, ?, ?, NULL)";
            const args = [req.body.userId, req.body.title];
            await Connector.query(q, args);
            let token = genToken(user);
            res.status(200).json({ data: 'Successfully deleted', jwt: token });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    }

    static async update(req, res) {
        try {
            let q = "SELECT * FROM `boards` WHERE `id` = ?";
            let args = [req.params.id];
            let data = await Connector.query(q, args);
            if (data.length == 0) { res.status(203).send('No Content'); return; }
            data = data[0];

            if (!req.body.title && !req.body.visible) res.status(409).send('Error missing parameters');
            const q = "UPDATE `boards` SET `title`= ? ,`visible`= ? WHERE `id` = ?";
            args = [req.body.title ? req.body.title : req.body.title, req.body.visible ? req.body.visible : data.visible, req.params.id];
            await Connector.query(q, args);
            let token = genToken(user);
            res.status(200).json({ data: 'Successfully updated', jwt: token });

        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    }

}

module.exports = UserController;