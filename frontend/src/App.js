import './App.css';
import Header from "./component/layout/Header/Header.js";
import {BrowserRouter as Router,Route} from "react-router-dom";
import webfont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails"
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store"
import { LoadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.js"
import  {useSelector} from "react-redux"
import Profile from "./component/User/Profile.js"
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword from "./component/User/ResetPassword.js"
import Cart from "./component/Cart/Cart"
import Shipping from "./component/Cart/Shipping.js"

function App() {

  const {isAuthenticated,user} = useSelector(state=>state.user)

  React.useEffect(()=>{

    webfont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"]
      }
    })

    store.dispatch(LoadUser())
  
  },[]);

  return (
  <Router>
    <Header />

    {isAuthenticated && <UserOptions user={user} />}
    <Route exact path='/' component={Home}/>
    <Route exact path='/product/:id' component={ProductDetails}/>
    <Route exact path='/products' component={Products}/>
    <Route  path='/products/:keyword' component={Products}/>


    <Route exact path='/search' component={Search}/>

    <ProtectedRoute exact path='/account' component={Profile} />

    <ProtectedRoute exact path='/me/update' component={UpdateProfile} />

    <ProtectedRoute exact path='/password/update' component={UpdatePassword} />

    <Route exact path='/password/forgot' component={ForgotPassword} />

    <Route exact path='/password/reset/:token' component={ResetPassword} />

    <Route exact path='/Cart' component={Cart} />

    <Route exact path='/login' component={LoginSignUp}/>

    <ProtectedRoute exact path='/shipping' component={Shipping} />








    <Footer />
  </Router>
  );
}

export default App;
