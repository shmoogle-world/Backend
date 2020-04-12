const express = require("express");
const jwt = require('jsonwebtoken');

class Authentication{

    static login(req,res){
        const user; //getuser
        const secret = 123; //USE BETTER SECRET IN ENV OR SOMETHING .
        
        res.send(false); //iferrr        
        const token = jwt.sign({data:user}, secret, {expiresIn:86400}); //expiresin 1 day.
        res.cookie('jwt',token);
        res.send(true);
    }
}

module.exports = Authentication;