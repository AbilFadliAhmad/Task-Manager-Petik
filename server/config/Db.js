import mongoose from "mongoose";

export const connectDb = async()=>{
    try {
        await mongoose.connect(`${process.env.MOONGOOSE_URL}/task_manager`);
        console.log("Database Telah tersambung");
    } catch (error) {
        console.log(error);
        
    }
}