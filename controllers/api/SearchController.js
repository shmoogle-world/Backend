import * as Controller from '../../interfaces/SearchControllerInterface';
import { Response, Request } from "express-serve-static-core";

export class SearchController extends Controller{
    
    /**
     * returns an array containing both shuffled and unshuffled results
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @swagger
     *
     * /api/search/{query}:
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
     *     tags:
     *         - search
     *     responses:
     *       200:
     *         description: Successfully returns a json containing 100 search results both shuffled and unshuffled.
     */
    index(req, res) {
        try {
            let query = this.validateInput(req, res);
            const _ = require("underscore");
            res.json([
                this.search(query),
                _.shuffle(this.search(query)),
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
     * /api/search/{query}/unshuffled:
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
     *     tags:
     *         - search
     *     responses:
     *       200:
     *         description: Successfully returns a json containing 100 search results.
     */
    unshuffled(req, res) {
        try {
            let query = this.validateInput(req, res);
            res.json(this.search(query));
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
     * /api/search/{query}/shuffled:
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
     *     tags:
     *         - search
     *     responses:
     *       200:
     *         description: Successfully returns a json containing 100 shuffled search results.
     */
    shuffled(req, res) {
        try {
            let query = this.validateInput(req, res);
            const _ = require("underscore");
            res.json(_.shuffle(this.search(query)));
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
            throw new error("Missing Query param");
        }
        return query;
    }

};