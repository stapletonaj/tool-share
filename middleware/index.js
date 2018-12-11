// need to require the schemas that we will need:
var User        = require("../models/user.js"),
    Tool        = require("../models/tools.js");
   

// create an empty object to call middlewear from. 
var middlewearObj = {};


// actual middleware ==========================

middlewearObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect('/login');
};

middlewearObj.checkToolOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Tool.findById(req.params.id, function (err, foundTool){
            if (err){
                req.flash("error", "Tool not found");
                res.redirect("back");
            } else {
                //does the user own the Tool?
                //if we just print things they are objects and strings so mongoose gives us method .equals
                if (foundTool.ownedBy.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first!");
        res.redirect("back");
    }
};

module.exports = middlewearObj;