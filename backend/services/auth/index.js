import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "./routes/auth.routes.js";
dotenv.config();

const port= process.env.PORT

const app = express()
app.use(express.json())
app.use("/",router)

app.get("/",(req,res)=>{
    res.json({message:"hello from auth"})
})
app.listen(port, () => {
  console.log(`auth is stared at port ${port}`);
  connectDb()
})