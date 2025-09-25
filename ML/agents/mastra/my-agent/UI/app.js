(() => {
  const promptEl = document.getElementById('prompt');
  const previewEl = document.getElementById('promptPreview');
  const editToggle = document.getElementById('editToggle');
  const generateBtn = document.getElementById('generate');
  const statusEl = document.getElementById('status');
  const resultEl = document.getElementById('result');
  const modeInputs = document.querySelectorAll('input[name="mode"]');
  // removed renderAll checkbox (no-op)

  // preview containers
  const mermaidPreview = document.getElementById('mermaidPreview');
  const excalidrawPreview = document.getElementById('excalidrawPreview');
  const figmaPreview = document.getElementById('figmaPreview');

  const defaultPrompts = {
    mermaid: `You are the diagrammer agent.\nTask: produce a flowchart for the signup flow:\nUser enters email -> System sends verification code -> If valid -> create account; else -> show error\nCRITICAL: You MUST call the mermaid-diagram tool. Return only the tool output.`,
    excalidraw: `Create a lo-fi UI wireframe for a "Team Dashboard".\nInclude: Header, Sidebar, Content area listing: Projects, Activity, Settings.\nUse the wireframe-excalidraw tool and return ONLY the tool output.`,
    figma: `Create a lo-fi UI wireframe for a "Team Dashboard".\nInclude: Header, Sidebar, Content area listing: Projects, Activity, Settings.\nUse the wireframe-figma tool and return ONLY the tool output.`,
  };

  function selectedMode() {
    const checked = document.querySelector('input[name="mode"]:checked');
    return checked ? checked.value : 'mermaid';
  }

  // Show only the preview panes whose data-mode is present in the modes array.
  function showOnlyPreviews(modes) {
    document.querySelectorAll('.preview-pane').forEach((p) => {
      const m = p.getAttribute('data-mode');
      if (!m) return;
      if (modes.includes(m)) p.classList.remove('hidden');
      else p.classList.add('hidden');
    });
  }

  // Reusable sanitizer for mermaid source so multiple places can use it
  function sanitizeMermaidSource(src) {
    if (!src) return '';
    let s = String(src).trim();
    const fenceRegex = /```(?:mermaid)?\s*([\s\S]*?)\s*```/i;
    const m = s.match(fenceRegex);
    if (m && m[1]) return m[1].trim();
    s = s.replace(/^\s*mermaid\s*\n/i, '').trim();
    return s;
  }

  // Set a loading/placeholder message in the visible preview pane(s).
  function setVisiblePreviewsToLoading(mode) {
    showOnlyPreviews([mode]);
    document.querySelectorAll('.preview-pane').forEach((pane) => {
      if (pane.classList.contains('hidden')) return;
      const viz = pane.querySelector('.viz');
      if (!viz) return;
      const m = pane.getAttribute('data-mode');
      viz.innerHTML = `<div class="preview-empty">Loading ${m} preview...</div>`;
    });
  }

  function updatePreview() {
    previewEl.textContent = promptEl.value;
  }

  function setDefaultPromptForMode() {
    const mode = selectedMode();
    promptEl.value = defaultPrompts[mode] || '';
    updatePreview();
  }

  // init
  setDefaultPromptForMode();
  // Ensure only the selected mode's preview pane is visible on load
  showOnlyPreviews([selectedMode()]);
  promptEl.readOnly = true;

  modeInputs.forEach((i) => i.addEventListener('change', () => {
    setDefaultPromptForMode();
    showOnlyPreviews([selectedMode()]);
  }));

  editToggle.addEventListener('click', () => {
    const isReadOnly = promptEl.readOnly;
    promptEl.readOnly = !isReadOnly;
    editToggle.textContent = isReadOnly ? 'Lock' : 'Edit';
    if (!promptEl.readOnly) {
      promptEl.focus();
    }
  });

  promptEl.addEventListener('input', updatePreview);

  function showStatus(msg) {
    statusEl.textContent = msg;
  }

  function prettyJSON(obj) {
    try { return JSON.stringify(obj, null, 2); } catch (e) { return String(obj); }
  }

  function createDownloadButton(filename, content, mime = 'application/octet-stream') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.textContent = `Download ${filename}`;
    a.className = 'download';
    a.addEventListener('click', () => setTimeout(() => URL.revokeObjectURL(url), 5000));
    return a;
  }

  // --- Preview renderers -------------------------------------------------
  // Render mermaid source into the mermaidPreview container using mermaid API
  function renderMermaid(mermaidSrc) {
    if (!mermaidPreview) return;
    mermaidPreview.innerHTML = '';
    const sanitized = sanitizeMermaidSource(mermaidSrc);
    // Validate mermaid source early so we can show parse errors instead of cryptic render failures
    try {
      if (window.mermaid && typeof window.mermaid.parse === 'function') {
        // mermaid.parse throws on invalid grammar
        window.mermaid.parse(sanitized);
      }
    } catch (parseErr) {
      mermaidPreview.textContent = 'Mermaid parse error: ' + String(parseErr) + '\n\n' + sanitized;
      return;
    }
    try {
      // ensure mermaid initialized
      if (window.mermaid) {
        window.mermaid.initialize({ startOnLoad: false });
        const id = 'm' + Date.now();
        // mermaid.render may return a Promise in newer mermaid versions
        try {
          const maybe = window.mermaid.render(id, sanitized);
          if (maybe && typeof maybe.then === 'function') {
            // async path
            maybe
              .then((res) => {
                // res may be { svg, bindFunctions }
                if (res && res.svg) mermaidPreview.innerHTML = res.svg;
                else mermaidPreview.textContent = String(res);
              })
              .catch((err) => {
                mermaidPreview.textContent = 'Failed to render mermaid: ' + String(err) + '\n\n' + sanitized;
              });
          } else if (maybe && maybe.svg) {
            // sync path
            mermaidPreview.innerHTML = maybe.svg;
          } else if (typeof maybe === 'string') {
            mermaidPreview.innerHTML = maybe;
          } else {
            mermaidPreview.textContent = sanitized || mermaidSrc;
          }
        } catch (e) {
          // render error fallback to plain text
          mermaidPreview.textContent = 'Failed to render mermaid: ' + String(e) + '\n\n' + sanitized;
        }
      } else {
        mermaidPreview.textContent = sanitized || mermaidSrc;
      }
    } catch (e) {
      mermaidPreview.textContent = 'Mermaid render error: ' + String(e);
    }
  }

  // Render a minimal Excalidraw preview into an SVG inside excalidrawPreview
  function renderExcalidraw(scene) {
    if (!excalidrawPreview) return;
    excalidrawPreview.innerHTML = '';
    try {
      const svgNS = 'http://www.w3.org/2000/svg';
      const width = 800;
      const height = 480;
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.style.border = '1px solid #e6edf3';
      svg.style.background = '#fff';

      const elements = (scene && scene.elements) || [];
      for (const el of elements) {
        if (el.type === 'rectangle') {
          const r = document.createElementNS(svgNS, 'rect');
          r.setAttribute('x', String(Math.round(el.x || 0)));
          r.setAttribute('y', String(Math.round(el.y || 0)));
          r.setAttribute('width', String(Math.round(el.width || 80)));
          r.setAttribute('height', String(Math.round(el.height || 40)));
          r.setAttribute('fill', 'transparent');
          r.setAttribute('stroke', '#000');
          r.setAttribute('stroke-width', '1');
          svg.appendChild(r);
        } else if (el.type === 'text') {
          const t = document.createElementNS(svgNS, 'text');
          t.setAttribute('x', String(Math.round(el.x || 0)));
          t.setAttribute('y', String(Math.round((el.y || 0) + 16))); // baseline offset
          t.setAttribute('fill', '#000');
          t.setAttribute('font-size', String(el.fontSize || 16));
          t.textContent = el.text || el.characters || el.value || '';
          svg.appendChild(t);
        }
      }

      excalidrawPreview.appendChild(svg);
    } catch (e) {
      excalidrawPreview.textContent = 'Excalidraw preview error: ' + String(e);
    }
  }

  // Render a simple Figma-like preview using absolutely positioned divs
  function renderFigma(figma) {
    if (!figmaPreview) return;
    figmaPreview.innerHTML = '';
    try {
      const doc = figma && figma.document;
      const canvas = document.createElement('div');
      canvas.style.position = 'relative';
      canvas.style.width = '800px';
      canvas.style.minHeight = '480px';
      canvas.style.background = '#fff';
      canvas.style.border = '1px solid #e6edf3';

      const frameChildren = (figma && figma.document && figma.document.children && figma.document.children[0] && figma.document.children[0].children) || (figma && figma.document && figma.document.children) || [];

      for (const node of frameChildren) {
        const type = node.type || '';
        const box = node.absoluteBoundingBox || node.absoluteBoundingBox || node; // fallback
        if (!box) continue;
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.left = (box.x || 0) + 'px';
        el.style.top = (box.y || 0) + 'px';
        el.style.width = (box.width || 100) + 'px';
        el.style.height = (box.height || 24) + 'px';
        el.style.boxSizing = 'border-box';
        el.style.border = '1px solid rgba(0,0,0,0.08)';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.paddingLeft = '8px';
        el.style.fontSize = '14px';
        if (type === 'RECTANGLE' || type === 'FRAME') {
          el.style.background = (node.fills && node.fills[0] && node.fills[0].color) ? '#ffffff' : '#f7f7f7';
        }
        if (type === 'TEXT') {
          el.textContent = node.characters || node.name || '';
        } else if (node.name) {
          el.textContent = node.name;
        }
        canvas.appendChild(el);
      }

      figmaPreview.appendChild(canvas);
    } catch (e) {
      figmaPreview.textContent = 'Figma preview error: ' + String(e);
    }
  }

  // --- Generate handler (wrap existing network logic) -------------------
  generateBtn.addEventListener('click', async () => {
    const mode = selectedMode();
    const payload = { mode, prompt: promptEl.value };
    showStatus('Generating...');
    resultEl.innerHTML = '';

    // show only the pane for the selected mode and display a loading message there
    setVisiblePreviewsToLoading(mode);

    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        showStatus('Error');
        resultEl.textContent = `Server error: ${text}`;
        return;
      }

      const json = await resp.json();
      showStatus('Done');

      // Explain what was returned (server writes artifacts to disk too)
      const info = document.createElement('div');
      info.className = 'small';
      info.textContent = 'Server persisted artifacts in repository root: diagram.mmd, wireframe.excalidraw.json, wireframe.figma.json (if generated). The response below shows the returned payload(s).';
      resultEl.appendChild(info);

      // Determine which preview panes should be visible based on the server response.
      const resultModes = [];
      if (json.mermaid) resultModes.push('mermaid');
      if (json.scene) resultModes.push('excalidraw');
      if (json.figma) resultModes.push('figma');

      // If the server didn't return anything relevant, keep showing the selected mode
      if (resultModes.length === 0) resultModes.push(mode);

      // Show only the relevant preview panes
      showOnlyPreviews(resultModes);

      if (json.mermaid) {
        // Header + download button (no raw text shown)
        resultEl.appendChild(document.createElement('h3')).textContent = 'Mermaid';
        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '8px';
        actions.appendChild(createDownloadButton('diagram.mmd', json.mermaid, 'text/plain'));
        resultEl.appendChild(actions);

        // Show sanitized mermaid source for debugging
        try {
          const src = sanitizeMermaidSource(json.mermaid);
          const pre = document.createElement('pre');
          pre.className = 'preview small';
          pre.textContent = src;
          resultEl.appendChild(pre);
        } catch (e) {
          // ignore
        }

        // clear placeholder and render
        if (mermaidPreview) mermaidPreview.innerHTML = '';
        renderMermaid(json.mermaid);
      }

      if (json.scene) {
        resultEl.appendChild(document.createElement('h3')).textContent = 'Excalidraw scene';
        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '8px';
        actions.appendChild(createDownloadButton('wireframe.excalidraw.json', prettyJSON(json.scene), 'application/json'));
        resultEl.appendChild(actions);

        // render excalidraw preview
        if (excalidrawPreview) excalidrawPreview.innerHTML = '';
        renderExcalidraw(json.scene);
      }

      if (json.figma) {
        resultEl.appendChild(document.createElement('h3')).textContent = 'Figma payload';
        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '8px';
        actions.appendChild(createDownloadButton('wireframe.figma.json', prettyJSON(json.figma), 'application/json'));
        resultEl.appendChild(actions);

        // render figma preview
        if (figmaPreview) figmaPreview.innerHTML = '';
        renderFigma(json.figma);
      }

      // raw agent result for debugging
      if (json.raw) {
        // Provide raw response as a downloadable JSON for debugging
        const rawActions = document.createElement('div');
        rawActions.style.marginTop = '8px';
        rawActions.appendChild(createDownloadButton('agent.raw.json', prettyJSON(json.raw), 'application/json'));
        resultEl.appendChild(rawActions);
      }
    } catch (err) {
      showStatus('Error');
      resultEl.textContent = 'Error: ' + String(err);
    }
  });

})();
