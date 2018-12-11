var mongoose    = require("mongoose");

var toolSchema = new mongoose.Schema({
    name:   String,
    img:    String,
    loc:    String,
    date:   { type: Date, default: Date.now },
    ownedBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },   
});
  

module.exports = mongoose.model("Tool", toolSchema);