
// src/test-diagram.ts
import "dotenv/config";
import { writeFileSync } from "fs";
import { mastra } from "./mastra";

async function main() {
  const diagrammer = mastra.getAgent("diagrammer");

  const context =
    "User enters email -> System sends verification code -> If valid -> create account; else -> show error";

  const prompt = `
You are the diagrammer agent.
Task: produce a flowchart for the signup flow below.
${context}

CRITICAL: You MUST call the mermaid-diagram tool. Do not answer in plain text.
Return only the tool output.
`;

  // Legacy path: require *some* tool call (model will choose one of the registered tools)
  const res = await diagrammer.generate(
    [{ role: "user", content: prompt }],
    {
      // IMPORTANT: do not force a specific tool name here (legacy maps names to _0/_1)
      toolChoice: "required",
      temperature: 0,
    }
  );

  // Try to read tool output. Depending on Mastra version, the shape can vary.
  const toolWrapper = (res as any).tool || (res as any).result?.tool;
  const toolId =
    toolWrapper?.id || toolWrapper?.name || toolWrapper?.toolName || "";
  const mermaid =
    toolWrapper?.output?.mermaid ??
    toolWrapper?.result?.output?.mermaid ??
    undefined;

  if (!mermaid) {
    console.error("[agent] No tool output. Full result:", JSON.stringify(res, null, 2));
    throw new Error("Agent responded without a tool payload even though toolChoice='required'.");
  }
  if (!/mermaid-diagram/i.test(toolId)) {
    // Optional guard: ensure it used the mermaid tool (not the wireframe tool)
    console.error("[agent] Wrong tool used:", toolId);
    throw new Error("Agent called the wrong tool; expected mermaid-diagram.");
  }

  writeFileSync("diagram.mmd", String(mermaid));
  console.log("Mermaid diagram saved to diagram.mmd");
  console.log("\n---\n" + mermaid);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

