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
    let query = "INSERT INTO `news_letter`(`id`, `email`, `created_at`) VALUES (NULL, '"+req.params.email+"',CURRENT_TIMESTAMP)";
    const connector = require('../interfaces/SqlConnector');

    connector.query(query);

    res.status(200).send({data:"Inserted Successfully"});
});

module.exports = router;