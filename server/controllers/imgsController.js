const path = require("path");
const multer = require("multer");
const User = require("../models/User").User;


const Storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(__dirname,"../images"))
    },
    filename: function(req,file,cb){
        if(file){
            cb(null, new Date().toISOString().replace(/:/g,"-")+ file.originalname);
        }else{
            cb(null,false)
        }
    }
})

const uploadMW = multer({
    storage: Storage,
    fileFilter: function(req,file,cb){
        if(file.mimetype.startsWith("image")){
            cb(null,true)
        }else{
            cb({message:"UnSupported file format, img only"} , false)
        }
    },
    limits: {fileSize: 1024*1024*3 }  // 3 mb at most
})

const uploadProfile = async(req,res,next)=>{

    // @ ToDo >> upload images to cloudinary, video 8
    // @ ToDo >> delete img from folder after upload it to cloudinary

    //console.log(req.file);
    if(req.file){
        //console.log(req);
        let img = "/" + req.file.filename;  // for example: http://localhost:9000/2023-02-23T12-45-06.669ZIMG-20210905-WA0173.jpg

        let user = await User.findById(req.user);
        user.profileimg = {
            publicId : img,
            url : img
        }
        await user.save();

        res.status(200).json({message:"uploaded successfully" , img});
    }else{
        res.status(400).json({message:"No photos uploaded, please choose img"});
    }

    
}

module.exports = {
    uploadMW,
    uploadProfile
}