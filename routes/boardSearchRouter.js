const express = require("express");
const passport = require("passport");
const router = express.Router();
const BoardController = require("../controllers/BoardsController");

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.create(req, res);
});

router.delete('/:search_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.remove(req, res);
});

module.exports = router;