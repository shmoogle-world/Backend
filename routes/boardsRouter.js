const express = require("express");
const passport = require("passport");
const router = express.Router();
const BoardController = require("../controllers/BoardsController");

router.get('/boards/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.fetchAll(req, res);
});

router.get('/board/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.fetch(req, res);
});

router.get('/board/:id/items', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.fetchItems(req, res);
});

router.post('/board/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.create(req, res);
});

router.delete('/board/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.remove(req, res);
});

router.put('/board/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.update(req, res);
});

module.exports = router;