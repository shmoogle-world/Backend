const express = require("express");
const passport = require("passport");
const router = express.Router();
const authenticationMiddleware = require('../middleware/AuthenticationMiddleware');

router.post('/signup', (req, res) => {
    authenticationMiddleware.login(req,res);
});

router.post('/login', (req, res) => {
    authenticationMiddleware.login(req,res);
});

router.post('/SomeRouteHereThatIsProtected', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    //stuff 
});


module.exports = router;