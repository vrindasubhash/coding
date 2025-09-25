// src/mastra/agents/diagrammer.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { MermaidDiagramTool } from "../tools/mermaid-diagram.tool";
import { WireframeTool } from "../tools/wireframe-excalidraw.tool";
import { FigmaWireframeTool } from "../tools/wireframe-figma.tool";

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
});

