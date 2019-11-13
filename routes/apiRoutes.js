const express = require("express");
const router = express.Router();
const SearchController = new (require('../controllers/api/SearchController'));
const EmbeddedSearchController = new (require('../controllers/api/EmbeddedSearchController'));

const AccessMiddleware = require('../middleware/AccessMiddleware');

router.get("/embedded/search/:query", AccessMiddleware.run, (req, res) => {
    EmbeddedSearchController.index(req, res);
});


/**
 * Shmoogle Images routes
 */
// router.get("search/images/:query");

/**
 * Shmoogle Search routes
 */
router.get("/search/:query/unshuffled",(req, res) => {
    SearchController.unshuffled(req, res);
});
router.get("/search/:query/shuffled", (req, res) => {
    SearchController.shuffled(req, res);
});
router.get("/search/:query", (req, res) => {
    SearchController.index(req, res);
});


/**
 * Shmoogle Embedded search
 */

function accessMiddlware(req, res, next) {

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Check that a access key is present (is it part of the request), 
    // Check that the key sent is valid (Does le key exist in database owo)
    // Check that the key sent is from a valid url (does le valid key be allowed to make le request from this url). 
}

function siteSearch(req, res, next) {
    // after accessMiddlware passes,
    // Check if a site param is present parse if needed,
    // else get the sites that the access key is affiliated with and send them with req. 
}

module.exports = router;