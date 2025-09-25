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
    const data =
      (payload as any).args ??
      (payload as any).input ??
      (payload as any).inputData ??
      payload;

    const kind: "flowchart" | "sequence" | "er" | "user-journey" =
      (data && (data as any).kind) || "flowchart";
    const context: string = String((data && (data as any).context) || "");

    let mermaid = "";

    if (kind === "flowchart") {
      mermaid = [
        "flowchart TD",
        "A[Start] --> B{Decide}",
        "B -->|Yes| C[Do thing]",
        "B -->|No| D[Other path]",
        "C --> E[End]",
        "D --> E[End]",
      ].join("\n");
    } else if (kind === "sequence") {
      mermaid = [
        "sequenceDiagram",
        "participant U as User",
        "participant S as System",
        "U->>S: Request",
        "S-->>U: Response",
      ].join("\n");
    } else if (kind === "er") {
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

    return {
      mermaid,
      notes: `Auto-generated stub for kind="${kind}". Context (truncated): ${context.slice(
        0,
        200
      )}...`,
    };
  },
});

