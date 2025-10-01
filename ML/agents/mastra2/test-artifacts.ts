//mastra2/test-artifacts.ts
import "dotenv/config";
import { mermaidAgent } from "./agents/diagrammerAgent";

async function testArtifactManagement() {
  console.log("=== Testing Artifact Management ===\n");

  // Test 1: Create a new diagram artifact
  console.log("1. Creating a new flowchart diagram...");
  const resp1 = await mermaidAgent.generateVNext(
    "Create a flowchart showing the user registration process with steps: Start -> Enter Details -> Validate -> Save -> End",
    {
      maxSteps: 5,
      onStepFinish: ({ text, toolCalls, toolResults }) => {
        if (toolCalls?.length) {
          console.log("Tool used:", toolCalls[0].toolName);
        }
      },
    }
  );
  console.log("Response:", resp1.text);
  console.log("\n---\n");

  // Test 2: Create another diagram
  console.log("2. Creating a system architecture diagram...");
  const resp2 = await mermaidAgent.generateVNext(
    "Create a system architecture diagram showing: Frontend -> API Gateway -> Backend Services -> Database",
    {
      maxSteps: 5,
      onStepFinish: ({ text, toolCalls }) => {
        if (toolCalls?.length) {
          console.log("Tool used:", toolCalls[0].toolName);
        }
      },
    }
  );
  console.log("Response:", resp2.text);
  console.log("\n---\n");

  // Test 3: List all artifacts
  console.log("3. Listing all available artifacts...");
  const resp3 = await mermaidAgent.generateVNext("Show me all my saved diagrams", {
    maxSteps: 3,
    onStepFinish: ({ text, toolCalls }) => {
      if (toolCalls?.length) {
        console.log("Tool used:", toolCalls[0].toolName);
      }
    },
  });
  console.log("Response:", resp3.text);
  console.log("\n---\n");

  // Test 4: Edit an existing diagram (user will need to specify ID from list above)
  console.log("4. Editing an existing diagram...");
  const resp4 = await mermaidAgent.generateVNext(
    "I want to edit my flowchart diagram to add an email verification step between Validate and Save",
    {
      maxSteps: 8,
      onStepFinish: ({ text, toolCalls, toolResults }) => {
        if (toolCalls?.length) {
          console.log("Tool used:", toolCalls[0].toolName || toolCalls[0].type || "unknown");
          if (toolResults?.length && toolResults[0].result) {
            try {
              const result = typeof toolResults[0].result === 'string' 
                ? toolResults[0].result 
                : JSON.stringify(toolResults[0].result);
              console.log("Tool result preview:", result.substring(0, 100) + "...");
            } catch (e) {
              console.log("Tool result: [object]");
            }
          }
        }
      },
    }
  );
  console.log("Response:", resp4.text);
  console.log("\n---\n");

  // Test 5: Get context for a specific artifact
  console.log("5. Getting context for the first artifact...");
  const resp5 = await mermaidAgent.generateVNext(
    "Show me the context and history for my first diagram",
    {
      maxSteps: 5,
      onStepFinish: ({ text, toolCalls }) => {
        if (toolCalls?.length) {
          console.log("Tool used:", toolCalls[0].toolName);
        }
      },
    }
  );
  console.log("Response:", resp5.text);
}

testArtifactManagement().catch(console.error);
