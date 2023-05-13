const mongoose = require("mongoose");

const groupMssgsSchema = new mongoose.Schema({
    chat: {type: mongoose.Schema.Types.ObjectId, ref: "chat"},
    content: String,
    sender: {type: mongoose.Schema.Types.ObjectId , ref: "user"},
    timestamp: Number
});

const GroupMssgs = mongoose.model("groupMssgs" , groupMssgsSchema);

module.exports = {
    GroupMssgs
}