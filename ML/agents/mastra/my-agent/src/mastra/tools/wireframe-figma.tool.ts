// filepath: /Users/vrindasubhashc/git/personal/coding/ML/agents/mastra/my-agent/src/mastra/tools/wireframe-figma.tool.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Produces a small Figma-compatible JSON payload representing a wireframe.
 * This is payload-only and does not call the Figma APIs. It's intended
 * for the POC where a Figma payload can be inspected or posted to the
 * real Figma API later by another tool.
 */
export const FigmaWireframeTool = createTool({
  id: "wireframe-figma",
  description:
    "Generate a simple wireframe as a Figma-compatible JSON payload (frames + text).",
  inputSchema: z.object({
    pageTitle: z.string().default("Dashboard"),
    sections: z.array(z.string()).default(["Header", "Sidebar", "Content"]),
  }),
  outputSchema: z.object({ figma: z.any() }),

  execute: async (...anyArgs) => {
    const payload = (anyArgs && anyArgs[0]) || {};
    const data =
      (payload as any).args ?? (payload as any).input ?? (payload as any).inputData ?? payload;

    const pageTitle: string = (data && (data as any).pageTitle) || "Dashboard";
    const sections: string[] =
      (data && (data as any).sections) || ["Header", "Sidebar", "Content"];

    // Canvas/layout constants
    const canvasW = 900;
    const canvasH = 640;
    const margin = 20;

    const nodes: any[] = [];

    // Page frame
    nodes.push(frame("page_frame", margin, margin, canvasW - margin * 2, canvasH - margin * 2, pageTitle));

    // Header
    nodes.push(rect("header", margin + 20, margin + 20, canvasW - 80, 64, "#FFFFFF"));
    nodes.push(text("header_text", margin + 40, margin + 36, pageTitle));

    // Sidebar + content
    const sidebarW = 220;
    const top = margin + 110;
    const boxH = canvasH - top - margin - 40;

    nodes.push(rect("sidebar", margin + 20, top, sidebarW, boxH, "#F5F5F5"));
    nodes.push(text("sidebar_label", margin + 36, top + 20, "Sidebar"));

    nodes.push(rect("content", margin + 40 + sidebarW, top, canvasW - (margin + 40 + sidebarW) - 40, boxH, "#FFFFFF"));
    nodes.push(text("content_label", margin + 60 + sidebarW, top + 20, "Content"));

    // Section bullets
    sections.slice(0, 6).forEach((s, i) => {
      nodes.push(text(`sec_${i}`, margin + 60 + sidebarW, top + 64 + i * 36, `• ${s}`));
    });

    const figma = {
      document: {
        children: [
          {
            id: idFor("canvas"),
            name: pageTitle,
            type: "CANVAS",
            children: nodes,
          },
        ],
      },
      schemaVersion: 0,
      meta: { source: "mastra-poc", generatedAt: new Date().toISOString() },
    };

    return { figma };
  },
});

// Helpers ---------------------------------------------------------------
function idFor(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function frame(id: string, x: number, y: number, w: number, h: number, name: string) {
  return {
    id: idFor(id),
    name,
    type: "FRAME",
    absoluteBoundingBox: { x, y, width: w, height: h },
    children: [],
  };
}

function rect(id: string, x: number, y: number, width: number, height: number, hex: string) {
  return {
    id: idFor(id),
    type: "RECTANGLE",
    absoluteBoundingBox: { x, y, width: width, height: height },
    fills: [
      {
        type: "SOLID",
        color: hexToRgb(hex),
      },
    ],
  };
}

function text(id: string, x: number, y: number, textStr: string) {
  return {
    id: idFor(id),
    type: "TEXT",
    absoluteBoundingBox: { x, y, width: textStr.length * 8 + 20, height: 24 },
    characters: textStr,
    style: { fontSize: 16, fontFamily: "Inter" },
  };
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return { r, g, b };
}
