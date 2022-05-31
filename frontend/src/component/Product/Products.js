import React from 'react'
import "./Products.css"
import { useSelector,useDispatch } from 'react-redux'
import { clearErrors, getProduct } from '../../actions/productAction'
import Loader from '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard'
import { Fragment } from 'react'
import { useEffect } from 'react'
//import { useParams } from 'react-router-dom'
import Pagination from "react-js-pagination"
import { useState } from 'react'
import Slider from "@material-ui/core/Slider"
import {useAlert} from "react-alert"
import Typography from "@material-ui/core/Typography"
import MetaData from '../layout/MetaData'

const categories =[
    "Laptop",
    "Saree",
    "mobile",
    "Camera",
    "Tops",
    "Footwear",
];


const Products = ({match}) => {

    const dispatch = useDispatch();

    const alert = useAlert();

     const [currentPage, setCurrentPage] = useState(1);

     const [price, setPrice] = useState([0 , 25000])

     const [category, setCategory] = useState("")

     const [ratings, setRatings] = useState(0)

    const {products , loading , error , productsCount , resultPerPage } = useSelector((state) => state.products)
//filteredProductsCount
    const keyword = match.params.keyword;

    const setCurrentPageNo = (e)=>{
        setCurrentPage(e)

    }

    const priceHandler=(event,newPrice)=>{
        setPrice(newPrice)

    }

    // let count = filteredProductsCount;

useEffect(()=>{
    if(error){
        alert.error(error)
        dispatch(clearErrors())
    }
    dispatch(getProduct(keyword,currentPage,price,category,ratings))//ratings

},[dispatch,keyword,currentPage,price,category,ratings,alert,error])//ratings




  return (
  <Fragment>
      { loading ? <Loader /> : 
      
          <Fragment>
          <MetaData title="PRODUCT--ECOMMERCE"/>
            <h2 className='productsHeading'>Products</h2>

            <div className='products'>
            {products && products.map((product)=>(
                <ProductCard key={product._id} product={product} />

            ))}

            </div>

           <div className='filterBox'>

                 <Typography>Price</Typography> 
                   <Slider value={price} onChange={priceHandler} valueLabelDisplay='auto' aria-labelledby='range-slider' min={0} max={25000} />   
                {/* ui is bad <Slider aria-label='Custom marks' defaultValue={20} getAriaValueText={valuetext} step={100} valueLabelDisplay='auto' marks={marks} /> */}

                <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

             <fieldset>
                <Typography component="legend">Ratings </Typography>
                <Slider value={ratings} onChange={(e,newRating)=>{
                    setRatings(newRating)
                }}
                aria-labelledby="continuous-slider"
                min={0}
                max={5}
                valueLabelDisplay="auto"
                
                 />
            </fieldset> 


               
           </div>

           {/* {resultPerPage < count &&   */}
           <div className='paginationBox'>

                <Pagination 
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={productsCount}
                    onChange={setCurrentPageNo}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="1st"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="pageItemActive"
                    activeLinkClass="pageLinkActive"
                />

                </div>

          </Fragment>
      }
      
  </Fragment>
  )
     
}

export default Products