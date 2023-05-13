const { Chats } = require("../models/Chat");
const User = require("../models/User").User;

const sendFriendRequest = async(req,res,next)=>{
    const data = req.body; // friend
    const user = req.user; // me , ely h3ml login w ab3d add le friend
    try{
        if(data._id === user.id)  return res.status(400).json({message:"you can't send req to yourself"}); // 3shan mykmlsh el fun w yb3t mrten response

        let friend = await User.findById(data._id);
        let friendRequests = friend.sentRequests.find(el=> el.id.toString() === user.id);
        //console.log( friendRequests );
        //console.log(friendRequests === undefined);
        if(friend && friendRequests === undefined){  // LW Mwgood , w msh 3amly add (3shan lw 2 users 3mlo add lb3d fe nfs elwa2t, hy7sl bug kbera)
            const isAlreadySentReq = friend.friendRequests.find( us => us.id.toString() === user.id );
            if(isAlreadySentReq){
                res.status(400).json({message:"you have sent req before"});
            }else{
                let user1 = await User.findByIdAndUpdate( data._id , { $push: {friendRequests:{username:user.username, id: user.id}} } ).select("_id username");
                let user2 = await User.findByIdAndUpdate( user.id , { $push: {sentRequests:{username:data.username, id: data._id}} } ).select("_id username");
                res.status(201).json({user1,user2})
            }
        }else{
            res.status(404).json({message:"You Cant Send Request"});
        }
    }catch(err){
        res.status(400).json(err);
    }
} 

const cancelFriendRequest = async(req,res,next)=>{
    let friend = req.params.id;
    const user = req.user;
    try{
        let user1 = await User.findByIdAndUpdate( friend , { $pull: {friendRequests:{id: user.id}} } );
        let user2 = await User.findByIdAndUpdate( user.id , { $pull: {sentRequests:{id: friend}} } );
        res.status(201).json({user1,user2})
    }catch(err){
        res.status(400).json({message:err.message});
    }
} 

const acceptFriendRequest = async(req,res,next)=>{ // When I Accept Request , aw el3ks
    let friend = req.body;
    let user = req.user;
    try{

        let newChat = new Chats({
            users: [user.id , friend._id]
        });
        let chatDoc = await newChat.save();

        console.log(user , friend)
        let user1 = await User.findByIdAndUpdate( friend._id , {  // he first
            $pull : { sentRequests:{id: user.id} },
            $push : { friends: {id: user.id, username: user.username , image: user.profileimg.url, chatId: chatDoc._id} }
        }).select("_id username profileimg chatID");
        let user2 = await User.findByIdAndUpdate( user.id , {
            $pull : { friendRequests:{id: friend._id} },
            $push : { friends: {id: friend._id, username: friend.username , image: friend.profileimg.url, chatId: chatDoc._id} }
        } ).select("_id username profileimg chatID");
        res.status(201).json({user1,user2})
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const rejectFriendRequest = async(req,res,next)=>{
    let friendId = req.params.id;
    let user = req.user;
    try{
        let user1 = await User.findByIdAndUpdate( friendId , {  
            $pull : { sentRequests: { id: user.id } }
        }).select("_id");
        let user2 = await User.findByIdAndUpdate( user.id , {
            $pull : { friendRequests: { id: friendId } }
        } ).select("_id");
        res.status(201).json({user1,user2})
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const deleteFriend = async(req,res,next)=>{
    let friendId = req.params.id;
    let user = req.user;
    try{
        let user1 = await User.findByIdAndUpdate( friendId , {  
            $pull : { friends: { id: user.id } }
        }).select("_id");
        let user2 = await User.findByIdAndUpdate( user.id , {
            $pull : { friends: { id: friendId } }
        } ).select("_id");
        res.status(201).json({user1,user2})
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports = {
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    deleteFriend,
    rejectFriendRequest
}