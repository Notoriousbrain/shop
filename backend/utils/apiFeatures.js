// To write api features like search,filter,pagination

class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr
    }
// To search the products
    search(){
        const keyword = this.queryStr.keyword ? {
         name:{
            $regex: this.queryStr.keyword,
            $options: "i",
         },
        }:{};

        this.query = this.query.find({...keyword})
        return this;
    }
// To filter the product
    filter(){
        const queryCopy = {...this.queryStr}  //This will make the copy of queryStr which is keyword and store in queryCopy so the main queryStr won't change

// Removing some fields for category
const removeFields = ["keyword","page","limit"];

removeFields.forEach(key=>delete queryCopy[key]);  //This will remove the basic fields like keyword,page,limit

// Filter for price and rating

let queryStr = JSON.stringify(queryCopy); //Now assigning the copy value to str
queryStr = queryStr.replace(/\b()\b(gt|gte|lt|lte)\b/g,key =>`$${key}`);  

this.query = this.query.find(JSON.parse(queryStr));

return this;
    }

pagination(resultPerPage) { //to decide how many product will be shown on single page
  const currentPage = Number(this.queryStr.page || 1);  //The page which is currently showing the products

  const skip = resultPerPage * (currentPage - 1); //To determine how many product to skip

  this.query = this.query.limit(resultPerPage).skip(skip); //If we have 50 products and we have to show 10 products per paeg then 1st page will not skip any product but the second page will skip first 10 products and 3rd page will skip 20 products.

  return this;
}
}

module.exports = ApiFeatures