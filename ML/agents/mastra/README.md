mastra — Modular Agent Framework (minimal)

Overview

A small TypeScript example of a modular agent framework. The repository demonstrates agents, tools, and workflows organized under my-agent/src/mastra with small test scripts under my-agent/src/.

Files added/updated

- memorybank.md — A concise architecture and component description (created at project root).

Quick start

1. Change to the my-agent folder:
   cd my-agent
2. Install dependencies:
   npm install
3. Build / typecheck (if TypeScript is used):
   npx tsc --project tsconfig.json
4. Run example scripts (after build or using tsx):
   node dist/path/to/test-agent.js
   or
   npx tsx src/test-agent.ts

New: Wireframe outputs

- The project now includes two wireframe tools and tests:
  - Excalidraw wireframe: src/mastra/tools/wireframe-excalidraw.tool.ts (test: src/test-wireframe.ts)
  - Figma payload wireframe: src/mastra/tools/wireframe-figma.tool.ts (test: src/test-wireframe-figma.ts)

Quick run (from my-agent/):
  - npx tsx src/test-wireframe.ts        # writes wireframe.excalidraw.json
  - npx tsx src/test-wireframe-figma.ts  # writes wireframe.figma.json

Notes

- See memorybank.md for architecture, extension guidelines, and development notes.
- Tests/examples are small executable scripts in my-agent/src/ to demonstrate usage of agents and tools.

Next steps

- Add tests for any new agent or tool.
- Register new agents in my-agent/src/mastra/index.ts so they are discoverable by workflows and examples.
- If you want a single demo that runs both wireframe generators and packages outputs, I can add a short script to do that.

