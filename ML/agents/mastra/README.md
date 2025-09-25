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
4. Run example scripts (after build or using ts-node):
   node dist/path/to/test-agent.js
   or
   npx ts-node src/test-agent.ts

Notes

- See memorybank.md for architecture, extension guidelines, and development notes.
- Tests/examples are small executable scripts in my-agent/src/ to demonstrate usage of agents and tools.

Next steps

- Add tests for any new agent or tool.
- Register new agents in my-agent/src/mastra/index.ts so they are discoverable by workflows and examples.

