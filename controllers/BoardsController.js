const Connector = require('../interfaces/SqlConnector');
const ControllerInterface = require('../interfaces/ControllerInterface');
const BoardSearch = require('./BoardSearchController');
const { genToken } = require('../utilities/tokenGenerator');

class UserController extends ControllerInterface {
    static async fetchAll(req, res) {
        try {
            let q = "SELECT * FROM `boards` WHERE `user_id` = ? ";
            req.params.user_id !== req.user.id ? q += " AND public = 1" : q;
            const args = [req.params.id];
            const token = genToken(req.user);
            const data = await Connector.query(q, args);
            res.status(200).json({ data: data, jwt: token });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    }

    static async fetch(req, res) {
        try {
            const q = "SELECT * FROM `boards` WHERE `id` = ?";
            const args = [req.params.id];
            let data = await Connector.query(q, args);
            if (data.length == 0) { res.status(203).send('No Content'); return; }
            if (data[0].public === 0 && req.params.id !== data[0].user_id) res.status(401).send('Unauthorized Access');
            data = data[0];
            const token = genToken(req.user);
            data.items = await BoardSearch.fetchAll(req.params.id);
            res.status(200).json({ data: data, jwt: token });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    }

    static async remove(req, res) {
        try {
            let q = "SELECT * FROM `boards` WHERE `id` = ?";
            const args = [req.params.id];
            const data = await Connector.query(q, args);
            if (data.length == 0) { res.status(203).send('No Content'); return; }

            q = "DELETE FROM `boards` WHERE `id` = ?";
            await Connector.query(q, args);
            q = "DELETE FROM `board_search` WHERE `board_id` = ?"
            await Connector.query(q, args);

            const token = genToken(req.user);
            res.status(200).json({ data: 'Successfully deleted', jwt: token });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    }

    static async create(req, res) {
        try {
            if (!req.body.userId || !req.body.title) res.status(409).send('Error missing parameters');
            const q = "INSERT INTO `boards` (`id`, `user_id`, `title`, `description`, `public`, `view_count`, `created_at`) VALUES (NULL, ?, ?, ?, NULL, NULL, NULL)";
            const args = [req.body.userId, req.body.title, req.body.description ? req.body.description : ''];
            await Connector.query(q, args);
            const token = genToken(req.user);
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

            if (!req.body.title && !req.body.public && !req.body.description && !req.body.view_count) res.status(409).send('Error missing parameters');
            q = "UPDATE `boards` SET `title`= ? ,`description` = ? ,public`= ? ,`view_count` = ? WHERE `id` = ?";
            args = [
                req.body.title ? req.body.title : req.body.title,
                req.body.description ? req.body.description : data.description,
                req.body.public ? req.body.public : req.body.public,
                req.body.view_count ? req.body.view_count : data.view_count,
                req.params.id
            ];

            await Connector.query(q, args);
            if (req.body.items)
                await BoardSearch.updateSearches(req.body.items);

            const token = genToken(req.user);
            res.status(200).json({ data: 'Successfully updated', jwt: token });

        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    }

}

module.exports = UserController;