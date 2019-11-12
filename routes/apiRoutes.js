const express = require("express");
const router = express.Router();
const SearchController = new (require('../controllers/api/SearchController'));

/**
 * Shmoogle Images routes
 */
// router.get("search/images/:query");

/**
 * Shmoogle Search routes
 */
router.get("/search/:query/unshuffled", (req, res) => {
    SearchController.unshuffled(req, res);
});
router.get("/search/:query/shuffled", (req, res) => {
    SearchController.shuffled(req, res);
});
router.get("/search/:query", (req, res) => {
    SearchController.index(req, res);
});

module.exports = router;