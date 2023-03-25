import './App.css';
import React, { Fragment , useEffect , useState} from 'react';
import { Route, Routes } from "react-router-dom";
import WebFont from 'webfontloader';
import axios from 'axios';
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import Home from './component/Home/Home'
import ProductDetails from './component/Product/ProductDetails'
import Products from './component/Product/Products'
import Search from './component/Product/Search'
import LoginSingup from './component/User/LoginSingup';
import store from './store'
import { loadUser } from './actions/userAction'
import UserOptions from './component/layout/Header/UserOptions'
import { useSelector } from 'react-redux';
import Profile from './component/User/Profile'
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile'
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from './component/Cart/ConfirmOrder'
import Payment from './component/Cart/Payment'; 
import OrderSuccess from './component/Cart/OrderSuccess'
import MyOrders from './component/Order/MyOrders'
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";
import NewProduct from './component/Admin/NewProduct';
import UpdateProduct from './component/Admin/UpdateProduct';
import OrderList from './component/Admin/OrderList';
import ProcessOrder from './component/Admin/ProcessOrder';
import UsersList from './component/Admin/UsersList';
import UpdateUser from './component/Admin/UpdateUser';
import ProductReviews from './component/Admin/ProductReviews';
import About from './component/layout/About/About';
import Contact from './component/layout/Contact/Contact';
import NotFound from './component/layout/NotFound/NotFound';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


function App() {

const { isAuthenticated , user } = useSelector((state) => state.user)

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }
 

   useEffect(() =>{  //As soon as th page relaods the fonts will be downloaded first
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    })
    store.dispatch(loadUser())
        getStripeApiKey();
  },[])

  window.addEventListener("contextmenu",(e) => e.preventDefault())
  return ( 
    <Fragment>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        {/* {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
            <Route exact path="/process/payment" element={<Payment />} />
        </Elements>
      )} */}
        <Route exact path="/" element={<Home />} /> 
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />

        <Route element={<ProtectedRoute />}>
          <Route exact path="/account" element={<Profile />} />
          <Route exact path="/me/update" element={<UpdateProfile />} />
          <Route exact path="/password/update" element={<UpdatePassword />} />
          <Route exact path="/shipping" element={<Shipping />} />
          <Route exact path="/order/confirm" element={<ConfirmOrder />} />
          <Route exact path="/orders" element={<MyOrders />} />
          <Route exact path="/order/:id" element={<OrderDetails />} />
          <Route
            exact
            path="/process/payment"
            element={
              stripeApiKey && (
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Payment />
                </Elements>
              )
            }
          />
          <Route
            isAdmin={true}
            exact
            path="/admin/dashboard"
            element={<Dashboard />}
          />
          <Route
            isAdmin={true}
            exact
            path="/admin/products"
            element={<ProductList />}
          />
          <Route
            isAdmin={true}
            exact
            path="/admin/product"
            element={<NewProduct />}
          />
          <Route
            isAdmin={true}
            exact
            path="/admin/product/:id"
            element={<UpdateProduct />}
          />
          <Route
            isAdmin={true}
            exact
            path="/admin/orders"
            element={<OrderList />}
          />
          <Route
            isAdmin={true}
            exact
            path="/admin/order/:id"
            element={<ProcessOrder />}
          />
          <Route
            isAdmin={true}
            exact
            path="/admin/users"
            element={<UsersList />}
          />
          <Route
            isAdmin={true}
            exact
            path="/admin/user/:id"
            element={<UpdateUser />}
          />
          <Route
            isAdmin={true}
            exact
            path="/admin/reviews"
            element={<ProductReviews />}
          />
        </Route>

        <Route exact path="/success" element={<OrderSuccess />} />

        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route
          exact
          path="/password/reset/:token"
          element={<ResetPassword />}
        />
        <Route exact path="/login" element={<LoginSingup />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route element={<NotFound />}
        />
      </Routes>
      <Footer />
    </Fragment>
  );
}

export default App;
