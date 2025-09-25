// src/mastra/tools/wireframe-excalidraw.tool.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Produces a tiny Excalidraw scene JSON with a few rectangles & text labels.
 * Open at https://excalidraw.com → Menu → Load Scene (upload the JSON file).
 */
export const WireframeTool = createTool({
  id: "wireframe-excalidraw",
  description:
    "Generate a simple lo-fi wireframe as Excalidraw scene JSON (header, sidebar, content).",
  inputSchema: z.object({
    pageTitle: z.string().default("Dashboard"),
    sections: z.array(z.string()).default(["Header", "Sidebar", "Content"]),
  }),
  outputSchema: z.object({ scene: z.any() }),

  // Make execute resilient to different payload shapes
  execute: async (...anyArgs) => {
    const payload = (anyArgs && anyArgs[0]) || {};
    const data =
      (payload as any).args ??
      (payload as any).input ??
      (payload as any).inputData ??
      payload;

    const pageTitle: string = (data && (data as any).pageTitle) || "Dashboard";
    const sections: string[] =
      (data && (data as any).sections) || ["Header", "Sidebar", "Content"];

    // Layout constants
    let x = 100,
      y = 80,
      w = 600,
      h = 60;

    const elements: any[] = [];

    // Header
    elements.push(rect("hdr", x, y, w, h));
    elements.push(text("hdr_title", x + 20, y + 15, pageTitle));

    // Sidebar + Content
    const sidebarW = 180;
    const contentW = w - sidebarW - 20;
    const top = y + h + 20;
    const boxH = 360;

    elements.push(rect("sidebar", x, top, sidebarW, boxH));
    elements.push(text("sidebar_label", x + 20, top + 15, "Sidebar"));

    elements.push(rect("content", x + sidebarW + 20, top, contentW, boxH));
    elements.push(text("content_label", x + sidebarW + 40, top + 15, "Content"));

    sections.slice(0, 3).forEach((s, i) => {
      elements.push(
        text(`sec_${i}`, x + sidebarW + 40, top + 60 + i * 40, `• ${s}`)
      );
    });

    const scene = {
      type: "excalidraw",
      version: 2,
      source: "mastra-poc",
      elements,
      appState: { viewBackgroundColor: "#ffffff" },
    };

    return { scene };
  },
});

// Helpers
function rect(id: string, x: number, y: number, w: number, h: number) {
  return {
    id,
    type: "rectangle",
    x,
    y,
    width: w,
    height: h,
    angle: 0,
    strokeColor: "#000000",
    backgroundColor: "transparent",
    fillStyle: "hachure",
    roughness: 2,
    strokeWidth: 1,
    seed: (Math.random() * 100000) | 0,
  };
}

function text(id: string, x: number, y: number, textStr: string) {
  return {
    id,
    type: "text",
    x,
    y,
    width: textStr.length * 7 + 10,
    height: 24,
    angle: 0,
    text: textStr,
    fontSize: 18,
    fontFamily: 1,
    textAlign: "left",
    verticalAlign: "top",
    strokeColor: "#000000",
    backgroundColor: "transparent",
    fillStyle: "hachure",
    roughness: 2,
    strokeWidth: 1,
    seed: (Math.random() * 100000) | 0,
  };
}

