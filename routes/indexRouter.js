var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/custom/search.js', function(req, res) {
    let accessKey = req.query.key;

    var fs = require('fs');
    var path = require('path');
    let file = (fs.readFileSync(path.join(__dirname, '../resources/embedded/index.js'))).toString();
    file = file.replace("UNIQUE_ACCESSKEY", accessKey);
    res.type('.js');
    res.setHeader('Content-Type', 'text/javascript');
    res.send(file);
});

module.exports = router;
