// To write CRUD operations of products

const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary')
 

// Create Product --Admin

exports.createProduct = catchAsyncErrors(async (req, res, next) => {

  let images = [];

  if(typeof req.body.images === "string"){
    images.push(req.body.images);
  }else{
    images = req.body.images;
  }

  const imagesLinks = [];

  for(let i = 0; i < images.length ; i++){
    const result = await cloudinary.v2.uploader.upload(images[i],{
        folder: "products",
      })

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      })
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});
 


// Get All product
exports.getAllProducts = catchAsyncErrors(async (req, res,next) => {

 
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();  //To count the no of products

 const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter() //To find or filter using keyword
  
  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage)

   products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All productS (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res,next) => {

 const products = await Product.find()

  res.status(200).json({
    success: true,
    products,
  });
});

    // Get Product Details

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

// Update the product

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  // console.log(product)
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  // Images start here
  if(req.body.image) {

    const images = [];
  
    if(typeof req.body.images === "string"){
      images.push(req.body.images);
    }else{
      images = req.body.images;
    }
    
    if(images !== undefined){
        for (let i = 0; i < product.images.length; i++) {
         await cloudinary.v2.uploader.destroy(
            product.images[i].public_id
          );
        }
  
     const imagesLinks = [];
  
     for (let i = 0; i < images.length; i++) {
       const result = await cloudinary.v2.uploader.upload(images[i], {
         folder: "products",
       });
  
       imagesLinks.push({
         public_id: result.public_id,
         url: result.secure_url,
       }); 
     }
     req.body.images = imagesLinks;
  
    }
  }

  const updateproduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, 
    runValidators: true,
    useFindAndModify: false,
  }); 
  // console.log( "product : ")
  res.status(200).json({
    success: true,
    updateproduct,
  });
});
 
// Delete The product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  // Deleting images from cloudinary

  for(let i = 0;i < product.images.length ; i++){
    const result = await cloudinary.v2.uploader.destroy(
      product.images[i].public_id
    )
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Succesfully",
  });
});

// Create New Review or Update The Review

exports.createProductReview = catchAsyncErrors(async (req,res,next) =>{

    const {rating,comment,productId} = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString()) //if the user id of you and the id of someone who previously created comment matched

  if(isReviewed){  //For updating reviews
product.reviews.forEach(rev =>{
    if(rev => rev.user.toString()===req.user._id){   
        rev.rating = rating,  //just update the rating
        rev.comment = comment
    }
})
  }else{
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
  }

let avg=0

  product.reviews.forEach(rev => { //To get ratings
    avg+=rev.rating
  })
  product.ratings=avg/product.reviews.length;

  await product.save({validateBeforeSave:false});

  res.status(200).json({
  success:true,
  
  })

})

// Get All Reviews of a product

exports.getProductReviews = catchAsyncErrors(async (req,res,next) =>{
  const product = await Product.findById(req.query.id);

  if(!product){
    return next(new ErrorHandler("Product not found",404));
  }

  res.status(200).json({
    success:true,
    reviews:product.reviews,
  })
})


// Delete Review

exports.deleteReview = catchAsyncErrors(async (req,res,next) =>{
  const product = await Product.findById(req.query.productId);

  if(!product){
    return next(new ErrorHandler("Product not found",404));
  }
  const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString())

  let avg = 0;

 reviews.forEach((rev) => {
    avg += rev.rating; 
  });
 
 let ratings = 0; 

 if(reviews.length === 0){
  ratings = 0;
 }else{
  ratings = avg / reviews.length; 
 }

 const numOfReviews = reviews.length;

 
  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numOfReviews
  },{
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,
  });

 
})