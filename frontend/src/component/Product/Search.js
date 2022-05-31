import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import "./Search.css"
import MetaData from '../layout/MetaData'



const Search = ({history}) => {
    const [keyword, setKeyword] = useState("")

    const searchSubmitHandler=(e)=>{
        e.preventDefault();
        if(keyword.trim()){
            history.push(`/products/${keyword}`)
        }else{
            history.push("/products")
        }
    }

  return (
    <Fragment>
              <MetaData title="Search A Product--ECOMMERCE"/>

        <form className='searchBox' onSubmit={searchSubmitHandler}>
        <input type="text"
         placeholder='search Product' onChange={(e)=>setKeyword(e.target.value)}>

        </input>
        <input type="submit" value="Search" />
        </form>
    </Fragment>
  )
}

export default Search