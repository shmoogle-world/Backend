const express = require("express");
const router = express.Router();
const SearchController = new(require('../controllers/api/SearchController'));
const CustomSearchController = new(require('../controllers/api/CustomSearchController'));
const ImagesController = new(require('../controllers/api/ImagesController'));
const AccessMiddleware = require('../middleware/AccessMiddleware');

/**
 * Shmoogle Custom Search
 */
router.get("/custom/search/:query", AccessMiddleware.run, AccessMiddleware.analytics, (req, res) => {
    CustomSearchController.index(req, res);
});
router.post("/custom/signup/", (req, res) => {
    CustomSearchController.signUp(req, res);
});
/**
 * Shmoogle Images routes
 */
router.get("/search/images/:query/unshuffled", AccessMiddleware.run, AccessMiddleware.analytics, (req, res) => {
    ImagesController.unshuffled(req, res);
});
router.get("/search/images/:query/shuffled", AccessMiddleware.run, AccessMiddleware.analytics, (req, res) => {
    ImagesController.shuffled(req, res);
});
router.get("/search/images/:query", AccessMiddleware.run, AccessMiddleware.analytics, (req, res) => {
    ImagesController.index(req, res);
});


/**
 * Shmoogle Search routes
 */
router.get("/search/:query/unshuffled", AccessMiddleware.run, AccessMiddleware.analytics, (req, res) => {
    SearchController.unshuffled(req, res);
});
router.get("/search/:query/shuffled", AccessMiddleware.run, AccessMiddleware.analytics, (req, res) => {
    SearchController.shuffled(req, res);
});
router.get("/search/:query", AccessMiddleware.run, AccessMiddleware.analytics, (req, res) => {
    SearchController.index(req, res);
});


router.get("/maillist/:email", AccessMiddleware.run, (req, res) => {
    let query = "INSERT INTO `news_letter`(`id`, `email`) VALUES (NULL, '"+req.params.email+"',NULL)";
    const connector = new (require('../../interfaces/SqlConnector'));

    connector.query(query);
});

module.exports = router;