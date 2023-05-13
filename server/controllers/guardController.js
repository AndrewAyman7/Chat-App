const jwt = require("jsonwebtoken");

const isAdmin = (req,res,next)=>{
    let headerToken = req.headers.authorization;  // 3shan mydeesh error: cannot read property 'split' of undefined
    if(headerToken){
        let token = headerToken.split(" ")[1];    // 3shan mydeesh error: cannot read property 'split' of undefined 
        try{
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            //console.log(decoded);
            if(decoded.admin){
                req.adminId=decoded.id;
                next();
                // res.status(201).json({message:"Success"});
                // Mynf3sh hena trg3 response , 3shan fee fel fun getUsers response , mynf3sh 2 response,  error: Cannot set headers after they are sent to the client
            }else{
                res.status(403).json({message:"You Are Not Authorized .. Only Admins"});
            }
        }catch(err){    // 3shan lw 7awel ye8ayr eltoken >> lazem try,catch 3shan maydeesh error -> Screenshots(4623-26)
            res.status(401).json({message:"invalid Token"});
        }

    }else{
        res.status(401).json({message:"You Are Not Authorized .. No Token , Login first"});
    }
}

const isUser = (req,res,next)=>{
    let headerToken = req.headers.authorization;
    if(headerToken){
        let token = headerToken.split(" ")[1];
        try{
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded.id;
            next(); // pass value to next middleware to use it
        }catch(err){
            res.status(401).json({message:"invalid Token"});
        }
    }else{
        res.status(401).json({message:"You Are Not Authorized .. No Token , Login first"});
    }
}

const isAdminOrUserHimself = (req,res,next)=>{
    let headerToken = req.headers.authorization;
    let paramId = req.params.id;// user that i wanna delete
    if(headerToken){
        let token = headerToken.split(" ")[1];
        try{
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            //console.log(decoded);
            if(decoded.admin || decoded.id == paramId){
                next();
            }else{
                res.status(401).json({message:"it should be the user himself or Admin"});
            }
        }catch(err){
            res.status(401).json({message:"invalid Token"});
        }
    }else{
        res.status(401).json({message:"You Are Not Authorized .. No Token , Login first"});
    }
}

const userFriend = (req,res,next)=>{
    let headerToken = req.headers.authorization;
    if(headerToken){
        let token = headerToken.split(" ")[1];
        try{
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            next(); // pass value to next middleware to use it
        }catch(err){
            res.status(401).json({message:"invalid Token"});
        }
    }else{
        res.status(401).json({message:"You Are Not Authorized .. No Token , Login first"});
    }
}

module.exports = {
    isAdmin,
    isUser,
    isAdminOrUserHimself,
    userFriend
}

