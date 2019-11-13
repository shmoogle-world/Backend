const SearchControllerInterface = require('../../interfaces/SearchControllerInterface');

class EmbeddedSearchController extends SearchControllerInterface {
    
    /**
     * returns an array containing both shuffled and unshuffled results
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @swagger
     *
     * /embedded/search/{query}/:
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
     *         in: path
     *         required: true
     *         type: string
     *       - name: site
     *         description: Sites to search in.
     *         in: query
     *         required: false
     *         type: string
     *     tags:
     *         - site search
     *     responses:
     *       200:
     *         description: Successfully returns a json cotaining site specific results
     */
    async index(req, res) {
        try {
            let query = this.validateInput(req, res);

            let key = req.params.key;

            if(!key) throw "Key was not specified"; //Make sure key was passed.

            let site = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            
            if(req.params.site){
                site = req.params.site; //if given a site sets it to the active one to fix the query.
            }

            const _ = require("underscore");
            let queryResponse = await this.search(query+" site:"+site); // insite specific search.

            res.json([
                queryResponse,
                _.shuffle(queryResponse),
            ]);

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

};

module.exports = EmbeddedSearchController;