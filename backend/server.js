
const app = require("./app");

const connectDatabase = require("./database/database")

require('dotenv').config({path:"backend/config.env"});

const cloudinary = require("cloudinary")

//uncaught Error Exception

process.on("uncaughtException",(err)=>{
    console.log(error.message);
    console.log("shutting server due to uncaught exception");
    process.exit(1);
})

//connecting to database
connectDatabase();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})

//unhandled Promise Rejection

process.on("unhandledRejection",err=>{
    console.log(err.message);
    console.log("shutting down server");

    server.close(()=>{
        process.exit(1);
    });
})