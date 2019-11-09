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
router.get("search/:query/unshuffled", SearchController.unshuffled);
router.get("search/:query/shuffled", SearchController.shuffled);
router.get("search/:query", SearchController.index);

module.exports = router;