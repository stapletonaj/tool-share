var express         = require("express");
var router          = express.Router();
var Tool            = require("../models/tools");
var User            = require("../models/user.js");
var passport        = require('passport');
var middleware      = require("../middleware");


router.get("/", function(req, res){
    res.redirect("/tools");
});

// ======================= Authentication =====================================
// Show sign up form
router.get("/register", function(req, res){
   res.render("register");
});

router.post("/register", function(req, res){
    //must have body parder installed for this bit!
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome");
            res.render("/user" + user.id);
        });
    });
});

// Login Routes ==================
// Render login form
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/tools",
    failureRedirect: "/login",
    failureFlash : true,
}), function(req, res){
    //empty for now
});

//log out
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have been logged out!");
    res.redirect("/");
});

module.exports = router;