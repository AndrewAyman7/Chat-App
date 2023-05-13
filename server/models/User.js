const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 2,
        maxlength: 50       
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        maxlength: 100       
    },
    profileimg:{
        type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png", //copy img adress
            publicId:null
        }
    },
    bio: {
        type:String,
        maxlength: 200
    },
    isAdmin: {
        type:Boolean,
        default:false
    },
    // For Chat
    isOnline : {
        type: Boolean,
        default: false
    },
    friends: {
        type: [ {username: String , image: String , id: mongoose.Schema.Types.ObjectId, chatId: mongoose.Schema.Types.ObjectId} ],
        default: []
    },
    friendRequests: {
        type: [ {username: String , id: mongoose.Schema.Types.ObjectId} ],
        default: []
    },
    sentRequests: {
        type: [ {username: String , id: mongoose.Schema.Types.ObjectId} ],
        default: []
    },
}
)

const User = mongoose.model("user" , userSchema);

module.exports = {
    User
}