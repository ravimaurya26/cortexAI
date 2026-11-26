import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import fs from "fs/promises";
import { deductCredits } from "../utils/deductCredits.js";

export const imageAnalyzer = async (state) => {
  try {
    const llm = await getModel("imageAnalyzer");
    if (!state.file) {
    throw new Error("No image file received by imageAnalyzer");
     }

    const imageBuffer = await fs.readFile(state.file.path);
    const base64Image = imageBuffer.toString("base64");

    const messages = [
      new SystemMessage(`
You are CortexAI image analyzer Agent.

Rules:

- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image, extract it.
- If charts or tables exist, explain them.
- If something is unclear, say so.
- Use Markdown when helpful.
- Do not hallucinate.
      `),

      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "analyze the image",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.mimetype};base64,${base64Image}`,
            },
          },
        ],
      }),
    ];

    const response = await llm.invoke(messages);
    
    await deductCredits(state.userId,"vision")
    return {
      ...state,
      aiResponse: response.content,
    };
  }
   catch (error) {
    console.log("Image Analysis Error:", error);

    return {
        ...state,
        aiResponse: error.status === 503
            ? "Gemini is currently experiencing high demand. Please try again in a few moments."
            : "Failed to analyze image. Please try again.",
    };
}
  
  finally {
  if (state.file?.path) {
    try {
      await fs.unlink(state.file.path);
    } catch (err) {
      console.log("Failed to delete file:", err);
    }
  }
  }
};