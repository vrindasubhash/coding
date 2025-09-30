// src/mastra/agents/diagrammer.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { MermaidDiagramTool } from "../tools/mermaid-diagram.tool";
import { WireframeTool } from "../tools/wireframe-excalidraw.tool";
import { FigmaWireframeTool } from "../tools/wireframe-figma.tool";
import { trace } from "@mastra/core/trace";

export const diagrammer = new Agent({
  name: "diagrammer",
  instructions: `
You generate product/system diagrams and wireframes.
CRITICAL RULES:
- Always use a tool; NEVER answer directly in plain text.
- For flowcharts, sequence, ER, or journey diagrams, call mermaid-diagram.
- For UI layouts or wireframes, call wireframe-excalidraw or wireframe-figma.
Return only the tool output.`,
  model: openai("gpt-4o-mini"),
  tools: { MermaidDiagramTool, WireframeTool, FigmaWireframeTool },
  async generate(input, options) {
    console.log("[Diagrammer] Input to LLM:", input);
    const response = await this.model.generate(input, options);
    console.log("[Diagrammer] Response from LLM:", response);
    return response;
  },
  async callTool(toolName, toolInput) {
    console.log(`[Diagrammer] Calling tool: ${toolName} with input:`, toolInput);
    const toolOutput = await this.tools[toolName].execute(toolInput);
    console.log(`[Diagrammer] Tool ${toolName} responded with:`, toolOutput);
    return toolOutput;
  },
});

