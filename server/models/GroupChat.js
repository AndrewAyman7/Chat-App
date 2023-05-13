const mongoose = require("mongoose");

const groupChatchema = new mongoose.Schema({
    users: [ {type: mongoose.Schema.Types.ObjectId, ref: "user"} ],
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    groupName: String,
    privacy: String  // @ToDo : Validation here , only "private" , "public" , w Validations le kolo b2a
});

const GroupChat = mongoose.model("groupChat" , groupChatchema);

module.exports = {
    GroupChat
}