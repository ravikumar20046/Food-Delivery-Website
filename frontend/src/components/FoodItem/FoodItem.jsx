import React,{useState,useContext} from 'react'
import "./FoodItem.css"
import {assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
const FoodItem = ({id,name,price,description,image}) => {
  const {cartItems,addToCart,removeFromCart,url}=useContext(StoreContext);
  return(
    <div className="food-item"> 
    <div className="food-item-img-container">
        <img className='food-item-image' src={url+"/images/"+image} alt="" />
        {!cartItems[id]?<img className="icon_white" onClick={()=>{addToCart(id)}} src={assets.add_icon_white} alt="" />:
               <div className="icon_white" style={{display:'flex', justifyContent:'center',alignItems:'center',gap:'10px'
               }}>
                <img onClick={()=>{addToCart(id)}} src={assets.add_icon_green} alt="" />
               <p>{cartItems[id]}</p>
               <img onClick={()=>{removeFromCart(id)}} src={assets.remove_icon_red} alt="" />
               </div>
            }
        
    </div>
    <div className="food-item-info">
      <div className="food-item-name-rating">
      <p className="name">{name}</p>
      <img src={assets.rating_starts} alt="" />
      </div>
      <p className='food-item-desc'>{description}</p>
      <p className="food-item-price">{"$"+price}</p>
    </div>
    </div>
  )
}

export default FoodItem;