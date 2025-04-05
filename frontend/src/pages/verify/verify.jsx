import React,{useEffect} from 'react'
import "./verify.css"
import { StoreContext } from '../../context/StoreContext';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const verify = () => {
    const [searchParams,setSearchParams]=useSearchParams();
    const success=searchParams.get("success");
    const orderId=searchParams.get("orderId");
    const {url} = useContext(StoreContext);
    const navigate=useNavigate();

    const verifyPayment=async()=>{
        const response =await axios.post(url+"/api/order/verify",{success,orderId});
        if(response.data.response){
            navigate("/myorders");
        }else{
            navigate("/");
        }
    }
    console.log(success,orderId);

    useEffect(()=>{
        verifyPayment();
    },[]);

  return (
    <div className="verify">
        <div className="spinner">

        </div>
    </div>
  )
}

export default verify