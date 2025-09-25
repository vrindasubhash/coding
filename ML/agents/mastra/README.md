Overview

A small TypeScript example of a modular agent framework. The repository demonstrates agents, tools, and workflows organized under my-agent/src/mastra with small test scripts under my-agent/src/.

This will create either a mermaid, excalidraw, or figma diagram/wireframe based on user english description.

Quick start:

0. Obtain an API key from OpenAI:
   Create a .env file in the my-agent folder with OPENAI_API_KEY=xxxxxxxx
1. Change to the my-agent folder:
   cd my-agent
2. Install dependencies:
   npm install
3. Build / typecheck:
   npx tsc --project tsconfig.json
4. Run example scripts:
   npx tsx src/test-agent.ts


Quick run (from my-agent/):
  - npx tsx src/test-wireframe.ts        # writes wireframe.excalidraw.json
  - npx tsx src/test-wireframe-figma.ts  # writes wireframe.figma.json
  - npx tsx src/test-diagram.ts          # writes diagram.mmd

Notes:

- See memorybank.md for architecture, extension guidelines, and development notes.
- There is a UI folder to see this in action. See README.md in UI folder.
