const Connector = require('../interfaces/SqlConnector');
const ControllerInterface = require('../interfaces/ControllerInterface');

class BoardSearch extends ControllerInterface {
    static async fetchAll(id) {
        const q = 'SELECT searches.id, searches.title, searches.url, searches.snippet, searches.preview_image, \
            searches.dateLastCrawled, board_search.list_index, board_search.created_at \
            FROM ( board_search INNER JOIN searches ON board_search.search_id = searches.id ) WHERE board_search.board_id = ? ORDER BY board_search.list_index';
        const args = [id];
        return await Connector.query(q, args);
    };

    static async create(req, res) {
        try {
            if (!req.body.board_id || !req.body.title || !req.body.url || !req.body.last_crawled) res.status(409).send('Error missing parameters');
            let q = "INSERT INTO `searches` (`id`, `title`, `url`, `snippet`, `preview_image`, `last_crawled`) VALUES (NULL, ?, ?, ?, ?, ?)";
            let args = [
                req.body.title,
                req.body.url,
                req.body.snippet ? req.body.snippet : '',
                req.body.preview_image ? req.body.preview_image : '',
                req.body.last_crawled
            ];

            await Connector.query(q, args);

            q = "SELECT id FROM searches WHERE url = ?";
            args = [req.body.url];
            const id = await Connector.query(q, args);
            if (id.length == 0) throw { "error": "ERROR IN BACKEND OCCURED" };

            q = "SELECT COUNT(`board_id`) FROM board_search WHERE board_id = ?";
            args = [req.body.board_id];
            const index = await Connector.query(q, args);

            if (id.length == 0) throw { "error": "ERROR IN BACKEND OCCURED" };

            q = "INSERT INTO `board_search` ( board_id, search_id, list_index, created_at) VALUES ( ?, ?, ?, NULL)";
            args = [req.body.board_id, id[0].id, index[0]];
            await Connector.query(q, args);

            const token = genToken(req.user);
            res.status(200).json({ data: 'Successfully deleted', jwt: token });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    };

    static async updateAll(id, items) {

    };

    static async delete(req, res) {
        try {
            let q = "SELECT * FROM `board_search` WHERE `board_id` = ? AND `search_id` = ?";
            const args = [req.params.board_id, req.params, req.params.search_id];
            const data = await Connector.query(q, args);
            if (data.length == 0) { res.status(203).send('No Content'); return; }

            q = "DELETE FROM `board_search` WHERE `board_id` = ? AND `search_id` = ?"
            await Connector.query(q, args);

            const token = genToken(req.user);
            res.status(200).json({ data: 'Successfully deleted', jwt: token });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    };

    static async test(req, res) {
        const q = "SELECT COUNT(`board_id`) FROM board_search WHERE board_id = 1";
        const index = await Connector.query(q);
        console.log(index);
        console.log(index[0]);
        res.send("cool");
    }
}

module.exports = BoardSearch;