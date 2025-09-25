Mastra UI — quick start

This small UI lets you send prompts to the local Mastra "diagrammer" agent/tools and preview the three artifact types:
- Mermaid (diagram) — rendered to SVG in-browser
- Excalidraw (wireframe) — simplified SVG preview of the scene
- Figma-like payload — a DOM mock preview of the Figma JSON

Prerequisites
- Node 20+ and npm installed
- From the repository: work from the my-agent/ folder
- (Optional but recommended) create a .env file in my-agent/ with your LLM provider key, e.g.:

  OPENAI_API_KEY=sk_...

Install

1. From the my-agent/ folder install node deps:

   npm install

Run the UI server

2. Start the UI server (port defaults to 5173):

   npm run ui

   Alternative (if you prefer):

   npx tsx src/ui-server.ts

3. Open the UI in your browser:

   http://localhost:5173/

Using the UI

- Mode: choose the primary mode (Mermaid, Excalidraw, Figma). The mode controls the default prompt.
- Render all three: check this box to request Mermaid + Excalidraw + Figma in a single run.
- Edit: toggle the prompt textarea to edit the prompt before sending it to the agent.
- Generate: sends the prompt to the diagrammer agent. The UI will display returned payloads and render previews.

Files written

When generation succeeds the server persists artifacts to the my-agent/ repository root (same behavior as the test scripts):
- diagram.mmd            — Mermaid source
- wireframe.excalidraw.json — Excalidraw scene JSON
- wireframe.figma.json  — Figma-compatible JSON payload

Troubleshooting

- Empty results or no previews:
  - Ensure your .env contains your LLM key and the server logs show the agent running.
  - Check the terminal where you started npm run ui for error messages.
- Change the server port by setting UI_PORT when starting the server, e.g.:

  UI_PORT=8080 npm run ui

Development notes

- The Mermaid preview uses the mermaid CDN and renders the mermaid source returned by the tool. If the mermaid source is invalid mermaid will report an error in the preview pane.
- The Excalidraw preview is a minimal SVG renderer sufficient for simple wireframe stubs (rectangles + text). To embed the full Excalidraw editor, integrate the Excalidraw package and mount it in the preview pane.
- The Figma preview is a lightweight DOM mock that positions frame/rectangle/text nodes roughly according to absoluteBoundingBox values in the Figma payload. It's not a replacement for the Figma web UI but useful for quick inspection.

Files of interest

- UI/index.html, UI/app.js, UI/styles.css  — frontend
- src/ui-server.ts                         — tiny static + API server that calls Mastra agents/tools
- src/mastra/...                           — agents and tools used by the UI
- src/test-wireframe.ts, src/test-diagram.ts, src/test-wireframe-figma.ts — example scripts that produce the same artifacts

Next steps (suggestions)

- Render Mermaid to downloadable SVG (server-side) and show direct SVG download link.
- Embed full Excalidraw editor for interactive editing of generated scenes.
- Improve Figma mock with zoom/pan and selectable elements.

If you want, tell me which of the next steps to implement and I will add it.  
