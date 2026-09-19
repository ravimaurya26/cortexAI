import express from "express";
import { login } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login",login)
router.get("/logout", logout)

export default router