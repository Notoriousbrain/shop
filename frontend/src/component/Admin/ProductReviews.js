import React, { Fragment, useEffect , useState} from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./ProductReviews.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllReviews,
  deleteReviews,
} from "../../actions/productAction";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@material-ui/icons/Delete";
import Star from '@material-ui/icons/Star'
import Sidebar from "./Sidebar";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error: deleteError, isDeleted } = useSelector((state) => state.review);

  const { error, reviews , loading } = useSelector((state) => state.productReviews);

  const [ productId , setProductId ] = useState("")

  
    const deleteReviewsHandler = (reviewId) => {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="alert">
              <h1 className="alert__title">Are you sure?</h1>
              <p className="alert__body">You want to delete this review?</p>
              <button
                onClick={() => {
                    dispatch(deleteReviews(reviewId, productId));
                  onClose();
                }}
                className="alert__btn alert__btn--yes"
              >
                Yes, Delete it!
              </button>
              <button onClick={onClose} className="alert__btn alert__btn--no">
                No
              </button>
            </div>
          );
        },
      });
    };

  // const deleteReviewsHandler = (reviewId) => {
  //   dispatch(deleteReviews(reviewId,productId));
  // };

  const productReviewsSubmitHandler = (e) =>{
    e.preventDefault();

    dispatch(getAllReviews(productId))
  }

  useEffect(() => {
      if (productId.length === 24) {
        dispatch(getAllReviews(productId));
      }
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors);
    }
    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      navigate("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, alert, error, isDeleted, deleteError,productId, navigate]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 225, flex: 0.7 },
    {
      field: "user",
      headerName: "Name",
      minWidth: 125,
      flex: 0.6,
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 125,
      flex: 0.7,
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 100,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 100,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              onClick={() =>
                deleteReviewsHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];
  const rows = [];


  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });
  return (
    <Fragment>
      <MetaData title={"ALL REVIEWS --ADMIN"} />
      <div className="dashboard">
        <Sidebar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
              <Star />
              <input
                type="text"
                placeholder=" Name"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={
                loading ? true : false || productId === "" ? true : false
              }
            >
              Update
            </Button>
          </form>
          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="productListTable"
              autoHeight
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
