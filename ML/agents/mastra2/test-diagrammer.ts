//mastra2/test-diagrammer.ts
import "dotenv/config";
import { mermaidAgent } from "./agents/diagrammerAgent";

async function main() {
  const resp = await mermaidAgent.generateVNext("Make a simple diagram for a CS dev workflow", {
    maxSteps: 3, // allow tool-call + final LLM turn
    onStepFinish: ({ text, toolCalls, toolResults, finishReason }) => {
      console.log({ text, toolCalls, toolResults, finishReason });
    },
  });

  console.log("FINAL:", resp.text);
}
main();

