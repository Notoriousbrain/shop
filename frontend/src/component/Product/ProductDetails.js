import React, { Fragment, useEffect , useState} from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails, newReview } from "../../actions/productAction";
import { useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import ReviewCard from "./ReviewCard.js";
import Loader from '../layout/Loader/Loader'
import {useAlert} from 'react-alert'
import { addItemsToCart } from "../../actions/cartAction";
import {
   Dialog ,
   DialogActions,
   DialogContent,
   DialogTitle,
   Button
} from '@material-ui/core'
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const alert = useAlert();

  const { product, loading, error } = useSelector( //actually getting the value from reducers
    (state) => state.productDetails //Getting state from store
  );

 const { success, error: reviewError } = useSelector(
   (state) => state.newReview
 );

  const [ quantity , setQuantity ] = useState(1);
  const [ open , setOpen ] = useState(false);
  const [ rating , setRating ] = useState(0);
  const [ comment , setComment ] = useState("");

  const increaseQuantity = () => {
    if(product.stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  }
  const decreaseQuantity = () => {
    if(quantity<2) return;

    const qty = quantity - 1;
    setQuantity(qty);
  }

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id,quantity));
    alert.success("Item added to cart")
  }

  const submitReviewToggle = () =>{
    open ? setOpen(false) : setOpen(true)
  }

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating );
    myForm.set("comment", comment );
    myForm.set("productId", id );

    dispatch(newReview(myForm))

    setOpen(false);
  }

  useEffect(() => {
    if(error){
      alert.error(error)
      dispatch(clearErrors())
    }
    if(reviewError){
      alert.error(reviewError)
      dispatch(clearErrors())
    }
    if(success){
      alert.success("Review Submitted Successfully")
      dispatch({type: NEW_REVIEW_RESET})
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id,error,alert,reviewError,success]);

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    key:product.ratings,
    isHalf: true,
  };

  
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title= {`${product.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
            <div>
              <Carousel className="CarouselImage">
                {product.images &&
                  product.images.map((item, i) => {
                    return (
                      <img
                        className="CarouselImage"
                        key={item.url}
                        src={item.url}
                        alt={`${i} Slide`}
                      />
                    );
                  })}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product #{product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span>({product.numOfReviews} Reviews )</span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly value={quantity} type="number" />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button disabled={product.stock<1?true:false}onClick={addToCartHandler}>Add to Cart</button>
                </div>
                <p>
                  Status:
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1 ? "OutofStock" : "InStock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>
              <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog
          aria-labelledby="simple-dialog-title"
          open={open}
          onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
              onChange={(e) => setRating(e.target.value)}
              value={rating}
              size="large"
              />
              <textarea
              className="submitDialogTextArea"
              cols="30"
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">Cancel</Button>
              <Button onClick={reviewSubmitHandler} color="primary">Submit</Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review,i) => <ReviewCard review={review} key={i} />)}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
