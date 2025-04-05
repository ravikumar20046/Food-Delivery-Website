// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";

// // Placing user order from frontend without payment gateway
// const placeOrder = async (req, res) => {
//     try {
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address,
//             payment: true // Directly marking order as booked
//         });
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//         res.json({ success: true, message: "Order booked successfully", orderId: newOrder._id });
//     } catch (err) {
//         console.log(err);
//         res.json({ success: false, message: "Error" });
//     }
// };

// // User orders for frontend
// const userOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({ userId: req.body.userId });
//         res.json({ success: true, data: orders });
//     } catch (err) {
//         console.log(err);
//         res.json({ success: false, message: "Error" });
//     }
// };

// // Listing orders for admin panel
// const listOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.map({});
//         res.json({ success: true, data: orders });
//     } catch (err) {
//         console.log(err);
//         res.json({ success: false, message: "Error" });
//     }
// };

// export { placeOrder, userOrders, listOrders };

// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "stripe"

// const stripe= new Stripe(process.env.STRIPE_SECRET_KEY);

// //placing user order from frontend
// const placeOrder=async (req,res)=>{

//     const frontend_url="http://localhost:5173";


//     try{
//         const newOrder=new orderModel({
//             userId:req.body.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             address:req.body.address
//         })
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

//         const line_items=req.body.items.map((item)=>({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price*100*80
//             },
//             quantity:item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:2*100*80
//             },
//             quantity:1
//         })
//         const session=await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:"payment",
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
//         })

//         res.json({success:true,session_url:session.url})

//     }catch(err){
//         console.log(err);
//         res.json({success:false,message:"Error"});
//     }
// }


// const verifyOrder=async(req,res)=>{
//     const {orderId,success}=req.body;
//     try{
//         if(success==="true"){
//             await orderModel.findByIdAndUpdate(orderId,{payment:true});
//             res.json({success:true,message:"Paid"});
//         }else{
//             await orderModel.findByIdAndDelete(orderId);
//             res.json({success:false,message:"Not Paid"});
//         }
//     }catch(err){
//         console.log(err);
//         res.json({success:false,message:"Error"});
//     }
// }


// //user orders for fronted
// const userOrders=async(req,res)=>{
//     try{
//         const orders=await orderModel.find({userId:req.body.userId})
//         res.json({success:true,data:orders});

//     }catch(err){
//         console.log(err);
//         res.json({success:false,message:"Error"});
//     }
// }

// //Listing orders for admin panel
// const listOrders=async(req,res)=>{
//     try{
//         const orders=await orderModel.find({});
//         res.json({success:true,data:orders})
//     }catch(err){
//         console.log(err);
//         res.json({success:false,message:"Error"});
//     }
// }

//    // api for updating order status
//    const updateStatus=async(req,res)=>{
//     try{
//     await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body})
//     res.json({success:true,message:"Status Updated"})
//     }catch(err){
//         console.log(err);
//         res.json({success:false,message:"Error"});
//     }
//    }

// export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}


import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

// Placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Convert amount to paise
        const amountInPaise = req.body.amount * 100;
        console.log(newOrder);

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `order_${newOrder._id}`,
            payment_capture: 1
        });
        console.log("razorPayorder" , razorpayOrder);
        console.log('rahul');

        res.json({ success: true, razorpayOrder, orderId: newOrder._id });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error" });
    }
};

// Verifying payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error" });
    }
};

// User orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error" });
    }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders };
