import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const recruiter = new Agent({
  name: "recruiter",
  instructions:
    "You are a friendly recruiter. Be concise; ask one clarifying question if needed.",
  model: openai("gpt-4o-mini"),
});

