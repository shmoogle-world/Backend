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
        return res;
    }; 

      /**
       * get url given a id
       */

    static async getSiteByID(id) {
        let query = "SELECT * FROM `access_limitation` WHERE `access_token_id` = '"+id+"'";
        let res = await connector.query(query);
        return res;
    };   


    /**
     * Verifies the access to the database 
     */
    static async run(req, res, next) {
        
        let ip = req.headers.origin;

        if(ip) {
            ip = ip.split("//")[1].split(":")[0];     
        }else {
            next();
            return;
        }         

        if(!req.query.key) { 
            res.status(400).send({"error":"Access token is missing."});
            return;
        }
        
        let data = await AccessMiddleware.getDataByToken(req.query.key);
        if(!data.length) {
            res.status(401).send({"error":"Invalid access token"});
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

    /**
     * recods the query requested for analytics purposes.
     */
    static async analytics(req, res, next){
        console.log(req.headers.origin);
        if(!req.headers.param) {next(); return;};
        let query = "INSERT INTO `analytics`(`id`, `query`, `origin`, `timestamp`) VALUES (NULL,"+req.params.query+","+req.headers.originip.split("//")[1].split(":")[0]+",NULL)";
        connector.query(query);
        next();
    }

};


module.exports = AccessMiddleware;