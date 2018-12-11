var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    ownTools:[{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tool"
        },
        name: String,
    }],
    borrowedTools:[],
    datecreated:{ type: Date, default: Date.now },
  });
  
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);