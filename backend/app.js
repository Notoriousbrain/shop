const express = require('express');
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const errorMiddleware = require('./middleware/Error')
const path = require('path')

// Config 
if(process.env.NODE_ENV !== "PRODUCTION"){
  require("dotenv").config({path:'backend/config/config.env'})
}

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
app.use(cors());

// Route imports 
const product = require('./routes/productRoute')
const user = require('./routes/userRoute')
const order = require('./routes/orderRoute')

app.use('/api/v1',product);
app.use('/api/v1',user);
app.use('/api/v1',order);

app.use(express.static(path.join(__dirname,"../frontend/build")))

app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})

app.use(errorMiddleware)

// Middleware for Error 

module.exports = app;   