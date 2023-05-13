const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    users: [ {type: mongoose.Schema.Types.ObjectId, ref: "user"} ]
});

const Chats = mongoose.model("chat" , chatSchema);

module.exports = {
    Chats
}