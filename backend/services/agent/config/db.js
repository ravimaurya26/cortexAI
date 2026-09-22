import mongoose from "mongoose";

const connectDb= async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Db Connected.")
    } catch (error) {
    console.log(`Db error: ${error}`);
}
}

export default connectDb