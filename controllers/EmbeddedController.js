
class EmbeddedController {
    static index(req, res) {
        let file = EmbeddedController._loadFile(req);
        res.type('.js');
        res.setHeader('Content-Type', 'text/javascript');
        res.send(file);
    }

    static _loadFile(req) {
        const fs = require('fs');
        const path = require('path');
        
        let file = (fs.readFileSync(path.join(__dirname, '../resources/embedded/index.js'))).toString();
        
        file = file.replace("UNIQUE_ACCESSKEY", req.query.key);
        file = EmbeddedController._replaceHostname(file, req);
        file = EmbeddedController._replaceFilter(file, req);
        return file;
    }

    static _replaceFilter(file, req) {
        let site = '';
        if (req.query.site) site = req.query.site;
        return file.replace("UNIQUE_CUSTOM_SEARCH_FILTER", site);
    }

    static _replaceHostname(file, req) {
        let serverIp = "https" + '://' + req.hostname;
        return file.replace("UNIQUE_URL_ENDPOINT", serverIp);
    }

    /**
     * write a function to find and replace if + is in the url query for site. and then find and replace UNIQUE_URL_ENDPOINT and the site
     */
    
    static _replaceNOSITESPECIFIC(file, req) {
        return file.replace("&site=UNIQUE_URL_ENDPOINT", "");
    }

}

module.exports = EmbeddedController;