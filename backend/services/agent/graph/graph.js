import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "../agents/router.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { chatAgent } from "../agents/chat.agent.js";    
import { pptAgent } from "../agents/ppt.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { visionAgent } from "../agents/image.agent.js";


const workflow = new StateGraph(agentState)

workflow.addNode("router",router)
workflow.addNode("searchAgent",searchAgent)
workflow.addNode("chatAgent",chatAgent)
workflow.addNode("visionAgent",visionAgent)
workflow.addNode("ppt",pptAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("coding",codingAgent)


workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router",(state)=>{
    switch(state.agent){
        case "chat":
            return "chatAgent";
        case "search":
            return "searchAgent";
        case "vision":
            return "visionAgent";
        case "ppt":
            return "ppt";
        case "pdf":
            return "pdf";
        case "coding":
            return "coding";
        default:
            return "chatAgent";
    }{
        chat: "chatAgent";
        search: "searchAgent";
        vision: "visionAgent";
        ppt: "ppt";
        pdf: "pdf";
        coding: "coding";   
     
    }
})

workflow.addEdge("search","chat")
workflow.addEdge("chat",__end__)
workflow.addEdge("vision",__end__)
workflow.addEdge("ppt",__end__)
workflow.addEdge("pdf",__end__)
workflow.addEdge("coding",__end__)


export const graph = workflow.compile()
