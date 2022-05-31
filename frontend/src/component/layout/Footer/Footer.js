import React from 'react';
import applestore from "../../../images/applestore.jpg";
import googleplay from "../../../images/googleplay.png";
import "./Footer.css"


const Footer=()=> {
  return (
    <footer id="footer">

    <div className='leftFooter'>

        <h4>Download our App</h4>
        <p>Download app for Android and IOS mobile phone</p>
        <img src={googleplay} alt='playstore'/>
        <img src={applestore} alt='applestore'/>
    </div>

    <div className='midFooter'>
 
    <h1>ECOMMERCE</h1>
    <p>High Quality is our first priority</p>

    <p>Copyrights 2022 &copy MeVinodKumar</p>


    </div>

    <div className='rightFooter'>
    <h4>Follow Us</h4>
    <a href='https://www.instagram.com/vinod_halvi/'>Instagram</a>
    <a href='mailto:hvinodkumar3354@gmail.com'>gmail</a>

    </div>

    </footer>
  )
}

export default Footer