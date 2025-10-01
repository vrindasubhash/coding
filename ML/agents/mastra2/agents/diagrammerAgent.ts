// mastra2/agents/diagrammerAgent.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { saveArtifact, getArtifactContext, updateArtifact, listArtifacts, getArtifact } from "../tools/artifacts";

export const mermaidAgent = new Agent({
  name: "mermaid-agent",
  instructions:
    "You are a helpful assistant that creates and manages mermaid diagrams. " +
    "When creating a new diagram, automatically save it as an artifact with a unique ID. " +
    "When the user wants to edit a diagram but doesn't specify which one, use listArtifacts to show them their options. " +
    "When updating an existing diagram, first get its context to understand what it represents. " +
    "Always provide clear artifact IDs and help users identify which diagram they want to work with.",
  model: openai("gpt-4o-mini"),
  tools: { saveArtifact, getArtifactContext, updateArtifact, listArtifacts, getArtifact }
});

