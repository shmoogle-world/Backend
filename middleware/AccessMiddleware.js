const connector = new (require('../interfaces/SqlConnector.js'))();
const uuidv4 = require('uuid/v4');

class AccessMiddleware {

     /**
      * Generate a unique token
      */

    static generateToken(){
        return uuidv4(); //generates base on random (uuidv4 read more about it in : https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_1_(date-time_and_MAC_address) )
    }

    /**
     * Get Data of user by Token
     */

    static async getDataByToken(token) {
        let query = "SELECT * FROM `access_token` WHERE `token` = '" + token + "'";
        let res = await connector.query(query);
        // console.log("token return: ", res);
        return res;
    }; 

      /**
       * get url given a id
       */

    static async getSiteByID(id) {
        let query = "SELECT * FROM `access_limitation` WHERE `access_token_id` = '"+id+"'";
        let res = await connector.query(query);
        // console.log("token id: ", res);
        return res;
    };   


    /**
     * 
     */
    static async run(req, res, next) {
        
        if(!req.query.key){ 
            res.status(400).send({"error":"Access token is missing."});
            return;
        }
        let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;


        let data = await AccessMiddleware.getDataByToken(req.query.key);
        if(!data.length){
            res.status(402).send({"error":"Invalid access token"});
            return;
        }
        let sites = await AccessMiddleware.getSiteByID(data[0].id);

        let clientIP = false;
        for(let site of sites) {
            if(site.url == ip){
                clientIP = true;
                break;
            }
        }

        if(!clientIP) {
            res.status(403).send({"error": "The request url origin does not match the allowed urls"})
            return;
        };

        next();
    }

};


module.exports = AccessMiddleware;