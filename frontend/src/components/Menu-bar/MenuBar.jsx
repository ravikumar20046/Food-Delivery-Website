import React, { useState } from 'react';
import './MenuBar.css';
import { menu_list } from '../../assets/assets';

const MenuBar = ({ setCategory }) => {
  const [curr, setCurr] = useState(null);

  const handleMenuClick = (menuName) => {
    if (curr === menuName) {
      setCurr(null);
    } else {
      setCurr(menuName);
    }
    setCategory(menuName);
  };

  return (
    <div className="menu-bar-contents" id="explore-menu">
      <h2>Explore Our Menu</h2>
      <p>A digital initiative by the institute facilitating Faculty, Staff, Students, Parents and Alumni to access and process Academics, Research, Supporting services ...</p>
      <div className="menu">
        {menu_list.map((data, index) => (
          <div 
            onClick={() => handleMenuClick(data.menu_name)} 
            key={index} 
            className="menu-list"
          >
            <img 
              className={curr === data.menu_name ? 'selected' : ''} 
              src={data.menu_image} 
              alt="" 
            />
            <p>{data.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default MenuBar;
