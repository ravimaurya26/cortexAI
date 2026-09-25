import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js"
import router from "./routes/chat.routes.js"

dotenv.config();

const port= process.env.PORT

const app = express()
app.use(express.json())
app.use("/api/chat",router)


app.get("/",(req,res)=>{
    res.json({message:"hello from chat"})
})
app.listen(port, () => {
  console.log(`chat is stared at port ${port}`);
  connectDb()
})