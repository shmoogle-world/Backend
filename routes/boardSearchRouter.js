const express = require("express");
const passport = require("passport");
const router = express.Router();
const BoardSearchController = require('../controllers/BoardSearchController');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardSearchController.create(req, res);
});

router.delete('/:search_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardSearchController.remove(req, res);
});

module.exports = router;