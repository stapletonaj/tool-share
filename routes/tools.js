var express         = require("express");
var router          = express.Router();
var Tool            = require("../models/tools");
var User            = require("../models/user.js");
var middleware      = require("../middleware");



router.get("/", function(req, res){
    Tool.find({}, function(err, foundTools){
        if (err){
            console.log(err);
        } else {
          res.render("index", {tools:foundTools});  
        }
    });
});


router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("tools/new");
});


router.post("/", middleware.isLoggedIn, function(req, res){
   // Find current user
   User.findById(req.user._id, function(err, user){
       if (err){
           console.log(err);
       } else   {
            // create tool
            Tool.create(req.body.tool, function(err, tool){
            if(err){
                console.log(err);
            } else  {
                //add username and id to tool
                tool.ownedBy.username = req.user.username;
                tool.ownedBy.id = req.user._id;
                tool.save();
                //push id and tool name to users tools
                user.ownTools.push({id: tool._id, name: tool.name});
                user.save();
                //redirect
                req.flash("success", "New tool created");
                res.redirect("/tools");
                    }
            });
                }
   });
   
  
});

// SHOW Route =================
router.get("/:id", function(req, res) {
    Tool.findById(req.params.id, function(err, foundTool){
        if (err){
            res.redirect("/tools");
        } else {
            res.render("tools/show", {tool:foundTool});
    }
    });
});

// edit Route =================
router.get("/:id/edit", middleware.checkToolOwnership, function(req, res){
   //find tool that we need to edit
   Tool.findById(req.params.id, function(err, foundTool){
       if (err){
           console.log(err);
       } else {
           res.render("tools/edit", {tool:foundTool});
       }
   });
});

//put route ==================
router.put("/:id", middleware.checkToolOwnership, function(req, res){
   //find and update
   Tool.findByIdAndUpdate(req.params.id, req.body.tool, function(err, updatedTool){
       if (err){
           console.log(err);
       } else {
           req.flash("success", "Tool edited");
           res.redirect("/tools/" + req.params.id);
       }
   });
});

// DELETE Route ================================

router.delete("/:id", middleware.checkToolOwnership, function(req, res){
   //find tool and delete it Mongoose style
   Tool.findByIdAndRemove(req.params.id, function(err, tool){
                if (err){
                    res.redirect("/tools");
                } else {
                    //find user and remove tool from there ownTools
                    User.findByIdAndUpdate(
                        req.user._id,
                        {"$pull": {"ownTools": { "id": tool._id}}},
                        function(err){
                            if(err){
                                console.log(err);
                            }
                        }
                    );
                    res.redirect("/tools");  
                } 
            }
        );
});



module.exports = router;
