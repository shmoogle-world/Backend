const SearchControllerInterface = require('../../interfaces/SearchControllerInterface');
const AccessMiddleware = require('../../middleware/AccessMiddleware');
const connector = new (require('../../interfaces/SqlConnector'));

class CustomSearchController extends SearchControllerInterface {
    
    /**
     * returns an array containing both shuffled and unshuffled results
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @swagger
     *
     * /custom/search/{query}/:
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
            console.log(query);
            let key = req.query.key;

            if(!key) throw "Key was not specified"; //Make sure key was passed.

            let site = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            
            if(req.query.site) {
                site = req.query.site; //if given a site sets it to the active one to fix the query.
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
     * returns an array containing both shuffled and unshuffled results
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @swagger
     *
     * /embedded/signup/:
     *   post:
     *     description: signs up using a token email and site
     *     produces:
     *       - application/json
     *     parameters:
     *       - email: email
     *         description: users email.
     *         in: query
     *         required: true
     *         type: string
     *       - token: token
     *         description: The private access key.
     *         in: query
     *         required: true
     *         type: string
     *       - site: site
     *         description: Sites to search in.
     *         in: query
     *         required: true
     *         type: string
     *     tags:
     *         - site search
     *     responses:
     *       200:
     *         description: Successfully returns a json cotaining site specific results
     */
    async signUp(req, res) {
        //check if user already exists
        let q1 = "SELECT `id` FROM `access_token` WHERE `email` = '" + req.query.email + "'";
        let res = await connector.query(q1);
        
        //insert if not exist
        let q2 = "INSERT INTO `access_token`(`id`, `email`, `token`, `created_at`, `updated_at`) VALUES (NULL,'"+req.query.email+"','"+req.query.token+"',NULL,NULL)";
        let q3 = "SELECT `id` FROM `access_token` WHERE `email` = '" + req.query.email + "'";
        let id = AccessMiddleware.generateToken();
        let accessToken;

        //pull id and update his tokenlist with new token. 
        let q4 = "INSERT INTO `access_limitation`(`id`, `access_token_id`, `url`) VALUES ('"+id+"','"+accessToken+"','"+req.query.site+"')";

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

module.exports = CustomSearchController;