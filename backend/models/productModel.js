// To setup the schema we will put in mongodb

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name of product"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter the description of product "],
  },
  price: {
    type: Number,
    required: [true, "Please enter the price of product "],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
  {  public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }}
    ],
    category:{
type:String,
required:[true , "Please enter the category of product"]
    },
    stock:{
type:Number,
required: [true,"Please enter the number of products availible"],
maxLength:[4,"Stock cannot exceed 4 characters"],
default:1
    },
    numOfReviews:{
type:Number,
default:0
    },
    reviews:[
        {
          user:{
         type:mongoose.Schema.ObjectId,
         ref:"user",
         required:true,
    },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true 
            },
            comment:{
                type: String,
                required:true
            }
        } 
    ],

    user:{
         type:mongoose.Schema.ObjectId,
         ref:"user",
         required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now
    }

  });

  module.exports = mongoose.model('Product',productSchema)