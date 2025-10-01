import "dotenv/config";
import express from 'express';
import path from 'path';
import { mermaidAgent } from './agents/diagrammerAgent';

const app = express();
const PORT = 3000;

// Session storage for conversation context
const conversationSessions = new Map<string, {
  lastDiagramId: string;
  conversationHistory: Array<{ request: string; response: string; timestamp: number }>;
}>();

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Serve the HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web-ui.html'));
});

// API endpoint to generate diagrams
app.post('/api/generate-diagram', async (req, res) => {
    try {
        const { request, sessionId = 'default' } = req.body;
        
        if (!request) {
            return res.status(400).json({ 
                success: false, 
                error: 'Request is required' 
            });
        }

        console.log('Generating diagram for request:', request);
        console.log('Session ID:', sessionId);

        // Get or create session
        let session = conversationSessions.get(sessionId);
        if (!session) {
            session = {
                lastDiagramId: '',
                conversationHistory: []
            };
            conversationSessions.set(sessionId, session);
        }

        // Build context-aware prompt
        let contextualRequest = request;
        if (session.lastDiagramId && (request.toLowerCase().includes('it') || request.toLowerCase().includes('the diagram') || request.toLowerCase().includes('add') || request.toLowerCase().includes('remove') || request.toLowerCase().includes('modify'))) {
            contextualRequest = `CONTEXT: Continue working on the diagram with ID "${session.lastDiagramId}" that we just discussed. User request: ${request}`;
            console.log('Adding context for diagram:', session.lastDiagramId);
        }

        // Use the mermaid agent to generate the diagram
        const response = await mermaidAgent.generateVNext(contextualRequest, {
            maxSteps: 5,
            onStepFinish: ({ text, toolCalls }) => {
                console.log('Step finished with text:', text?.substring(0, 100) + '...');
                if (toolCalls?.length) {
                    toolCalls.forEach((call, index) => {
                        console.log(`Tool ${index + 1} used: ${call.toolName || call.name || 'unknown'}`);
                        console.log(`Tool ${index + 1} args:`, JSON.stringify(call.args || call.arguments, null, 2));
                        
                        // Track the diagram ID being worked on
                        const toolName = call.toolName || call.name;
                        const args = call.args || call.arguments;
                        if ((toolName === 'saveArtifact' || toolName === 'updateArtifact') && args?.id) {
                            session!.lastDiagramId = args.id;
                            console.log('Updated session with diagram ID:', args.id);
                        }
                    });
                } else {
                    console.log('No tool calls in this step');
                }
            },
        });

        console.log('Agent response:', response.text);

        // Update conversation history
        session.conversationHistory.push({
            request: request,
            response: response.text,
            timestamp: Date.now()
        });

        // Keep only last 10 conversations to prevent memory bloat
        if (session.conversationHistory.length > 10) {
            session.conversationHistory = session.conversationHistory.slice(-10);
        }

        // Extract mermaid code from the response
        let mermaidCode = '';
        
        // Try to extract mermaid code from the response text
        const mermaidMatch = response.text.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatch) {
            mermaidCode = mermaidMatch[1];
        } else {
            // If no code block found, look for flowchart or graph patterns in the response
            const lines = response.text.split('\n');
            let foundStart = false;
            const mermaidLines: string[] = [];
            
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('flowchart') || trimmed.startsWith('graph') || trimmed.startsWith('sequenceDiagram') || trimmed.startsWith('classDiagram')) {
                    foundStart = true;
                    mermaidLines.push(trimmed);
                } else if (foundStart && (trimmed.includes('-->') || trimmed.includes('[') || trimmed.includes('|') || trimmed.includes(':'))) {
                    mermaidLines.push(trimmed);
                } else if (foundStart && trimmed === '') {
                    // Empty line might be part of the diagram
                    mermaidLines.push('');
                } else if (foundStart && !trimmed.includes('```') && trimmed.length > 0) {
                    // Stop if we hit non-mermaid content
                    if (!trimmed.match(/^[A-Z]\d*\[|^[A-Z]\d*\(|-->/)) {
                        break;
                    }
                    mermaidLines.push(trimmed);
                }
            }
            
            if (mermaidLines.length > 0) {
                mermaidCode = mermaidLines.join('\n');
            }
        }

        // If we still don't have mermaid code, try to get the latest artifact
        if (!mermaidCode) {
            try {
                const artifactResponse = await mermaidAgent.generateVNext("Get the content of the most recent diagram you just created", {
                    maxSteps: 3
                });
                
                const artifactMatch = artifactResponse.text.match(/```mermaid\n([\s\S]*?)\n```/);
                if (artifactMatch) {
                    mermaidCode = artifactMatch[1];
                }
            } catch (e) {
                console.log('Could not retrieve artifact:', e);
            }
        }

        // Fallback: create a simple diagram if we can't extract one
        if (!mermaidCode) {
            console.log('Creating fallback diagram');
            mermaidCode = `flowchart TD
    A[${request}] --> B[Generated Diagram]
    B --> C[Success]`;
        }

        res.json({
            success: true,
            mermaidCode: mermaidCode.trim(),
            message: response.text
        });

    } catch (error) {
        console.error('Error generating diagram:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate diagram'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Mermaid Diagram Generator running at http://localhost:${PORT}`);
    console.log('Open your browser and start creating diagrams!');
});
