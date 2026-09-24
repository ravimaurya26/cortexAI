import { getModel } from "../config/llmModels.js";

const VALID_AGENTS = ["chat", "search", "vision", "ppt", "pdf", "coding"];

export const router = async (state) => {
  try {
    const llm = await getModel("router");

    const prompt = `You are an AI agent router.
Based on the user's input, choose the agent best suited to handle the request.

Available agents:
- chat: general conversation and simple questions
- search: web search and up-to-date information
- vision: image generation and image processing
- ppt: PowerPoint presentation generation
- pdf: PDF document processing
- coding: code generation and programming tasks

Respond with exactly one word from this list: chat, search, vision, ppt, pdf, coding.
No explanation, no punctuation. If the input is ambiguous, respond with chat.

User input: ${state.prompt}
Selected agent:`;

    const response = await llm.invoke(prompt);
    const text = String(response.content).trim().toLowerCase();

    // Pick the first valid agent name found in the reply, else fall back to chat
    const agent = VALID_AGENTS.find((a) => text.includes(a)) ?? "chat";

    return { agent };
  } catch (error) {
    console.error("Router failed, defaulting to chat:", error);
    return { agent: "chat" };
  }
};