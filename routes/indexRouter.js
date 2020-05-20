const express = require('express');
const router = express.Router();
const authenticationRouter = require('./authenticationRoute');
const boardsRouter = require('./boardsRouter');
const EmbeddedController = require('../controllers/EmbeddedController');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/custom/search.js', EmbeddedController.index);

router.use(authenticationRouter);
router.use(boardsRouter);

module.exports = router;
