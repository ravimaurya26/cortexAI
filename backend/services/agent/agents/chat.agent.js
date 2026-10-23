import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

import {
    SystemMessage,
    HumanMessage,
    AIMessage
} from "@langchain/core/messages";

export const chatAgent = async (state) => {
    const llm = await getModel("chat");

    // Get previous conversation history
    const history = await getMemory(state.conversationId);

    // Ensure history is always an array
    const safeHistory = Array.isArray(history) ? history : [];

    const searchContext = state.searchResults?
    `Web Search Results:
     ${JSON.stringify(state.searchResults)}
    Answer the user using only the above search results. 
    `:""

    const systemPrompt = `
You are CortexAI, an intelligent AI assistant.
  
   ${searchContext}

    if searcContext exists:
   -Use search result to answer
   -Do not mention internal tools.



Rules:

- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.
`;

    const messages = [
        new SystemMessage(systemPrompt)
    ];

    // Add previous conversation history
    safeHistory.forEach((msg) => {
        if (msg.role === "user") {
            messages.push(
                new HumanMessage(msg.content)
            );
        } else if (msg.role === "assistant") {
            messages.push(
                new AIMessage(msg.content)
            );
        }
    });

    // Add the current user prompt
    messages.push(
        new HumanMessage(state.prompt)
    );

    console.log(
        "Conversation history count:",
        safeHistory.length
    );

    console.log(
        "Messages sent to LLM:",
        messages
    );

    // Generate AI response
    const response = await llm.invoke(messages);

    return {
        ...state,
        aiResponse: typeof response.content === "string"
            ? response.content.trim()
            : JSON.stringify(response.content)
    };
};