// src/mastra/tools/mermaid-diagram.tool.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const MermaidDiagramTool = createTool({
  id: "mermaid-diagram",
  description:
    "Generate Mermaid diagram code for flowcharts, sequence, ERD, user-journey, etc.",
  inputSchema: z.object({
    kind: z
      .enum(["flowchart", "sequence", "er", "user-journey"])
      .default("flowchart"),
    context: z
      .string()
      .describe("Plain English description of the system/process"),
  }),
  outputSchema: z.object({
    mermaid: z.string(),
    notes: z.string().optional(),
  }),

  // Make execute resilient to different payload shapes
  execute: async (...anyArgs) => {
    const payload = (anyArgs && anyArgs[0]) || {};
    const runId = (payload as any)?.runId || "unknown-run";
    console.log(`[MermaidDiagramTool][${runId}] Received payload with context:`, {
      kind: (payload as any)?.args?.kind || (payload as any)?.input?.kind || (payload as any)?.inputData?.kind || "flowchart",
      context: ((payload as any)?.args?.context || (payload as any)?.input?.context || (payload as any)?.inputData?.context || "").slice(0, 100)
    });

    const data =
      (payload as any).args ??
      (payload as any).input ??
      (payload as any).inputData ??
      payload;

    const kind: "flowchart" | "sequence" | "er" | "user-journey" =
      (data && (data as any).kind) || "flowchart";
    const context: string =
      typeof data.context === "string"
        ? data.context
        : typeof data.context === "object" && data.context !== null
        ? typeof data.context.context === "string"
          ? data.context.context
          : JSON.stringify(data.context)
        : "";

    console.log(`[MermaidDiagramTool][${runId}] Processing request for kind:`, kind);

    let mermaid = "";

    if (kind === "flowchart") {
      // Dynamically generate flowchart based on context
      const steps = context.split("->").map((step) => step.trim());
      const mermaidLines = ["flowchart TD"];
      for (let i = 0; i < steps.length - 1; i++) {
        mermaidLines.push(`step${i}[${steps[i]}] --> step${i + 1}[${steps[i + 1]}]`);
      }
      mermaid = mermaidLines.join("\n");
    } else if (kind === "sequence") {
      // Example: Add dynamic sequence diagram generation logic here
      mermaid = [
        "sequenceDiagram",
        "participant U as User",
        "participant S as System",
        "U->>S: Request",
        "S-->>U: Response",
      ].join("\n");
    } else if (kind === "er") {
      // Example: Add dynamic ER diagram generation logic here
      mermaid = [
        "erDiagram",
        "USER ||--o{ ORDER : places",
        "ORDER ||--|{ LINE_ITEM : contains",
        "USER {",
        "  int id",
        "  string email",
        "}",
        "ORDER {",
        "  int id",
        "  date created_at",
        "}",
      ].join("\n");
    } else {
      // Example: Add dynamic user journey generation logic here
      mermaid = [
        "journey",
        "title Sample user journey",
        "section Discover",
        "User searches: 3: User",
        "Finds landing: 2: User",
        "section Try",
        "Starts trial: 4: User",
        "section Adopt",
        "Invites team: 3: User",
      ].join("\n");
    }

    console.log("[MermaidDiagramTool] Generated mermaid diagram:", mermaid);

    return {
      mermaid,
      notes: `Auto-generated stub for kind="${kind}". Context (truncated): ${context.slice(
        0,
        200
      )}...`,
    };
  },
});

