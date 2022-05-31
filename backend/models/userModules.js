const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcryptjs");

const Jwt = require("jsonwebtoken");

const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    role:{
        type:String,
        default:"user"
    },
    
    name : {
        type:String,
        required:[true,"please enter name"],
        maxlength:[30,"maximum length does not exceed 30"],
        minlength:[4,"min more than 5 char"]
    },
    email:{
        type:String,
        required:[true,"please enter name"],
        unique:true,
        validate:[validator.isEmail,"please enter valid Email"]
    },
    password:{
        type:String,
        required:[true,"please enter name"],
        minlength:[8,"min more than 8 char"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true   
        }    
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
   
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

//JWT TOKEN

userSchema.methods.getJWTToken=function(){

    return Jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

//Compare Password

userSchema.methods.comparePassword=async function(enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);
};


//Generating password reset token

userSchema.methods.getResetPasswordToken = function(){

    //generting token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing an dadding resetPasswordToken to userSchema

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest("hex");

    this.resetPasswordExpire=Date.now()+15*60*1000;

    return resetToken;

}



module.exports = mongoose.model("User",userSchema);

