const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncerrors = require("../middleware/catchAsyncerrors");

const User = require("../models/userModules");

const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto");

const cloudinary = require("cloudinary");

//function for register a user

exports.registerUser = catchAsyncerrors(async(req,res,next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale" 
    })

    const {name,email,password} =  req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });

     sendToken(user,201,res);

});

//Login User

exports.loginUser=catchAsyncerrors(async (req,res,next)=>{

    const { email,password } = req.body;

    //checking if user has given password and email

    if(!email || !password){
        return next(new ErrorHandler("please enter email and password",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("invalid email or password",401));
    }

    sendToken(user,200,res);


});

//forgot passsword and 
exports.forgotPassword = catchAsyncerrors(async(req,res,next)=>{
    const user = await User.findOne({
        email:req.body.email
    });

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    //Get resetPasswordtoken

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `your password reset token is  : \n\n ${resetPasswordUrl} \n\n if you have not requested this email,please ignore it`;

    try {

        await sendEmail({

            email:user.email,
            subject:'VinodShop Password Recovery',
            message,
        });

        res.status(200).json({
            success:true,
            message:`email send to ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken=undefined;

        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));
    }
})



//Logout User

exports.logout=catchAsyncerrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"logout success"
    });

});

//Reset password
exports.resetPassword = catchAsyncerrors(async(req,res,next)=>{

   

    //creating token hash

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest("hex");

   const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt: Date.now()},

   });

   if(!user){
    return next(new ErrorHandler("Reset password token is invalid or has been expired",400));
}

if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("password does not match",400));
}

user.password = req.body.password;

user.resetPasswordToken=undefined;

user.resetPasswordExpire = undefined;

await user.save();

sendToken(user,200,res);

});



//Get User Details

exports.getUserDetails = catchAsyncerrors(async(req,res,next)=>{


    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})

//update user password

exports.updatePassword = catchAsyncerrors(async(req,res,next)=>{


    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("old password is incorrect",401));
    }

    if(req.body.newPassword!==req.body.confirmPassword){

        return next(new ErrorHandler("password doesn't match",401));


    }

    user.password=req.body.newPassword;

    await user.save();


   sendToken(user,200,res);
});

//update user profile

exports.updateProfile = catchAsyncerrors(async(req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId)
    

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale" 
    })

    newUserData.avatar={
        public_id:myCloud.public_id,
        url:myCloud.secure_url
    }
}
    const user =await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
  
    res.status(200).json({
        success:true,
    })
   
});

//Get ALL Users

exports.getAllUser = catchAsyncerrors(async(req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

//Get single User details by admin

exports.getSingleUser = catchAsyncerrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exit with ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
})

//update user role --admin

exports.updateUserRole = catchAsyncerrors(async(req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
  
    res.status(200).json({
        success:true,
    })
})

//delete user --admin

exports.deleteUser = catchAsyncerrors(async(req,res,next)=>{

    const user =await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id ${req.params.id}`,400))
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId)

    await user.remove();
  
    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})