import 'dotenv/config';
import { createServer } from 'http';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { extname } from 'path';
import { mastra } from './mastra';
import { MermaidDiagramTool } from './mastra/tools/mermaid-diagram.tool';
import { WireframeTool } from './mastra/tools/wireframe-excalidraw.tool';
import { FigmaWireframeTool } from './mastra/tools/wireframe-figma.tool';

// Normalize path; replace backslashes on Windows
const UI_DIR = new URL('../UI', import.meta.url).pathname.replace(/\\/g, '/');
const PORT = process.env.UI_PORT ? Number(process.env.UI_PORT) : 5173;

// Accept string or Buffer body so static files (Buffer) can be sent
function send(res: any, status: number, body: any, type = 'text/html') {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

async function handleApiGenerate(req: any, res: any) {
  try {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const json = raw ? JSON.parse(raw) : {};
    const mode = json.mode || 'mermaid';
    const prompt = json.prompt || '';

    // Helper to clean up common wrappers around mermaid outputs
    function sanitizeMermaidSource(src: string | undefined) {
      if (!src) return src;
      let s = String(src).trim();
      const fenceRegex = /```(?:mermaid)?\s*([\s\S]*?)\s*```/i;
      const m = s.match(fenceRegex);
      if (m && m[1]) return m[1].trim();
      s = s.replace(/^\s*mermaid\s*\n/i, '').trim();
      return s;
    }

    const agent = mastra.getAgent('diagrammer');

    // Send prompt to agent and prefer tool output
    let agentRes: any = undefined;
    try {
      agentRes = await agent.generate([{ role: 'user', content: prompt }], { toolChoice: 'required', temperature: 0 });
    } catch (e) {
      // ignore - fallback to direct tool calls below
      console.warn('agent.generate failed, falling back to direct tool', e);
    }

    let mermaid: string | undefined = undefined;
    let scene: any = undefined;
    let figma: any = undefined;

    // Try to extract common tool outputs
    if (agentRes) {
      // Start with the most common shapes
      const toolWrapper = (agentRes as any).tool || (agentRes as any).result?.tool || (agentRes as any).toolResults?.[0] || undefined;
      let toolId = toolWrapper?.id ?? toolWrapper?.name ?? toolWrapper?.toolName ?? '';
      mermaid = toolWrapper?.output?.mermaid ?? toolWrapper?.result?.output?.mermaid ?? undefined;
      scene = toolWrapper?.output?.scene ?? toolWrapper?.result?.output?.scene ?? undefined;
      figma = toolWrapper?.output?.figma ?? toolWrapper?.result?.output?.figma ?? undefined;

      // Fallback: handle legacy/vNext shapes that use toolResults/toolCalls or steps
      if (!mermaid) {
        // helper to extract first mermaid from common locations
        const extractFromToolResults = (arr: any[]) => {
          if (!Array.isArray(arr)) return undefined;
          for (const item of arr) {
            const r = item?.result ?? item?.content ?? item;
            // some shapes nest under content[0].result
            const maybe = r?.mermaid ?? r?.output?.mermaid ?? ((r && r[0] && r[0].result && r[0].result.mermaid));
            if (maybe) {
              const toolName = item?.toolName ?? (item?.tool ?? item?.toolCallId);
              return { mermaid: maybe, toolName };
            }
          }
          return undefined;
        };

        const directToolResults = (agentRes as any).toolResults || (agentRes as any).tool_results || undefined;
        const fromDirect = extractFromToolResults(directToolResults);

        let found;
        if (fromDirect) found = fromDirect;

        // try steps[].toolResults (generateLegacy may include steps)
        if (!found && Array.isArray((agentRes as any).steps)) {
          for (const step of (agentRes as any).steps) {
            const fr = extractFromToolResults(step.toolResults || step.tool_results || []);
            if (fr) {
              found = fr;
              break;
            }
          }
        }

        // try top-level toolResults inside response object
        if (!found) {
          const flatContents = (agentRes as any).response?.messages?.flatMap?.((m: any) => m?.content ?? []) ?? [];
          const fr2 = extractFromToolResults(flatContents);
          if (fr2) found = fr2;
        }

        // try request.toolResults shape seen in some provider responses
        if (!found) {
          const reqTools = (agentRes as any).request?.tools ?? ((agentRes as any).request?.body && (() => {
            try { return JSON.parse((agentRes as any).request.body).tools; } catch (e) { return undefined; }
          })());
          if (reqTools && reqTools.length) {
            const fr3 = extractFromToolResults(reqTools);
            if (fr3) found = fr3;
          }
        }

        if (found) {
          mermaid = found.mermaid;
          toolId = found.toolName || toolId || '';

          // resolve mapped names like _0 -> actual tool id using agent.getTools()
          const m = String(toolId || '');
          if (/^_\d+$/.test(m)) {
            try {
              const toolsMap = await agent.getTools?.() ?? (agent as any).tools;
              const idx = Number(m.slice(1));
              let mapped: any;
              if (Array.isArray(toolsMap)) {
                mapped = toolsMap[idx];
              } else if (toolsMap && typeof toolsMap === 'object') {
                mapped = (toolsMap as any)[String(idx)] ?? (toolsMap as any)[idx];
              } else {
                mapped = undefined;
              }
              if (mapped) toolId = (mapped as any).id ?? (mapped as any).name ?? toolId;
            } catch (e) {
              // ignore resolution errors
            }
          }
        }
      }

      // sanitize mermaid if present
      if (mermaid) mermaid = sanitizeMermaidSource(mermaid);

      // For visibility during development, log parsed wrapper if we didn't find mermaid
      if (!mermaid) {
        console.warn('UI: no mermaid found in agent response; full agentRes summary:', {
          text: (agentRes as any)?.text ?? (agentRes as any)?.content ?? undefined,
          tool: (agentRes as any)?.tool ?? undefined,
          result: (agentRes as any)?.result ?? undefined,
          choices: (agentRes as any)?.choices ?? undefined,
          messages: (agentRes as any)?.messages ?? (agentRes as any)?.message ?? undefined,
        });
      }
    }

    // If not present, call the appropriate tool directly as fallback for the selected mode
    if (mode === 'mermaid' && !mermaid) {
      try {
        const direct: any = await MermaidDiagramTool.execute({ args: { kind: 'flowchart', context: prompt } } as any);
        mermaid = direct?.mermaid ?? direct?.output?.mermaid ?? undefined;
        if (mermaid) mermaid = sanitizeMermaidSource(mermaid);
      } catch (e) {
        console.error('Mermaid tool failed', e);
      }
    }

    if (mode === 'excalidraw' && !scene) {
      try {
        const direct: any = await WireframeTool.execute({ args: { pageTitle: 'Screen', sections: ['Projects', 'Activity', 'Settings'] } } as any);
        scene = direct?.scene ?? direct?.output?.scene ?? undefined;
      } catch (e) {
        console.error('Wireframe (excalidraw) tool failed', e);
      }
    }

    if (mode === 'figma' && !figma) {
      try {
        const direct: any = await FigmaWireframeTool.execute({ args: { pageTitle: 'Screen', sections: ['Projects', 'Activity', 'Settings'] } } as any);
        figma = direct?.figma ?? direct?.output?.figma ?? undefined;
      } catch (e) {
        console.error('Wireframe (figma) tool failed', e);
      }
    }

    // Persist artifacts like the test scripts do
    if (mermaid) {
      try {
        // write sanitized mermaid to disk
        writeFileSync('diagram.mmd', String(mermaid));
      } catch (e) {
        console.warn('Failed to write diagram.mmd', e);
      }
    }
    if (scene) {
      try {
        writeFileSync('wireframe.excalidraw.json', JSON.stringify(scene, null, 2));
      } catch (e) {
        console.warn('Failed to write wireframe.excalidraw.json', e);
      }
    }
    if (figma) {
      try {
        writeFileSync('wireframe.figma.json', JSON.stringify(figma, null, 2));
      } catch (e) {
        console.warn('Failed to write wireframe.figma.json', e);
      }
    }

    send(res, 200, JSON.stringify({ ok: true, mermaid, scene, figma, raw: agentRes ?? null }), 'application/json');
  } catch (err: any) {
    console.error('Error in /api/generate', err);
    send(res, 500, JSON.stringify({ ok: false, error: String(err) }), 'application/json');
  }
}

function serveStatic(req: any, res: any) {
  const url = req.url === '/' ? '/index.html' : req.url;
  const path = (UI_DIR + url).split('?')[0];
  try {
    if (!existsSync(path)) {
      send(res, 404, 'Not found');
      return;
    }
    const data = readFileSync(path);
    const ext = extname(path).toLowerCase();
    const map: any = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    };
    send(res, 200, data, map[ext] || 'application/octet-stream');
  } catch (e) {
    console.error('Static serve error', e);
    send(res, 500, 'Server error');
  }
}

const server = createServer(async (req, res) => {
  if (!req) return;
  if (req.method === 'OPTIONS') return send(res, 200, 'OK');

  if (req.url?.startsWith('/api/generate') && req.method === 'POST') {
    return await handleApiGenerate(req, res);
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`UI server running at http://localhost:${PORT}/`);
});
