var mongoose    = require("mongoose");

var requestSchema = new mongoose.Schema({
    comment: String,
    from:   {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    to:    {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    tool:    {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tool"
        },
        username: String,
    },
    date:   { type: Date, default: Date.now },
});
  

module.exports = mongoose.model("Request", requestSchema);