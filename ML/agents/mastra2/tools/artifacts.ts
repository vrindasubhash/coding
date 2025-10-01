import { z } from "zod";
import { createTool } from "@mastra/core/tools";
import * as fs from "fs";
import * as path from "path";

const artifactsDir = path.join(process.cwd(), "artifacts");

// Ensure artifacts directory exists
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

export const saveArtifact = createTool({
  id: "saveArtifact",
  description: "Save a mermaid diagram artifact with its context",
  inputSchema: z.object({
    id: z.string().describe("Unique identifier for the artifact"),
    content: z.string().describe("The mermaid diagram content"),
    context: z.string().describe("The conversation context that created this artifact"),
    userPrompt: z.string().optional().describe("The original user question/request that prompted this diagram")
  }),
  outputSchema: z.object({ message: z.string() }),
  execute: async ({ context: inputData }) => {
    const { id, content, context, userPrompt } = inputData;
    const artifactPath = path.join(artifactsDir, `${id}.mermaid`);
    const contextPath = path.join(artifactsDir, `${id}.context.txt`);
    
    // Create a more detailed context file with both user prompt and description
    let fullContext = context;
    if (userPrompt) {
      fullContext = `USER REQUEST:\n${userPrompt}\n\nDESCRIPTION:\n${context}`;
    }
    
    fs.writeFileSync(artifactPath, content);
    fs.writeFileSync(contextPath, fullContext);
    
    return { message: `Artifact saved: ${id}` };
  }
});

export const getArtifactContext = createTool({
  id: "getArtifactContext",
  description: "Get the context for an existing artifact",
  inputSchema: z.object({
    id: z.string().describe("The artifact ID to get context for")
  }),
  outputSchema: z.object({ context: z.string() }),
  execute: async ({ context: { id } }) => {
    const contextPath = path.join(artifactsDir, `${id}.context.txt`);
    
    if (!fs.existsSync(contextPath)) {
      return { context: `No context found for artifact: ${id}` };
    }
    
    return { context: fs.readFileSync(contextPath, "utf-8") };
  }
});

export const updateArtifact = createTool({
  id: "updateArtifact",
  description: "Update an existing artifact and append to its context",
  inputSchema: z.object({
    id: z.string().describe("The artifact ID to update"),
    content: z.string().describe("The updated mermaid diagram content"),
    newContext: z.string().describe("Additional context about this update"),
    userPrompt: z.string().optional().describe("The original user request that prompted this update")
  }),
  outputSchema: z.object({ message: z.string() }),
  execute: async ({ context: inputData }) => {
    const { id, content, newContext, userPrompt } = inputData;
    const artifactPath = path.join(artifactsDir, `${id}.mermaid`);
    const contextPath = path.join(artifactsDir, `${id}.context.txt`);
    
    fs.writeFileSync(artifactPath, content);
    
    // Format the update context with user prompt if provided
    let updateText = newContext;
    if (userPrompt) {
      updateText = `USER REQUEST: ${userPrompt}\nUPDATE: ${newContext}`;
    }
    
    if (fs.existsSync(contextPath)) {
      const existingContext = fs.readFileSync(contextPath, "utf-8");
      fs.writeFileSync(contextPath, `${existingContext}\n\n--- UPDATE ---\n${updateText}`);
    } else {
      fs.writeFileSync(contextPath, updateText);
    }
    
    return { message: `Artifact updated: ${id}` };
  }
});

export const listArtifacts = createTool({
  id: "listArtifacts",
  description: "List all available artifacts with their IDs and a preview of their content",
  inputSchema: z.object({}),
  outputSchema: z.object({ artifacts: z.string() }),
  execute: async () => {
    if (!fs.existsSync(artifactsDir)) {
      return { artifacts: "No artifacts found." };
    }
    
    const files = fs.readdirSync(artifactsDir);
    const mermaidFiles = files.filter(f => f.endsWith('.mermaid'));
    
    if (mermaidFiles.length === 0) {
      return { artifacts: "No artifacts found." };
    }
    
    const artifacts = mermaidFiles.map(file => {
      const id = file.replace('.mermaid', '');
      const content = fs.readFileSync(path.join(artifactsDir, file), 'utf-8');
      const preview = content.split('\n').slice(0, 3).join('\n') + (content.split('\n').length > 3 ? '...' : '');
      return `${id}: ${preview}`;
    });
    
    return { artifacts: `Available artifacts:\n${artifacts.join('\n\n')}` };
  }
});

export const getArtifact = createTool({
  id: "getArtifact",
  description: "Get the full content of a specific artifact",
  inputSchema: z.object({
    id: z.string().describe("The artifact ID to retrieve")
  }),
  outputSchema: z.object({ content: z.string() }),
  execute: async ({ context: { id } }) => {
    const artifactPath = path.join(artifactsDir, `${id}.mermaid`);
    
    if (!fs.existsSync(artifactPath)) {
      return { content: `No artifact found with ID: ${id}` };
    }
    
    return { content: fs.readFileSync(artifactPath, "utf-8") };
  }
});
