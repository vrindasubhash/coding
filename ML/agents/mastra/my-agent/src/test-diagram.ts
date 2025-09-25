// src/test-diagram.ts
import "dotenv/config";
import { writeFileSync } from "fs";
import { mastra } from "./mastra";

async function main() {
  console.log("[test-diagram] Starting test-diagram.ts");

  const diagrammer = mastra.getAgent("diagrammer");
  console.log("[test-diagram] Retrieved agent:", {
    name: (diagrammer as any)?.name ?? "<unknown>",
    // show whether the agent object exposes a tools list
    tools: (diagrammer as any)?.tools?.map?.((t: any) => t?.id ?? t?.name) ?? undefined,
  });

  const context =
    "User enters email -> System sends verification code -> If valid -> create account; else -> show error";

  const prompt = `
You are the diagrammer agent.
Task: produce a flowchart for the signup flow below.
${context}

CRITICAL: You MUST call the mermaid-diagram tool. Do not answer in plain text.
Return only the tool output.
`;

  console.log("[test-diagram] Prompt sent to agent:\n", prompt);

  // Legacy path: require *some* tool call (model will choose one of the registered tools)
  const res = await diagrammer.generate(
    [{ role: "user", content: prompt }],
    {
      // IMPORTANT: do not force a specific tool name here (legacy maps names to _0/_1)
      toolChoice: "required",
      temperature: 0,
    }
  );

  // Additional diagnostic logs: dump high-level response fields
  try {
    console.log("[test-diagram] Raw response summary:", {
      text: (res as any)?.text ?? (res as any)?.content ?? undefined,
      tool: (res as any)?.tool ?? undefined,
      result: (res as any)?.result ?? undefined,
      // some providers place choices or messages
      choices: (res as any)?.choices ?? undefined,
      messages: (res as any)?.messages ?? (res as any)?.message ?? undefined,
    });
  } catch (e) {
    console.warn("[test-diagram] Failed to stringify response summary", e);
  }

  // Try to read tool output. Depending on Mastra version, the shape can vary.
  const toolWrapper = (res as any).tool || (res as any).result?.tool;
  let toolId =
    toolWrapper?.id ?? toolWrapper?.name ?? toolWrapper?.toolName ?? "";
  let mermaid =
    toolWrapper?.output?.mermaid ??
    toolWrapper?.result?.output?.mermaid ??
    undefined;

  // Fallback: handle legacy/vNext shapes that use toolResults/toolCalls or steps
  if (!mermaid) {
    // helper to extract first mermaid from common locations
    const extractFromToolResults = (arr: any[]) => {
      if (!Array.isArray(arr)) return undefined;
      for (const item of arr) {
        const r = item?.result ?? item?.content ?? item;
        // some shapes nest under content[0].result
        const maybe = r?.mermaid ?? r?.output?.mermaid ?? ((r && r[0] && r[0].result && r[0].result.mermaid));
        if (maybe) {
          const toolName = item?.toolName ?? (item?.tool ?? item?.toolCallId);
          return { mermaid: maybe, toolName };
        }
      }
      return undefined;
    };

    const directToolResults = (res as any).toolResults || (res as any).tool_results || undefined;
    const fromDirect = extractFromToolResults(directToolResults);

    let found;
    if (fromDirect) found = fromDirect;

    // try steps[].toolResults (generateLegacy may include steps)
    if (!found && Array.isArray((res as any).steps)) {
      for (const step of (res as any).steps) {
        const fr = extractFromToolResults(step.toolResults || step.tool_results || []);
        if (fr) {
          found = fr;
          break;
        }
      }
    }

    // try top-level toolResults inside response object
    if (!found) {
      const flatContents = (res as any).response?.messages?.flatMap?.((m: any) => m?.content ?? []) ?? [];
      const fr2 = extractFromToolResults(flatContents);
      if (fr2) found = fr2;
    }

    if (!found) {
      // try request.toolResults shape seen in some provider responses
      const reqTools = (res as any).request?.tools ?? ((res as any).request?.body && (() => {
        try { return JSON.parse((res as any).request.body).tools; } catch (e) { return undefined; }
      })());
      if (reqTools && reqTools.length) {
        // no mermaid in tools spec; ignore
      }
    }

    if (found) {
      mermaid = found.mermaid;
      toolId = found.toolName || toolId || "";

      // resolve mapped names like _0 -> actual tool id using agent.getTools()
      const m = String(toolId || "");
      if (/^_\d+$/.test(m)) {
        try {
          const toolsMap = await diagrammer.getTools?.() ?? (diagrammer as any).tools;
          const idx = String(Number(m.slice(1)));
          const mapped = toolsMap?.[idx];
          if (mapped) toolId = (mapped as any).id ?? (mapped as any).name ?? toolId;
        } catch (e) {
          // ignore resolution errors
        }
      }
    }
  }

  console.log("[test-diagram] Parsed tool wrapper:", {
    toolWrapper,
    toolId,
    hasMermaid: Boolean(mermaid),
  });

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

