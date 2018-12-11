var express         = require("express");
var router          = express.Router({mergeParams:true});
var Tool            = require("../models/tools.js");
var User            = require("../models/user.js");
var Request         = require("../models/request.js");
var passport        = require('passport');
var middleware      = require("../middleware");



//render new request form must merge params to access parent params! ====
router.get("/new", function(req, res){
    Tool.findById(req.params.id, function(err, foundTool){
        if(err){
            console.log(err);
            req.flash("err", "Something went wrong");
            res.redirect("back");
        } else {
        res.render("requests/new", {tool: foundTool}); 
        }
    });
    
});








module.exports = router;