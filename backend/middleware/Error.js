// To send the error if someother problem occurs

const  ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong Mongodb Id error 
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid : ${err.path}`
        err = new ErrorHandler(message,404)
    }

    // Mongoose duplicate key error
if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)}`
    err = new ErrorHandler(message,400)
}

// Wrong JWT token
 if (err.name === "JsonWebTokenError") {
   const message = `Json Web Token is invalid,Try again`;
   err = new ErrorHandler(message, 404);
 }

//  JWT expire error
 if (err.name === "tokenExpiredError") {
   const message = `Json Web Token is expired,Try again`;
   err = new ErrorHandler(message, 404);
 }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}; 