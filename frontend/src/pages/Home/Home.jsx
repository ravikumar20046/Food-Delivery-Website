import React,{useState} from 'react'
import './Home.css'
import FoodDisplay from  '../../components/FoodDisplay/FoodDisplay';
import Header from "../../components/Header/Header"
import MenuBar from '../../components/Menu-bar/MenuBar'
 const Home = () => {
  const [category,setCategory]=useState("All");

  return (
    <div>
      <Header />
      <MenuBar />
      <FoodDisplay category={category} />
    </div>
  )
}
export default Home;