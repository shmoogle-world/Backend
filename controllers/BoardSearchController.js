const Connector = require('../interfaces/SqlConnector');
const ControllerInterface = require('../interfaces/ControllerInterface');

class BoardSearch extends ControllerInterface {
    static async fetchAll(id) {
        const q = 'SELECT searches.id, searches.title, searches.url, searches.snippet, searches.preview_image, \
            searches.last_crawled, board_search.list_index, board_search.created_at \
            FROM ( board_search INNER JOIN searches ON board_search.search_id = searches.id ) WHERE board_search.board_id = ? ORDER BY board_search.list_index';
        const args = [id];
        return await Connector.query(q, args);
    };

    static async createSearch(boardID, title, url, snippet, preview_image, last_crawled) {

        let q = "INSERT INTO `searches` (`id`, `title`, `url`, `snippet`, `preview_image`, `last_crawled`) VALUES (NULL, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `last_crawled` = VALUES(last_crawled) ";
        let args = [
            title,
            url,
            snippet,
            preview_image,
            last_crawled
        ];

        const response = await Connector.query(q, args);
        if (!response.insertId) throw { "error": "ERROR IN BACKEND OCCURED" };

        q = "SELECT COUNT(`board_id`) as countIndex FROM board_search WHERE board_id = ?";
        args = [boardID];
        const index = await Connector.query(q, args);

        q = "INSERT INTO `board_search` ( board_id, search_id, list_index, created_at) VALUES ( ?, ?, ?, NULL)";
        args = [boardID, response.insertId, index[0].countIndex + 1];

        await Connector.query(q, args);
    }

    static async create(req, res) {
        try {
            if (!req.body.title || !req.body.url || !req.body.last_crawled) res.status(409).send('Error missing parameters');
            
            await this.createSearch(
                req.params.id,
                req.body.title,
                req.body.url,
                req.body.snippet ? req.body.snippet : '',
                req.body.preview_image ? req.body.preview_image : '',
                req.body.last_crawled
            );

            res.status(200).send({ message: 'Successfully Inserted' });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    };

    static async updateSearches(items) {

        const q = 'INSERT INTO `board_search` ( board_id, search_id, list_index, created_at) \
        VALUES ? \
        ON DUPLICATE KEY UPDATE list_index = VALUES(list_index)';

        let s = '';
        items.forEach(item => {
            s += `(${item.board_id},${item.search_id},${list_index},${created_at}),`
        });

        const args = [s];
        return await Connector.query(q, args);
    };

    static async delete(req, res) {
        try {
            let q = "SELECT * FROM `board_search` WHERE `board_id` = ? AND `search_id` = ?";
            const args = [req.params.id, req.params.search_id];
            const data = await Connector.query(q, args);
            if (data.length == 0) { res.status(203).send('No Content'); return; }

            q = "DELETE FROM `board_search` WHERE `board_id` = ? AND `search_id` = ?"
            await Connector.query(q, args);

            res.status(200).send({ message: 'Successfully deleted' });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error occured", error: e });
        }
    };
}

module.exports = BoardSearch;