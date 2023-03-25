import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Sidebar";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import { getAllUsers ,clearErrors, deleteUser} from "../../actions/userAction";

const UsersList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, users } = useSelector((state) => state.allUsers);

  const { error: deleteError , isDeleted , message } = useSelector((state) => state.profile);

  
     const deleteUserHandler = (id) => {
       confirmAlert({
         //  title: "Are you sure?",
         //  message: "Click Delete to delete",
         //  buttons: [
         //    {
         //      label: "Delete",
         //      onClick: () => {
         //        dispatch(deleteUser(id));
         //      },
         //    },
         //    {
         //      label: "Cancel",
         //    },
         //  ],
         customUI: ({onClose}) => {
           return (
             <div className="alert">
               <h1 className="alert__title">Are you sure?</h1>
               <p className="alert__body">You want to delete this user?</p>
               <button
                 onClick={() => {
                   dispatch(deleteUser(id));
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

  // const deleteUserHandler = (id) => {
  //   dispatch(deleteUser(id));
  // };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors);
    }
    if (isDeleted) {
      alert.success(message);
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }
    dispatch(getAllUsers());
  }, [dispatch, alert, error,message, isDeleted, deleteError, navigate]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 225, flex: 0.5 },
    {
      field: "email",
      headerName: "Email",
      minWidth: 125,
      flex: 0.7,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 140,
      flex: 0.5,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 120,
      flex: 0.4,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
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
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>
            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
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

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });
  return (
    <Fragment>
      <MetaData title={"ALL USERS --ADMIN"} />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>
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

export default UsersList;
