var express = require('express');
var router = express.Router();
let cors = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//TODO: Clean up this function at some point.
router.get('/custom/search.js', cors, function(req, res) {
    let accessKey = req.query.key;

    var fs = require('fs');
    var path = require('path');
    let file = (fs.readFileSync(path.join(__dirname, '../resources/embedded/index.js'))).toString();
    file = file.replace("UNIQUE_ACCESSKEY", accessKey);

    let serverIp = "https" + '://' + req.hostname;
    file = file.replace("UNIQUE_URL_ENDPOINT", serverIp);
    site = '';
    if (req.query.site) site = req.query.site;
    file = file.replace("UNIQUE_CUSTOM_SEARCH_FILTER", site);

    res.type('.js');
    res.setHeader('Content-Type', 'text/javascript');
    res.send(file);
});

module.exports = router;
