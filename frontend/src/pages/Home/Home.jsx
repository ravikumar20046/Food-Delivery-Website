import React,{useState} from 'react'
import './Home.css'
import FoodDisplay from  '../../components/FoodDisplay/FoodDisplay';
import Header from "../../components/Header/Header"
import MenuBar from '../../components/Menu-bar/MenuBar'
import AppDownload from "../../components/AppDownload/AppDownload"
 const Home = () => {
  const [category,setCategory]=useState("All");
  console.log(category);


  return (
    <div>
      <Header />
      <MenuBar setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  )
}
export default Home;