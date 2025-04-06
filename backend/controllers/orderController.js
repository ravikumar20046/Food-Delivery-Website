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
//api for updating order status

   const updateStatus=async(req,res)=>{
    try{
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })

    res.json({success:true,message:"Status Updated"})
    }catch(err){
        console.log(err);
        res.json({success:false,message:"Error"});
    }
   }

export { placeOrder, verifyOrder, userOrders, listOrders,updateStatus };
