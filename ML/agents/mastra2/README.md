# 🎨 Mermaid Diagram Generator Web UI

A simple web interface for generating Mermaid diagrams using AI agents. Input natural language requests and get beautiful, rendered diagrams instantly!

![Mermaid Diagram Generator](https://img.shields.io/badge/Mermaid-Diagram%20Generator-ff6b6b?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

## ✨ Features

- 🤖 **AI-Powered Diagram Generation** - Powered by OpenAI GPT-4o-mini
- 🎨 **Visual Rendering** - Diagrams rendered as actual graphics using Mermaid.js
- 💾 **Persistent Storage** - All diagrams saved as artifacts with context
- 🔄 **Interactive Updates** - Edit and modify existing diagrams
- 🌐 **Simple Web UI** - Clean, modern interface requiring no technical knowledge

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- OpenAI API Key

### 1. Clone and Install

```bash
# Navigate to the project directory
cd /path/to/mastra2

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start the Server

```bash
npm start
```

You should see:
```
🚀 Mermaid Diagram Generator running at http://localhost:3000
Open your browser and start creating diagrams!
```

### 4. Open the Web UI

Open your browser and navigate to: **http://localhost:3000**

## 🎯 How to Use

1. **Enter Your Request**: Type what diagram you want in natural language
   ```
   Examples:
   - "Create a flowchart for user login process"
   - "Design a system architecture for an e-commerce app"
   - "Make a sequence diagram for API authentication"
   - "Show the workflow for CI/CD pipeline"
   ```

2. **Generate**: Click the "Generate Diagram" button

3. **View Result**: Watch as your diagram is rendered visually on the page

4. **Iterate**: Make new requests to create more diagrams

## 📖 Example Requests

### Flowcharts
```
Create a user registration flowchart with email verification
```

### System Architecture
```
Design a microservices architecture with API gateway, auth service, and database
```

### Process Diagrams
```
Show the software development lifecycle from planning to deployment
```

### Sequence Diagrams
```
Create a sequence diagram for user authentication with JWT tokens
```

## 🔧 Technical Details

### Architecture

- **Frontend**: Simple HTML/CSS/JavaScript with Mermaid.js rendering
- **Backend**: Express.js server with TypeScript
- **AI Agent**: Mastra framework with OpenAI GPT-4o-mini
- **Storage**: File-based artifact system

### Project Structure

```
mastra2/
├── web-ui.html              # Frontend interface
├── server.ts               # Express.js backend server
├── agents/
│   └── diagrammerAgent.ts   # AI agent for diagram generation
├── tools/
│   └── artifacts.ts         # Diagram storage and management
├── artifacts/               # Generated diagrams and context
└── package.json            # Dependencies and scripts
```

### API Endpoint

The web UI communicates with a single API endpoint:

```
POST /api/generate-diagram
Content-Type: application/json

{
  "request": "Your diagram request in natural language"
}
```

Response:
```json
{
  "success": true,
  "mermaidCode": "flowchart TD\n    A[Start] --> B[End]",
  "message": "Diagram generated successfully!"
}
```

## 🛠️ Development

### Running in Development Mode

```bash
npm run dev
```

### Testing the Agent Directly

You can test the diagram generation agent directly:

```bash
# Test basic diagram generation
npx tsx test-diagrammer.ts

# Test artifact management
npx tsx test-artifacts.ts
```

### Available Scripts

- `npm start` - Start the web server
- `npm run dev` - Start in development mode
- `npx tsx test-*.ts` - Run individual test files

## 📁 Artifacts System

All generated diagrams are automatically saved in the `artifacts/` directory:

- `*.mermaid` files contain the diagram code
- `*.context.txt` files contain metadata and conversation history

Example artifact structure:
```
artifacts/
├── user-login-flowchart.mermaid
├── user-login-flowchart.context.txt
├── system-architecture-001.mermaid
└── system-architecture-001.context.txt
```

## 🎨 Supported Diagram Types

The AI agent can generate various Mermaid diagram types:

- **Flowcharts** (`flowchart TD`)
- **Graph Diagrams** (`graph LR`)
- **Sequence Diagrams** (`sequenceDiagram`)
- **Class Diagrams** (`classDiagram`)
- **State Diagrams** (`stateDiagram`)
- **Gantt Charts** (`gantt`)
- **Git Graphs** (`gitgraph`)

## 🔍 Troubleshooting

### Server Won't Start
- Check that port 3000 is available
- Ensure your OpenAI API key is set in `.env`
- Run `npm install` to ensure dependencies are installed

### Diagrams Not Rendering
- Check the browser console for JavaScript errors
- Ensure the Mermaid.js CDN is accessible
- Verify the generated Mermaid code is valid

### Agent Not Responding
- Check your OpenAI API key is valid and has credits
- Look at server logs for error messages
- Try simpler diagram requests first

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙋‍♂️ Support

If you encounter issues:

1. Check the troubleshooting section above
2. Look at the server logs in your terminal
3. Try different diagram requests
4. Ensure your OpenAI API key is working

---

**Happy Diagramming! 🎨✨**
