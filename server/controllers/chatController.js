const { Chats } = require("../models/Chat");
const { Mssgs } = require("../models/Mssgs");

const { GroupChat } = require("../models/GroupChat"); 
const { GroupMssgs } = require("../models/GroupMssgs");
//const { ObjectId } = require('mongodb');


const getChatMssgs = async(req,res,next)=>{
    let chatId = req.params.id;
    try{
        let mssgs = await Mssgs.find({chat: chatId} , null , {sort:{timestamp:1}}).populate({
            path: "chat",
            model: "chat",
            populate: {
                path: "users",
                model: "user",
                select: "username profileimg"
            }
        }) // Note : Explaination : (populate code)
           // its = find().populate("chat").populate("users") ->bs hena elchat msh btReturn objectId bta3 eluser bs, de bt return kza haga mnhom elObjectId.
           // fa lazem ad5l gwaha w a3ml populate le field gwaha bs.
        res.status(200).json(mssgs);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const postMssg = async(req,res,next)=>{
    let mssg = req.body;
    try{
        mssg.timestamp = Date.now();  // Add Property
        let newMssg = new Mssgs(mssg);
        let resMssg = await newMssg.save();
        res.status(200).json(resMssg);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const createChatGroup = async(req,res,next)=>{
    let userId = req.user;
    let data = req.body;
    try{
        data.users.push(userId);
        let newChat = new GroupChat({
            users: data.users,
            creator: userId,
            groupName: data.groupName,
            privacy: data.privacy
        });
        let chatDoc = await newChat.save();
        res.status(200).json(chatDoc);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const joinChatGroup = async(req,res,next)=>{
    let userId = req.user;
    let chatId = req.params.id;
    try{
        let group = await GroupChat.findById(chatId);
        if(group){
            if(group.privacy==="public"){
                let isAlreadyJoined = group.users.find((user)=>user.toString() === userId);
                if(isAlreadyJoined){
                    res.status(400).json({message:"You are in already"});
                }else{
                    let joined = await GroupChat.findByIdAndUpdate(chatId , { $push: {users: userId} } , {new:true});
                    res.status(200).json(joined);
                }
            }else{
                res.status(401).json({message:"This Group is private, you are not Authorized"});
            }
        }else{
            res.status(404).json({message:"group not found"});
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const getPublicGroups = async(req,res,next)=>{
    try{
        let groups = await GroupChat.find({privacy:"public"}).populate(
            [
                {
                    path: "users",
                    model: "user",
                    select: "username profileimg"
                },

                {
                    path: "creator",
                    model: "user",
                    select: "username profileimg"
                }
            ] 
        );
        res.status(200).json(groups);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const postGroupMssg = async(req,res,next)=>{
    let mssg = req.body;
    try{
        mssg.timestamp = Date.now();
        let newMssg = new GroupMssgs(mssg);
        let resMssg = await newMssg.save();
        res.status(200).json(resMssg);
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const getRoomMssgs = async(req,res,next)=>{
    let RoomId = req.params.id;
    try{
        let groupInfo =  await GroupChat.find({_id: RoomId}).populate({
            path: "users",
            model: "user",
            select: "_id username profileimg"
        });
        let mssgs = await GroupMssgs.find({chat: RoomId} , null , {sort:{timestamp:1}}).populate({
            path: "sender",
            model: "user",
            select: "username profileimg"
        });
        res.status(200).json({groupInfo , mssgs});
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports = {
    getChatMssgs,
    postMssg,

    createChatGroup,
    joinChatGroup,
    getPublicGroups,
    postGroupMssg,
    getRoomMssgs
}