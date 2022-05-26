const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const errorMiddleware = require("../backend/middleware/error")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")

app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload());
//Routes import
 const product = require("./routes/productRoute");
const user= require("./routes/userRoutes");
const order = require("./routes/orderRoute");
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);


//middelware for error

app.use(errorMiddleware);


module.exports = app;