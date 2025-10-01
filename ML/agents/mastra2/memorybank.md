# Mastra2 Project - Memory Bank

## Purpose
Mastra2 is an AI agent system built on the Mastra framework for **Mermaid Diagram Generation & Management**. It provides an intelligent diagram creation system with persistent artifact storage, making it ideal for creating and maintaining visual documentation like flowcharts, system architectures, and process diagrams.

The project demonstrates how to build structured AI agents with persistent memory capabilities, allowing users to create, update, and manage diagrams over time with full context preservation.

## How It Works

### Core Architecture
The system is built using the **Mastra framework** (@mastra/core) with OpenAI's GPT-4o-mini model. It follows a modular agent-based architecture where:

- **Agent** is a specialized AI assistant with diagram creation expertise and memory capabilities
- **Tools** are reusable functions that the agent can call to perform diagram operations
- **Artifacts** are persistent files (diagrams + context) stored in the file system with full versioning

### Key Components

#### 1. Mermaid Agent System
- **Mermaid Agent** (`mermaidAgent.ts`) - Intelligent diagram creation and management specialist with context awareness

#### 2. Artifact Management Tools
- **Complete CRUD operations** for diagram management:
  - `saveArtifact` - Create new diagrams with context
  - `getArtifact` - Retrieve diagram content
  - `updateArtifact` - Modify existing diagrams
  - `getArtifactContext` - Access diagram metadata
  - `listArtifacts` - Browse all saved diagrams

#### 3. Artifact Management
- Diagrams saved as `.mermaid` files
- Context/metadata saved as `.context.txt` files
- Automatic directory creation and file management
- Version tracking through context updates

## Project Structure

```
mastra2/
├── index.ts                    # Main entry point - registers mermaid agent
├── package.json               # Dependencies (Mastra, OpenAI, Zod)
├── 
├── agents/
│   └── diagrammerAgent.ts     # Mermaid diagram specialist agent
├── 
├── tools/
│   └── artifacts.ts          # Complete diagram management toolkit
├── 
├── artifacts/                # Persistent storage for generated diagrams
│   ├── *.mermaid            # Diagram content files
│   └── *.context.txt        # Metadata and conversation context
├── 
└── test-*.ts                # Test files demonstrating usage
    ├── test-diagrammer.ts   # Diagram creation examples
    ├── test-artifacts.ts    # Artifact management examples
    └── test-different-prompts.ts # Various prompt testing scenarios
```

## Key Features

### Intelligent Diagram Creation
- Automatically generates unique IDs for new diagrams
- Saves both diagram content and conversation context
- Supports iterative editing and updates
- Provides discovery through listing functionality

### Persistent Memory
- All diagrams and their contexts are saved to disk
- Agents can reference previous work
- Context tracking maintains conversation history
- Update history preserved through versioned context files

## Technologies Used

- **Mastra Framework** (@mastra/core v0.18.0) - Agent orchestration and tool management
- **OpenAI SDK** (@ai-sdk/openai v2.0.42) - GPT-4o-mini integration
- **Zod** (v3.25.76) - Schema validation for tool inputs/outputs
- **TypeScript** - Type-safe development
- **Node.js File System** - Artifact persistence
- **Mermaid** - Diagram markup language

## Use Cases

1. **Technical Documentation** - Generate system architecture diagrams, flowcharts, and process maps
2. **Project Planning** - Create workflow diagrams and process documentation
3. **Learning Tool** - Understand AI agent patterns and tool integration
4. **Prototype Base** - Foundation for building more complex agent systems

## How to Use

The system can be extended by:
1. Adding new agents with specialized instructions
2. Creating custom tools for specific domains
3. Implementing different LLM models or providers
4. Adding new artifact types beyond Mermaid diagrams

This project serves as both a functional diagram generation system and a learning example for building structured AI agent applications with persistent storage capabilities.
