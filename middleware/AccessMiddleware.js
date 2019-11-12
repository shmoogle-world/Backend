const connector = new (require('../interfaces/SqlConnector.js'));

class AccessMiddleware {

     /**
      * Generate a unique token
      */

    static generateToken(){
        //Good way to generate tokens.
    }

    /**
     * Get Data of user by Token
     */

    static getDataByToken(token) {
        let query = "SELECT * FROM `access_token` WHERE token = '"+token+"'";
        let res = connector.query(query);
        console.log(res);
        return res;
    }; 

      /**
       * get url given a id
       */

    static getSiteByID(id) {
        let query = "SELECT * FROM `access_limitation` WHERE access_token_id = '"+id+"'";
        let res = connector.query(query);
        console.log(res);
        return res;
    };   


    /**
     * 
     */
    static run(req, res, next) {

        if(!req.param.key){ 
            res.status(400).error({"error":"Access token is missing."});
            return;
        }
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        let data = AccessMiddleware.getDataByToken(req.param.key);
        if(!data){
            res.status(402).error({"error":"Invalid access token"});
            return;
        }
        let sites = AccessMiddleware.getSiteByID(data.id);

        let clientIP = false;
        let index = 0;

        for(let site in sites){
            if(site.url == ip){
                clientIP = true;
            }
            index++;
        }

        if(!clientIP) {
            res.status(403).error({"error": "The request url origin does not match the allowed urls"})
            return;
        };

        next();
    }

};