const ImagesControllerInterface = require('../../interfaces/ImagesControllerInterface');

class ImagesController extends ImagesControllerInterface{
    /**
     * returns an array containing both shuffled and unshuffled results
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @swagger
     *
     * /api/search/images/{query}:
     *   get:
     *     description: Sends a search request.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: The search query.
     *         in: path
     *         required: true
     *         type: string
     *       - name: key
     *         description: The access key.
     *         in: query
     *         required: true
     *         type: string
     *     tags:
     *         - images
     *     responses:
     *       200:
     *         description: Successfully returns a json containing 100 images results both shuffled and unshuffled.
     */
    async index(req, res) {
        try {
            let query = this.validateInput(req, res);
            const _ = require("underscore");
            let queryResponse = await this.search(query);
            res.json([
                queryResponse,
                _.shuffle(queryResponse),
            ]);
        } catch(error) {
            console.log(error);
        }
    }

    /**
     * returns Unshuffled results
     * 
     * @param {Request} req
     * @param {Response} res
     * @swagger
     *
     * /api/search/images/{query}/unshuffled:
     *   get:
     *     description: Sends a search request to get 100 unshuffled search results.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: The search query.
     *         in: path
     *         required: true
     *         type: string
     *       - name: key
     *         description: The access key.
     *         in: query
     *         required: true
     *         type: string
     *     tags:
     *         - images
     *     responses:
     *       200:
     *         description: Successfully returns a json containing 100 search results.
     */
    async unshuffled(req, res) {
        try {
            let query = this.validateInput(req, res);
            res.json(await this.search(query));
        } catch(error) {
            console.log(error);
        }
    }

    /**
     * returns shuffled results
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @swagger
     *
     * /api/search/images/{query}/shuffled:
     *   get:
     *     description: Sends a search request to get 100 shuffled search results.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: query
     *         description: The search query.
     *         in: path
     *         required: true
     *         type: string
     *       - name: key
     *         description: The access key.
     *         in: query
     *         required: true
     *         type: string
     *     tags:
     *         - images
     *     responses:
     *       200:
     *         description: Successfully returns a json containing 100 shuffled search results.
     */
    async shuffled(req, res) {
        try {
            let query = this.validateInput(req, res);
            const _ = require("underscore");
            res.json(_.shuffle(await this.search(query)));
        } catch(error) {
            console.log(error);
        }
    }

    /**
     * CHECKS IF QUERY IS EMPTY OR NARH
     * 
     * @param {Request} req 
     * @param {Response} res 
     */

    validateInput(req, res) {
        let query = req.params.query;
        if (!query) {
            res.error({"error": "Search query param missing or empty"});
            throw new Error("Missing Query param");
        }
        return query;
    }

}

module.exports = ImagesController;