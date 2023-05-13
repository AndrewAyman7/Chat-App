
module.exports = (schema)=>{
    return (req,res,next)=>{
        const validResult = schema.validate(req.body);

        if (validResult.error == undefined){ 
            res.status(201);
            next();
        }
        else{
            res.status(400).json({message: validResult.error.details[0].message});
        }
    }
}