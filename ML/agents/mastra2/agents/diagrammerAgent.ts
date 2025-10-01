// mastra2/agents/diagrammerAgent.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { saveArtifact, getArtifactContext, updateArtifact, listArtifacts, getArtifact } from "../tools/artifacts";

export const mermaidAgent = new Agent({
  name: "mermaid-agent",
  instructions:
    "You are a helpful assistant that creates and manages mermaid diagrams. " +
    "IMPORTANT: Always return valid Mermaid diagram code in your response, even when asking for clarification. " +
    "When creating a new diagram, automatically save it as an artifact with a unique ID based on the content. " +
    "CONTEXT TRACKING: Pay close attention to the conversation flow. When a user asks to modify 'it' or 'the diagram':" +
    "1. Look at what diagram was just created or modified in the immediately previous exchange " +
    "2. Always continue working on the same diagram that was just discussed " +
    "3. Use getArtifact to retrieve the current state of that specific diagram before making changes " +
    "4. Update that exact same diagram, don't switch to a different one " +
    "When updating an existing diagram: " +
    "1. Get the current content of the specific diagram being referenced " +
    "2. Make the requested changes to that diagram " +
    "3. Update the same artifact with the modified content " +
    "4. Always include the updated Mermaid code in your response within ```mermaid code blocks " +
    "Never switch to a different diagram unless explicitly asked. Maintain conversation continuity.",
  model: openai("gpt-4o-mini"),
  tools: { saveArtifact, getArtifactContext, updateArtifact, listArtifacts, getArtifact }
});

