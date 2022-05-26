const ErrorHandler = require("../utils/ErrorHandler");
const errorHandler = require("../utils/ErrorHandler");



module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.message=err.message||"internal server error"


//wrong mongodb id error
if(err.name==="CastError"){
    const message = `Resource not found ${err.path}`;
    err= new ErrorHandler(message,400);
}

//mongoose duplicate key error

if(err.code===11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`
    err= new ErrorHandler(message,400);
}

//wrong JWT error
if(err.name==="jsonWebTokenError"){
    const message="Json web token is invalid,try again";
    err= new ErrorHandler(message,400);
}
//JWT expire error
if(err.name==="TokenExpireError"){
    const message="Json web token is Expired,try again";
    err= new ErrorHandler(message,400);
}



    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}
