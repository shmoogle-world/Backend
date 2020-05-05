const express = require("express");
const passport = require("passport");
const router = express.Router();
const authenticationMiddleware = require('../middleware/AuthenticationMiddleware');

router.post('/signup', (req, res) => {
    authenticationMiddleware.signup(req, res);
});

router.post('/login', (req, res) => {
    authenticationMiddleware.login(req, res);
});

router.post('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({ email: req.user.email, display_name: req.user.display_name });
});


module.exports = router;