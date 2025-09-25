Memory Bank — Architecture and Components

Project overview

This repository implements "mastra": a small modular agent framework and example agents and tools built in TypeScript. The code is organized under my-agent/src/mastra and demonstrates a pattern for composing agent implementations, tools, and workflows with tests.

High-level architecture

- Core entry: my-agent/src/mastra/index.ts
  - Exposes the framework primitives and wiring to load agents, tools and workflows.
- Agents: my-agent/src/mastra/agents
  - Agent implementations encapsulate domain logic and coordinate tools/workflows.
  - Examples: diagrammer.ts, recruiter.ts, weather-agent.ts
- Tools: my-agent/src/mastra/tools
  - Lightweight, focused utilities that agents call to perform specific tasks (rendering, fetching, I/O).
  - Examples: mermaid-diagram.tool.ts, weather-tool.ts, wireframe-excalidraw.tool.ts
  - New: wireframe-figma.tool.ts — produces a Figma-compatible JSON payload (payload-only; does not call Figma API).
- Workflows: my-agent/src/mastra/workflows
  - Higher-level orchestrations that compose multiple tools and agents for a use case.
  - Example: weather-workflow.ts
- Tests and examples: my-agent/src/*.ts (test-agent.ts, test-diagram.ts, test-wireframe.ts)
  - Small scripts and tests that demonstrate how agents and tools should be used.
- Metadata and config
  - package.json, tsconfig.json — project build and dependency configuration
  - mastra.db, mastra.txt — persisted example data and notes

Data and control flow

1. An agent receives input (from a test/example, a workflow, or external caller).
2. The agent decides which tools or workflows are required and calls them via clear interfaces.
3. Tools perform concrete operations (e.g., fetch weather, generate mermaid, produce Excalidraw wireframe) and return structured results.
4. Agents aggregate tool responses, apply domain logic, and return final output.
5. Workflows may orchestrate multiple agents/tools to achieve a larger task.

Component responsibilities

- index.ts (framework entry)
  - Initialize environment and dependency injection (if used).
  - Register available agents, tools and workflows for discovery.
- Agents
  - Provide a single responsibility domain-oriented behavior.
  - Should be small and testable — accept inputs and return deterministic outputs where possible.
- Tools
  - Side-effectful operations should be isolated to tools so agents remain easy to mock in tests.
- Workflows
  - Compose agents and tools to implement user-facing flows. Keep them declarative and orchestrating only.
- Tests
  - Use the small scripts in src/ to validate behavior and provide runnable examples.
Tests
- Use the small scripts in src/ to validate behavior and provide runnable examples.
- There are now separate wireframe tests:
  - src/test-wireframe.ts           — generates Excalidraw JSON (wireframe.excalidraw.json)
  - src/test-wireframe-figma.ts     — generates a Figma payload JSON (wireframe.figma.json)

How to extend

- Adding a new agent:
  1. Create a new file in my-agent/src/mastra/agents (e.g., my-agent/src/mastra/agents/my-agent.ts).
  2. Implement an exported class or function that follows existing agent patterns (accept inputs, call tools via their interfaces, return structured output).
  3. Register the agent in my-agent/src/mastra/index.ts so it can be discovered by tests and workflows.
  4. Add unit tests or a small script under my-agent/src/ to exercise the agent.

- Adding a new tool:
  1. Create a file in my-agent/src/mastra/tools and export a clean interface or factory.
  2. Keep side effects in the tool and expose a deterministic function for easier testing.
  3. Inject or import the tool into agents/workflows that require it.

- Adding a new workflow:
  1. Create a file in my-agent/src/mastra/workflows.
  2. Compose existing agents/tools and expose a simple entry method that can be called by tests or an external orchestrator.

Development notes

- Install dependencies
  - npm install (run from my-agent/ if package.json is located there)
- Build / typecheck
  - tsc --project tsconfig.json (adjust path if tsconfig is in my-agent/)
- Run example/test scripts
  - node dist/path/to/test-agent.js or run via ts-node in development

Quick demo (from my-agent/):
  - npx tsx src/test-wireframe.ts        # writes wireframe.excalidraw.json
  - npx tsx src/test-wireframe-figma.ts  # writes wireframe.figma.json

Best practices and conventions

- Keep agents small and focused.
- Encapsulate any network or filesystem access in tools to ease testing.
- Favor composition over inheritance for workflows and agent composition.
- Document new agents/tools in memorybank.md and add corresponding tests.

Files of interest

- Root
  - mastra.db — example/working database file
  - mastra.txt — notes and prompts
  - prd.md, note.txt — project docs and notes
- my-agent/
  - package.json, tsconfig.json — project config
  - src/
    - mastra/index.ts
    - mastra/agents/*
    - mastra/tools/*
    - mastra/workflows/*
    - test-*.ts — example scripts and tests

Contact and next steps

- To onboard more features, identify missing tool integrations and add small focused tests that exercise the feature surface. Keep this memorybank.md updated as new components and responsibilities are added.

