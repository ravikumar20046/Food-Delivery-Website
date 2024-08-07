import React,{useState} from 'react'
import "./MenuBar.css"
import { menu_list } from '../../assets/assets'
const MenuBar = () => {
  const [curr,setCurr]=useState(null);
  return (
      <div className="menu-bar-contents">
        <h2>Explore Our Menu</h2>
        <p>A digital initiative by the institute facilitating Faculty, Staff, Students, Parents and Alumni to access and process Academics, Research, Supporting services ...</p>
        <div className="menu">
          {menu_list.map((data,index)=>{
            return(
            <div onClick={()=>setCurr(prev=>prev===data.menu_name?"null":data.menu_name)}  key={index} className="menu-list">
              <img className={curr === data.menu_name? 'selected' : ''}
              src={data.menu_image} alt="" />
              <p>{data.menu_name}</p>
              </div>)
          })}
        </div>
        <hr />
    </div>
  )
}


export default MenuBar