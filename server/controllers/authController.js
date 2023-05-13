const User = require("../models/User").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        let fEmail = await User.findOne({email});
        if (fEmail){
            res.status(400).json({message:"Email is already used , choose another one"});
        }else{
            let hashed = await bcrypt.hash(password , 2);
            let user = new User({username,email,password:hashed});
            await user.save();
            res.status(201).json({message:"Signed up Successfully, now Login"})
        }
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const login = async (req,res,next)=>{
    try{
        let {email,password} = req.body;
       let user = await User.findOne({email});
        if(user){
            let correctPass = await bcrypt.compare(password,user.password);
            if(correctPass){
                let token = jwt.sign({id:user._id , username:user.username, admin:user.isAdmin, profileimg:user.profileimg} , process.env.SECRET_KEY);
                res.status(200).json({token , username: user.username , admin:user.isAdmin , id:user._id , profileimg:user.profileimg , friendRequests: user.friendRequests, friends:user.friends} );
            }else{
                res.status(400).json({message:"Password is not correct"})
            }
        }else{
            res.status(400).json({message:"this email is not exist"})
        }

    }catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports = {
    signUp,
    login
}