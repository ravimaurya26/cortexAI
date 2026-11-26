import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import "dotenv/config";
import { ChatOpenRouter } from "@langchain/openrouter";


const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
})



const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash",
    temperature: 0,
    maxRetries: 2,
    // other params...
})

const openrouter = new ChatOpenRouter({
    model:"deepseek/deepseek-chat",
    temperature:0,
    maxTokens:2500
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
        case "imageAnalyzer":
            return gemini;
        case "coding":
            return openrouter;
        default:
            return groq;
    }
}