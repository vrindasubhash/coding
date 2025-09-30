//test-different-prompts.ts
import "dotenv/config";
import { helloAgent } from "./agents/helloAgent";

async function testPrompt(prompt: string) {
  console.log(`\n=== Testing prompt: "${prompt}" ===`);
  
  const resp = await helloAgent.generateVNext(prompt, {
    maxSteps: 3,
    onStepFinish: ({ text, toolCalls, toolResults, finishReason }) => {
      console.log("Step:", { text, toolCalls: toolCalls?.length || 0, finishReason });
    },
  });

  console.log("FINAL:", resp.text);
}

async function main() {
  // This should trigger the tool
  await testPrompt("please say hello to Vrinda");
  
  // This might NOT trigger the tool
  await testPrompt("What's the weather like today?");
  
  // This should trigger the tool
  await testPrompt("Can you greet me?");
  
  // This might NOT trigger the tool
  await testPrompt("Tell me a joke");
}

main().catch(console.error);
