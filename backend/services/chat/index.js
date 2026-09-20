import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";

dotenv.config();

const port= process.env.PORT

const app = express()
app.use(express.json())


app.get("/",(req,res)=>{
    res.json({message:"hello from chat"})
})
app.listen(port, () => {
  console.log(`chat is stared at port ${port}`);
  connectDb()
})