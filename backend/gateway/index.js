import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";
const port = process.env.PORT

const app = express();
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}))

app.use(cookieParser())
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL))
app.get("/api/me",protect,getCurrentUser)

app.get("/",(req,res)=>{
    res.json({message:"hello from gateway"})
})

app.listen(port, () => {
  console.log(`Gateway is stared at port ${port}`);
});