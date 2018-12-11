// ======================== Require the installed things ========================
var express                 = require('express'),
    bodyParser              = require('body-parser'),
    mongoose                = require("mongoose"),
    Tool                    = require("./models/tools.js"),
    User                    = require("./models/user.js"),
    methodOverride          = require("method-override"),
    passport                = require("passport"),
    flash                   = require("connect-flash"),
    localStratagy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

var app = express();
app.use(require("express-session")({
    secret: "sofie is just the cutest and best dog in all of the world!",
    resave: false,
    saveUninitialized: false
}));

//================ ROUTES =======================
var toolRoutes = require("./routes/tools.js");
var indexRoutes = require("./routes/index.js");
var requestRoutes = require("./routes/requests.js");


// =================== App configuration ========================
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/tool_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());

//we need these lines anytime we use passport:
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing user details and flash messages through to every page for displays etc :)
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// profile route====================
app.get("/user/:id", function(req, res){
    //get user id 
    User.findById(req.params.id, function(err, user){
        if (err){
            console.log(err);
        } else{
            res.render("profile", {user:user});
        }
    });
});



// ===================== Express Routes ===============================
app.use("/tools", toolRoutes);
app.use("/tools/:id/requests", requestRoutes);
app.use(indexRoutes);

// ====================== Tell Servers to start ===========================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Tool app server has started!");
});