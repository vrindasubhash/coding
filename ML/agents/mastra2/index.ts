//mastra2/index.ts
import { Mastra } from "@mastra/core";
import { helloAgent } from "./agents/helloAgent";
import { mermaidAgent } from "./agents/diagrammerAgent";

// Create a Mastra instance and register your agents
export const mastra = new Mastra({
  agents: { 
    helloAgent,
    mermaidAgent 
  },
});

