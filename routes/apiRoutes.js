const express = require("express");
const router = express.Router();
const SearchController = new(require('../controllers/api/SearchController'));
const CustomSearchController = new(require('../controllers/api/CustomSearchController'));
const ImagesController = new(require('../controllers/api/ImagesController'));
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
router.get("/search/images/:query/unshuffled", AccessMiddleware.run, (req, res) => {
    ImagesController.unshuffled(req, res);
});
router.get("/search/images/:query/shuffled", AccessMiddleware.run, (req, res) => {
    ImagesController.shuffled(req, res);
});
router.get("/search/images/:query", AccessMiddleware.run, (req, res) => {
    ImagesController.index(req, res);
});


/**
 * Shmoogle Search routes
 */
router.get("/search/:query/unshuffled", AccessMiddleware.run, (req, res) => {
    SearchController.unshuffled(req, res);
});
router.get("/search/:query/shuffled", AccessMiddleware.run, (req, res) => {
    SearchController.shuffled(req, res);
});
router.get("/search/:query", AccessMiddleware.run, (req, res) => {
    SearchController.index(req, res);
});


module.exports = router;