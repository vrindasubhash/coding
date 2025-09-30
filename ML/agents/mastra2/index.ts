//mastra2/index.ts
import { Mastra } from "@mastra/core";
import { helloAgent } from "./agents/helloAgent";
import { hello } from "./tools/hello";

// Create a Mastra instance and register your agents + tools
export const mastra = new Mastra({
  agents: [helloAgent],
  tools: [hello],
});

