//mastra2/test-hello.ts
import "dotenv/config";
import { helloAgent } from "./agents/helloAgent";

async function main() {
  const resp = await helloAgent.generateVNext("please say hello to Vrinda", {
    maxSteps: 3, // allow tool-call + final LLM turn
    onStepFinish: ({ text, toolCalls, toolResults, finishReason }) => {
      console.log({ text, toolCalls, toolResults, finishReason });
    },
  });

  console.log("FINAL:", resp.text);
}
main();

