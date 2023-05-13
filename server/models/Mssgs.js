const mongoose = require("mongoose");

const mssgSchema = new mongoose.Schema({
    chat: {type: mongoose.Schema.Types.ObjectId, ref: "chat"},
    content: String,
    sender: {type: mongoose.Schema.Types.ObjectId},
    timestamp: Number
});

const Mssgs = mongoose.model("mssg" , mssgSchema);

module.exports = {
    Mssgs
}