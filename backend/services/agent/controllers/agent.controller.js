import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";


export const agent = async (req, res) => {
try {
const { prompt, conversationId,agent } = req.body;

    // Validate request
    if (!prompt || !conversationId) {
        return res.status(400).json({
            message: "Prompt and conversationId are required"
        });
    }

    // Save the user's message in MongoDB
    await axios.post(
        `${process.env.CHAT_SERVICE_URL}/api/chat/saveMessage`,
        {
            conversationId,
            role: "user",
            content: prompt
        }
    );

    // Generate AI response using previous conversation history
    const result = await graph.invoke({
        prompt,
        conversationId,
        agent
    });

    // Save the user's message in Redis memory
    await addMessage(conversationId, "user", prompt);

    // Save the assistant's response in Redis memory
    await addMessage(
        conversationId,
        "assistant",
        result.aiResponse
    );

    // Save the assistant's response in MongoDB
    await axios.post(
        `${process.env.CHAT_SERVICE_URL}/api/chat/saveMessage`,
        {
            conversationId,
            role: "assistant",
            content: result.aiResponse,
            images: result.images
        }
    );

    // Return the AI response to the frontend
    return res.status(200).json({
        answer:result.aiResponse,
        images:result.images
    });

} catch (error) {
    console.error("AGENT ERROR:", error.message);

    return res.status(500).json({
        message: `Error in agent: ${error.message}`
    });
}

};
