const express = require("express");
const router = express.Router();
const SwaggerController = require('../controllers/SwaggerController');

/**
 * Gets the Swagger routes as json
 */
router.get('/raw', new SwaggerController().fetch);

/**
 * Gets the swagger ui site and which then loads the json.
 */
router.get('/', new SwaggerController().index);

// Export the base-router
module.exports = router;