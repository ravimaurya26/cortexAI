import express from "express";
import {createConversation, getConversations, saveMessage,getMessage, updateConversation} from "../controllers/chat.controller.js";

const router = express.Router()

router.get("/create-conversation",createConversation)     
router.get("/getConversation",getConversations)
router.post("/updateConversation",updateConversation)
router.post("/saveMessage",saveMessage)
router.get("/getMessage/:conversationId",getMessage)

export default router