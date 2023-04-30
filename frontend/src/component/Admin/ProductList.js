import React ,{ Fragment , useEffect } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import './ProductList.css'
import { confirmAlert } from "react-confirm-alert"; 
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSelector , useDispatch } from 'react-redux'
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "../../actions/productAction";
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Button } from '@material-ui/core'
import MetaData from '../layout/MetaData'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import Sidebar from './Sidebar'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';

const ProductList = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    
    const { error , products } = useSelector((state) => state.products);

    const { error: deleteError , isDeleted } = useSelector((state) => state.product);

    useEffect(() => {
    if(error){
        alert.error(error);
        dispatch(clearErrors)
    }
    if(deleteError){
        alert.error(deleteError);
        dispatch(clearErrors)
    }
    if(isDeleted){
        alert.success("Product Deleted Successfully");
        navigate('/admin/dashboard')
        dispatch({type: DELETE_PRODUCT_RESET})
    }
    dispatch(getAdminProducts())
    },[dispatch , alert , error , isDeleted , deleteError , navigate])

    const columns = [
        {field: "id" , headerName: "Product ID", minWidth: 225, flex: 0.75},
        {
            field:"name",
            headerName:"Name",
            minWidth: 125,
            flex:0.5
        },
        {
            field:"stock",
            headerName:"Stock",
            type: "number",
            minWidth: 140,
            flex:0.3
        },
        {
            field:"price",
            headerName:"Price",
            type: "number",
            minWidth: 170,
            flex:0.4
        },{
            field: "actions",
            flex: 0.3,
            headerName: "Actions", 
            minWidth: 100,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                  <Fragment>
                    <Link
                      to={`/admin/product/${params.getValue(params.id, "id")}`}
                    >
                      <EditIcon />
                    </Link>
                    <Button onClick={() => deleteProductHandler(params.getValue(params.id,"id"))}>
                      <DeleteIcon />
                    </Button>
                  </Fragment>
                );
            }
        }
    ]
    const rows = [];

    const deleteProductHandler = (id) => {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="alert">
              <h1 className="alert__title">Are you sure?</h1>
              <p className="alert__body">You want to delete this product?</p>
              <button
                onClick={() => {
                  dispatch(deleteProduct(id));
                  onClose()
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
    products && products.forEach((item) =>{
        rows.push({
            id: item._id,
            stock: item.stock,
            price: item.price,
            name: item.name
        })
    })
  return (
    <Fragment>
        <MetaData title={"ALL PRODUCTS --ADMIN"} />
        <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
                <h1 id="productListHeading">ALL PRODUCTS</h1>
                <DataGrid
                rows={rows}
                columns={columns}
                pageSize= {10}
                disableSelectionOnClick
                className='productListTable'
                autoHeight
                />
            </div>
        </div>
    </Fragment>
  )
}

export default ProductList