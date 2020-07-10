const express = require("express");
const passport = require("passport");
const router = express.Router();
const BoardController = require("../controllers/BoardsController");
const BoardSearchController = require('../controllers/BoardSearchController');

router.post('/board/:id/search/', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardSearchController.create(req, res);
});

router.delete('/board/:id/search/:search_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardSearchController.remove(req, res);
});

router.get('/boards/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.fetchAll(req, res);
});

router.get('/board/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.fetch(req, res);
});

router.post('/board/', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.create(req, res);
});

router.delete('/board/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.remove(req, res);
});

router.put('/board/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    BoardController.update(req, res);
});

module.exports = router;