const SearchControllerInterface = require('../../interfaces/SearchControllerInterface');
const AccessMiddleware = require('../../middleware/AccessMiddleware');
const Connector = require('../../interfaces/SqlConnector');

class CustomSearchController extends SearchControllerInterface {
    
    /**
     * returns an array containing both shuffled and unshuffled results
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @swagger
     *
     * /api/custom/search/{query}/:
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
            let key = req.query.key;
            let site = "";

            if(!key) throw "Key was not specified"; //Make sure key was passed.

            if(req.query.site && req.query.site.length > 0) {
                site = req.query.site; //if given a site sets it to the active one to fix the query.
            }

            const _ = require("underscore");
            let queryResponse = await this.search(query+" site:"+site); // insite specific search.
            if(queryResponse.error) {
                res.status(404).send({"error":"No Results"});
                return;
            }
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
     * /api/custom/signup/:
     *   post:
     *     description: signs up using a token email and site
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: email
     *         description: users email.
     *         in: query
     *         required: true
     *         type: string
     *       - name: site
     *         description: Sites to search in.
     *         in: query
     *         required: true
     *         type: string
     *     tags:
     *         - site search
     *     responses:
     *       200:
     *         description: Successfully returns a token with html code to be implemented into site and use the prebuilt in site search module
     */
    async signUp(req, res) {
        //check if user already exists
        let q1 = "SELECT `id`,`token` FROM `access_token` WHERE `email` = '" + req.query.email + "'";
        let token;
        let data = await Connector.query(q1);
        if(!data.length){
            token = AccessMiddleware.generateToken();
            let q2 = "INSERT INTO `access_token`(`id`, `email`, `token`, `created_at`, `updated_at`) VALUES (NULL,'" + req.query.email + "','"+token+"',NULL,NULL)";
            data = await Connector.query(q2);
            data = await Connector.query(q1);
        }

        if(!data.length){
            res.status(500).send({"error":"Internal server error, please try again later."});
            return;
        }
        
        //if he already signed up with this url.
        q1 = "SELECT * FROM `access_limitation` WHERE `access_token_id` = '"+data[0].id+"' AND `url` = '"+req.query.site +"'";
        let id = data[0].id;
        token = data[0].token;
        data = await Connector.query(q1);

        if(!data.length){
            // pull id and update his tokenlist with new token. 
            q1 = "INSERT INTO `access_limitation`(`id`, `access_token_id`, `url`) VALUES (NULL,'" + id + "','" + req.query.site + "')";
            data = await Connector.query(q1);
        }
        let serverIp = req.protocol + '://' + req.hostname;
        res.send(`Your Token is : ${token}
        Please use the following code in your site:
            <div id="shw-search"></div>
            <script src="${serverIp}/custom/search.js?key=${token}"></script>`);
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