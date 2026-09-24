import axios from "axios";
import { graph } from "../graph/graph.js";

export const agent = async (req,res) => {
    try {
        const { prompt, conversationId  } = req.body;  // Extract prompt and conversationId from the request body
        await axios.post('${process.env.AGENT_SERVICE_URL}/save-message', { 
            conversationId,
            role: "user",
            content: prompt});

            const result = await graph.invoke({ // Invoke the graph with the provided state
                       prompt,conversationId
            })

            const response = result.aiResponse
            return res.status(200).json({ aiResponse: response });

        }
    catch (error) {
        return res.status(500).json({ message: `Error saving user message: ${error}` });
    }   
}    