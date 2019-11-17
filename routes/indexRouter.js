let EmbeddedController = require('../controllers/EmbeddedController');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/custom/search.js', EmbeddedController.index);

module.exports = router;
