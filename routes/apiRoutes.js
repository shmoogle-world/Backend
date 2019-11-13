const express = require("express");
const router = express.Router();
const SearchController = new (require('../controllers/api/SearchController'));
const CustomSearchController = new (require('../controllers/api/CustomSearchController'));

const AccessMiddleware = require('../middleware/AccessMiddleware');

/**
 * Shmoogle Custom Search
 */
router.get("/custom/search/:query", AccessMiddleware.run, (req, res) => {
    CustomSearchController.index(req, res);
});
router.post("/custom/signup/", (req, res) => {
    CustomSearchController.signUp(req, res);
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


module.exports = router;