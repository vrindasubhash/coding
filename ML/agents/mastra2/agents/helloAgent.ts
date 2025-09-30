// mastra2/agents/helloAgent.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { hello } from "../tools/hello";

export const helloAgent = new Agent({
  name: "hello-agent",
  instructions:
    "You are a helpful assistant. When the user asks to say hello, " +
    "call the `hello` tool with a reasonable name and reply with its message.",
  model: openai("gpt-4o-mini"), // any tool-capable model via Vercel AI SDK
  tools: { hello },             // <-- expose tool to the agent/LLM
});

