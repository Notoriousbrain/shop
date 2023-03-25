import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSelector, useDispatch } from "react-redux";
import {
  ClearErrors,
  getAllOrders,
  deleteOrder,
} from "../../actions/orderAction";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Sidebar";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const OrderList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, orders } = useSelector((state) => state.allOrders);

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.order
  );

     const deleteOrderHandler = (id) => {
       confirmAlert({
      //    title: "Are you sure?",
      //    message: "Click Delete to delete",
      //    buttons: [
      //      {
      //        label: "Delete",
      //        onClick: () => {
      //          dispatch(deleteOrder(id));
      //        },
      //      },
      //      {
      //        label: "Cancel",
      //      },
      //    ],
      //  });
       customUI: ({onClose}) => {
         return (
           <div className="alert">
             <h1 className="alert__title">Are you sure?</h1>
             <p className="alert__body">You want to delete this order?</p>
             <button
               onClick={() => {
                 dispatch(deleteOrder(id));
                 onClose();
               }}
               className="alert__btn alert__btn--yes"
             >
               Yes, Delete it!
             </button>
             <button onClick={onClose}  className="alert__btn alert__btn--no">
               No
             </button>
           </div>
         );
       }
      })
     };

  //  const deleteOrderHandler = (id) => {
  //    dispatch(deleteOrder(id));
  //  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(ClearErrors);
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(ClearErrors);
    }
    if (isDeleted) {
      alert.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }
    dispatch(getAllOrders());
  }, [dispatch, alert, error, isDeleted, deleteError, navigate ]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 0.75 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 165,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 160,
      flex: 0.3,
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
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>
            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
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



  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });
  return (
    <Fragment>
      <MetaData title={"ALL ORDERS --ADMIN"} />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;
