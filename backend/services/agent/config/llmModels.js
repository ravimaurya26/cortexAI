import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import "dotenv/config";                 

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
})



const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    temperature: 0,
    maxRetries: 2,
    // other params...
})

export const getModel = async (agent)=>{
    switch(agent){
        case "chat":
            return groq;
        case "search":
            return groq;
        case "vision":
            return groq;
        case "ppt":
            return groq;
        case "pdf":
            return groq;
        case "coding":
            return gemini;
        default:
            return groq;
    }
}