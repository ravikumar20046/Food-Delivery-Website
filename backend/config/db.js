import mongoose from "mongoose";


export const connectDB=async () =>{
    (await mongoose.connect('mongodb+srv://ravi:9716@cluster0.91kcx.mongodb.net/food_website'));
}