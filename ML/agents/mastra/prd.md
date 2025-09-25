Product Requirements Document — Mastra POC for Tool-Calling + Diagram/Wireframe Generation

Purpose
- Build a focused proof-of-concept (POC) that demonstrates Mastra-based orchestration and tool-calling to generate diagrams (Mermaid) and wireframes (Excalidraw / Figma payloads).

Background
- The workspace contains Mastra scaffolding (agents, tools, tests). The POC will reuse and extend mastra/agents and mastra/tools to implement an end-to-end flow: prompt -> orchestration -> diagram + wireframe artifacts.

Goals (measurable)
- Functional: Agent accepts a plain-text prompt and returns a Mermaid diagram (SVG/PNG) and a wireframe JSON (Excalidraw or Figma-compatible payload).
- Integration: Tool-calling flow implemented end-to-end inside Mastra and verified by tests under src/.
- Developer ergonomics: Simple pattern for registering new diagram/wireframe tools.


Success metrics
- End-to-end sample prompt -> diagram SVG + Excalidraw JSON.
- README demo demonstrates the flow in <= 5 minutes.

Scope
- In scope:
  - Implement/complete mermaid-diagram.tool.ts (render mermaid -> SVG/PNG).
  - Implement/complete wireframe-excalidraw.tool.ts (generate Excalidraw JSON) and optional Figma payload builder.
  - Orchestrator agent that sequences parse -> mermaid -> wireframe -> package.
  - Local rendering and test coverage.
- Out of scope:
  - Full production Figma integration and multi-tenant production hardening.

User personas
- Product designer: generate quick wireframe drafts from text prompts.
- Developer/architect: auto-generate simple architecture/flow diagrams from requirements.
- Product manager: preview diagrams and wireframes to validate ideas quickly.

Key features & acceptance criteria
- Prompt-driven orchestration
  - AC: Given a text prompt, the agent returns a response object containing: mermaid source, rendered SVG (or path), and Excalidraw JSON.
- Mermaid tool
  - AC: mermaid-diagram.tool.ts converts mermaid text to SVG/PNG; tests verify expected nodes/text in output.
- Wireframe tool (Excalidraw)
  - AC: wireframe-excalidraw.tool.ts produces valid Excalidraw JSON for a simple screen (header, list, CTA); tests parse and assert expected shapes.
- Orchestration & retries
  - AC: Agent retries a failed tool call once and logs retry events; tests simulate transient failures.
- Observability
  - AC: Each tool call logs input, output size/type, duration; demo shows logs.

Architecture & components
- Mastra orchestrator agent
  - parse intent, construct tool inputs, call tools, assemble response.
- Tools
  - mermaid-diagram.tool.ts: mermaid -> SVG/PNG (use @mermaid-js/mermaid-cli or headless rendering).
  - wireframe-excalidraw.tool.ts: spec -> Excalidraw JSON; optional figma-wireframe.tool.ts to build Figma payload.
- Workflows
  - Sequential: parse -> mermaid -> wireframe -> package response.

Data flows
- Input: user prompt (plain text or structured JSON)
- Steps: parsing -> mermaid tool -> wireframe tool -> compose response (embedded SVG + JSON or file refs)

Implementation plan (high level tasks)
1. Inspect existing mastra/agents and tools to identify gaps
2. Implement mermaid tool using mermaid-cli or the mermaid API; add validation and error handling
3. Implement Excalidraw wireframe generator (templated JSON) and optional Figma payload builder
4. Implement orchestrator agent/workflow that calls the tools, handles retries and logging 
5. Add/extend tests: test-diagram.ts, test-wireframe.ts, test-agent.ts and a demo script 
6. Docs and demo: README, example inputs, sample outputs, short walkthrough

Resources
- Dependencies: Node >=18, npm packages: @mermaid-js/mermaid-cli or equivalent, optional Figma SDK.

Testing & validation
- Integration test for agent orchestration verifying all artifacts are produced and parsable.
- Manual visual checks of produced SVG and Excalidraw JSON.

Deliverables
- prd.md (this document)
- Implemented/updated tools and agent orchestrator in mastra/
- Tests under src/ (passing locally)
- README with setup and demo instructions
- Sample artifacts: diagram.mmd, wireframe.excalidraw.json, produced SVG/JSON outputs

Risks & mitigations
- Mermaid rendering version mismatches: pin mermaid CLI version and include sample diagrams.
- Figma API complexity / rate limits: keep Figma integration optional and start with Excalidraw JSON.
- Ambiguous prompts: restrict POC to a small prompt schema or add simple heuristic parser.

Next steps
- Confirm whether to include real Figma API integration or keep as payload-only POC.
- If confirmed, proceed to inspect repository files and implement the mermaid and excalidraw tools, wire up orchestrator, and add tests.