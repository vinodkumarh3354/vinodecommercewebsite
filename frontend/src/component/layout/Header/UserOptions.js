import React from 'react'
import { Fragment } from 'react'
import "./Header.css"
import {SpeedDial , SpeedDialAction, } from "@material-ui/lab"
import { Backdrop } from '@material-ui/core'
import { useState } from 'react'
import DashboardIcon from "@material-ui/icons/Dashboard"
import PersonIcon from "@material-ui/icons/Person"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import ListAltIcon from "@material-ui/icons/ListAlt"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import { useHistory } from 'react-router-dom'
import { useAlert } from 'react-alert'
import {logout} from "../../../actions/userAction"
import { useDispatch } from 'react-redux'
import { useSelector} from "react-redux"

const UserOptions = ({user}) => {

    const {cartItems} = useSelector((state)=>state.cart);

    const [open, setOpen] = useState(false);

    const  history = useHistory();

    const alert = useAlert();

    const dispatch = useDispatch();

    const options = [
      {icon : <ListAltIcon />, name:"Orders",func:orders},
      {icon:<PersonIcon /> , name:"Profile",func:account},
      {icon:<ShoppingCartIcon  style={{color: cartItems.length>0 ? "tomato" : "unset" }}/>, name:`Cart(${cartItems.length})`,func:Cart},
      {icon:<ExitToAppIcon /> , name:"Logout",func : logoutUser}
    ]

    if(user.role==="admin"){
      options.unshift(      {icon : <DashboardIcon />, name:"Dashboard",func:dashboard},  )
    }

    function dashboard(){
      history.push("/admin/dashboard");
    }

    function orders(){
      history.push("/orders");
    }

    function account(){
      history.push("/account");
    }

    function Cart(){
      history.push("/Cart");
    }

    function logoutUser(){
     dispatch(logout())
     alert.success("Logout Successful")
    }

  return (
    <Fragment>
    <Backdrop open={open} style={{zIndex:"10"}} />
    <SpeedDial
    className='speedDial'
    ariaLabel='SpeedDial tooltip example'
    onClose={()=>setOpen(false)}
    onOpen={()=>setOpen(true)}
    open={open}
    style={{zIndex:'11'}}
    direction="down" 
    icon={<img className='speedDialIcon' src={user.avatar.url ? user.avatar.url : "/Profile.png"} alt="Profile" />}
    >
      {options.map((item)=>(
        <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} tooltipOpen={window.innerWidth<=600? true : false} onClick={item.func}/>
      ))}
        

    </SpeedDial>

    </Fragment>

  )
}

export default UserOptions