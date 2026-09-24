import { StateGraph, START, END } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";               // ✅ from graph/, not the controller

import { searchAgent } from "../agents/search.agent.js";
import { chatAgent } from "../agents/chat.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { visionAgent } from "../agents/vision.agent.js";

const workflow = new StateGraph(agentState);

workflow.addNode("router", router);
workflow.addNode("searchAgent", searchAgent);
workflow.addNode("chatAgent", chatAgent);
workflow.addNode("visionAgent", visionAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("coding", codingAgent);

workflow.addEdge(START, "router");

workflow.addConditionalEdges(
  "router",
  (state) => state.agent ?? "chat",   // returns a key...
  {                                   // ...which this map turns into a node name
    chat: "chatAgent",
    search: "searchAgent",
    vision: "visionAgent",
    ppt: "ppt",
    pdf: "pdf",
    coding: "coding",
  }
);

workflow.addEdge("searchAgent", "chatAgent");   // search results feed into chat
workflow.addEdge("chatAgent", END);
workflow.addEdge("visionAgent", END);
workflow.addEdge("ppt", END);
workflow.addEdge("pdf", END);
workflow.addEdge("coding", END);

export const graph = workflow.compile();