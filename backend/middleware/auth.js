// const ErrorHandler = require("../utils/ErrorHandler");
// const catchAsyncerrors = require("./catchAsyncerrors");
// const jwt = require("jsonWebToken");
// const User = require("../models/userModules");

//  exports.isAuthenticatedUser = catchAsyncerrors(async (req,res,next)=>{

//     const {token} = req.cookies;

//     if(!token){
//         return next(new ErrorHandler("please login to access this",401));
//     }

//     const decodedData = jwt.verify(token,process.env.JWT_SECRET);

//     req.user=await User.findById(decodedData._id);

//     next();
// });

// exports.authorizeRoles = (...roles)=>{
//     return (req,res,next)=>{

//         console.log(req.user.role);
//         if(!roles.includes(req.user.role)){

//             return next(new ErrorHandler(`Role :${req.user.role} is not allowed to access`,403)
//         );
//         };
        
        

//         next();
//     };
// };



   
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncerrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModules");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
