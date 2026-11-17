/* ==========================================================================
   AI PORTFOLIO ASSISTANT - "Pixel"
   3D robot (Three.js, lazy-loaded) + streaming chat with /api/chat
   ========================================================================== */

(function () {
  'use strict';

  const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  const CONTACT_EMAIL = 'preamkdm007@gmail.com';
  const STORAGE_KEY = 'pixel-chat-history';
  const GREETING_KEY = 'pixel-greeted';
  const MAX_INPUT = 1000;

  const WELCOME =
    "Hi there! 👋 I'm **Pixel**, Petchi's AI assistant. Ask me anything about Petchi's skills, projects, experience or certifications.";

  const SUGGESTIONS = [
    'Who is Petchi?',
    'What are Petchi\'s key skills?',
    'Show me Petchi\'s projects',
    'Which certifications does Petchi hold?',
    'How can I contact Petchi?'
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Storage helpers (may be unavailable in private mode)
     ------------------------------------------------------------------------ */
  const store = {
    get(key) {
      try { return sessionStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { sessionStorage.setItem(key, value); } catch { /* ignore */ }
    },
    remove(key) {
      try { sessionStorage.removeItem(key); } catch { /* ignore */ }
    }
  };

  /* ------------------------------------------------------------------------
     Markup
     ------------------------------------------------------------------------ */
  const ICONS = {
    close: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M4.3 4.3a1 1 0 011.4 0L10 8.6l4.3-4.3a1 1 0 111.4 1.4L11.4 10l4.3 4.3a1 1 0 01-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 01-1.4-1.4L8.6 10 4.3 5.7a1 1 0 010-1.4z" clip-rule="evenodd"/></svg>',
    reset: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.1A7 7 0 0116.9 8.3a1 1 0 11-1.9.6A5 5 0 006.3 6H8a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.1 9.1a1 1 0 011.3.6A5 5 0 0013.7 14H12a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0v-2.1A7 7 0 013.1 11.7a1 1 0 01.6-1.3z" clip-rule="evenodd"/></svg>',
    send: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.9 3.1a1.3 1.3 0 00-1.8 0L4.3 7.9a1 1 0 001.4 1.4L9 6V16a1 1 0 102 0V6l3.3 3.3a1 1 0 001.4-1.4l-4.8-4.8z"/></svg>',
    voiceOn: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.4 3.2a.8.8 0 011.3.6v12.4a.8.8 0 01-1.3.6L5.6 13.6H3.5A1.5 1.5 0 012 12.1V7.9a1.5 1.5 0 011.5-1.5h2.1l3.8-3.2z"/><path d="M13.3 6.3a1 1 0 011.4 0 5.2 5.2 0 010 7.4 1 1 0 11-1.4-1.4 3.2 3.2 0 000-4.6 1 1 0 010-1.4z"/><path d="M15.4 4.1a1 1 0 011.4 0 8.3 8.3 0 010 11.8 1 1 0 01-1.4-1.4 6.3 6.3 0 000-9 1 1 0 010-1.4z"/></svg>',
    voiceOff: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.4 3.2a.8.8 0 011.3.6v12.4a.8.8 0 01-1.3.6L5.6 13.6H3.5A1.5 1.5 0 012 12.1V7.9a1.5 1.5 0 011.5-1.5h2.1l3.8-3.2z"/><path d="M13.3 7.3a1 1 0 011.4 0l1.3 1.3 1.3-1.3a1 1 0 111.4 1.4L17.4 10l1.3 1.3a1 1 0 01-1.4 1.4L16 11.4l-1.3 1.3a1 1 0 01-1.4-1.4l1.3-1.3-1.3-1.3a1 1 0 010-1.4z"/></svg>',
    stop: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="10" height="10" rx="2"/></svg>',
    robot: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="16" width="44" height="34" rx="16" fill="#151b27"/><ellipse cx="24" cy="32" rx="5" ry="6.5" fill="#f97316"/><ellipse cx="40" cy="32" rx="5" ry="6.5" fill="#f97316"/><path d="M25 42q7 5 14 0" stroke="#f97316" stroke-width="3" fill="none" stroke-linecap="round"/><line x1="32" y1="16" x2="32" y2="7" stroke="#94a3b8" stroke-width="3"/><circle cx="32" cy="6" r="4" fill="#f97316"/></svg>'
  };

  const root = document.createElement('div');
  root.className = 'pixel-root';
  root.innerHTML = `
    <button type="button" class="pixel-launcher" id="pixelLauncher" aria-label="Open Pixel, Petchi's AI assistant" aria-expanded="false" aria-controls="pixelPanel">
      <div class="pixel-stage" id="pixelStage">
        <div class="pixel-fallback">${ICONS.robot}</div>
      </div>
      <span class="pixel-greeting" id="pixelGreeting">Hi! 👋 Ask me anything about Petchi.</span>
    </button>

    <section class="pixel-panel" id="pixelPanel" role="dialog" aria-modal="false" aria-labelledby="pixelTitle" aria-hidden="true">
      <header class="pixel-header">
        <div class="pixel-header-avatar" id="pixelHeaderAvatar"></div>
        <div class="pixel-header-info">
          <h2 class="pixel-title" id="pixelTitle">Pixel · AI Assistant</h2>
          <div class="pixel-status"><span class="pixel-status-dot"></span><span id="pixelStatusText">Online · Ask me about Petchi</span></div>
        </div>
        <div class="pixel-header-actions">
          <button type="button" class="pixel-icon-btn" id="pixelVoiceToggle" aria-pressed="true" aria-label="Turn voice replies off" title="Voice replies: on" hidden>${ICONS.voiceOn}</button>
          <button type="button" class="pixel-icon-btn" id="pixelReset" aria-label="Start a new conversation" title="New conversation">${ICONS.reset}</button>
          <button type="button" class="pixel-icon-btn" id="pixelClose" aria-label="Close chat" title="Close">${ICONS.close}</button>
        </div>
      </header>

      <div class="pixel-messages" id="pixelMessages" role="log" aria-live="polite"></div>

      <div class="pixel-voice-bar" id="pixelVoiceBar" hidden>
        <span class="pixel-eq" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
        <span class="pixel-voice-label">Pixel is speaking…</span>
        <button type="button" class="pixel-stop" id="pixelStop" aria-label="Stop voice">${ICONS.stop}<span>Stop voice</span></button>
      </div>

      <form class="pixel-composer" id="pixelForm" autocomplete="off">
        <label for="pixelInput" class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);">Your message</label>
        <textarea id="pixelInput" class="pixel-input" rows="1" maxlength="${MAX_INPUT}" placeholder="Ask about Petchi's skills, projects…"></textarea>
        <button type="submit" class="pixel-send" id="pixelSend" aria-label="Send message" disabled>${ICONS.send}</button>
      </form>
      <p class="pixel-footnote">AI answers are based on this portfolio and may occasionally be imperfect.</p>
    </section>
  `;
  document.body.appendChild(root);

  const launcher = root.querySelector('#pixelLauncher');
  const stage = root.querySelector('#pixelStage');
  const greeting = root.querySelector('#pixelGreeting');
  const panel = root.querySelector('#pixelPanel');
  const headerAvatar = root.querySelector('#pixelHeaderAvatar');
  const statusText = root.querySelector('#pixelStatusText');
  const messagesEl = root.querySelector('#pixelMessages');
  const form = root.querySelector('#pixelForm');
  const input = root.querySelector('#pixelInput');
  const sendBtn = root.querySelector('#pixelSend');
  const resetBtn = root.querySelector('#pixelReset');
  const closeBtn = root.querySelector('#pixelClose');
  const voiceToggle = root.querySelector('#pixelVoiceToggle');
  const voiceBar = root.querySelector('#pixelVoiceBar');
  const stopBtn = root.querySelector('#pixelStop');

  /* ------------------------------------------------------------------------
     Safe mini-markdown renderer
     ------------------------------------------------------------------------ */
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderInline(text) {
    let html = escapeHtml(text);
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    html = html.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|tel:)[^\s)]+)\)/g, (m, label, url) => {
      const external = url.startsWith('http');
      return `<a href="${url}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    });
    html = html.replace(/(^|[\s(])([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, '$1<a href="mailto:$2">$2</a>');
    html = html.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
    return html;
  }

  function renderMarkdown(text) {
    const lines = text.replace(/\r/g, '').split('\n');
    let html = '';
    let listType = null;
    let paragraph = [];

    const flushParagraph = () => {
      if (paragraph.length) {
        html += `<p>${paragraph.map(renderInline).join('<br>')}</p>`;
        paragraph = [];
      }
    };
    const closeList = () => {
      if (listType) {
        html += `</${listType}>`;
        listType = null;
      }
    };

    lines.forEach((raw) => {
      const line = raw.trim();
      const bullet = line.match(/^[-*•]\s+(.*)$/);
      const numbered = line.match(/^\d+[.)]\s+(.*)$/);

      if (bullet || numbered) {
        flushParagraph();
        const type = bullet ? 'ul' : 'ol';
        if (listType !== type) {
          closeList();
          html += `<${type}>`;
          listType = type;
        }
        html += `<li>${renderInline((bullet || numbered)[1])}</li>`;
      } else if (!line) {
        flushParagraph();
        closeList();
      } else {
        closeList();
        paragraph.push(line.replace(/^#+\s*/, ''));
      }
    });
    flushParagraph();
    closeList();
    return html;
  }

  /* ------------------------------------------------------------------------
     Chat state & rendering
     ------------------------------------------------------------------------ */
  let history = [];
  let isBusy = false;
  let activeRequest = null;

  try {
    const saved = JSON.parse(store.get(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) history = saved.filter((m) => m && m.role && typeof m.content === 'string');
  } catch { /* ignore corrupted storage */ }

  function saveHistory() {
    store.set(STORAGE_KEY, JSON.stringify(history.slice(-20)));
  }

  /* ------------------------------------------------------------------------
     Voice replies (audio is generated server-side by ElevenLabs)
     ------------------------------------------------------------------------ */
  const VOICE_PREF_KEY = 'pixel-voice';
  const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  const audio = new Audio();
  audio.preload = 'auto';

  let voiceAvailable = false;
  let voiceEnabled = true;
  let audioUnlocked = false;
  let isSpeaking = false;
  let speakToken = 0;
  let speakRequest = null;
  let activeListenBtn = null;

  try { voiceEnabled = localStorage.getItem(VOICE_PREF_KEY) !== 'off'; } catch { /* ignore */ }

  // Mobile browsers only allow sound that starts from a tap - prime the
  // audio element during the user's send/click so the reply can play later.
  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    audio.src = SILENT_WAV;
    audio.play().catch(() => {});
  }

  function setSpeaking(speaking) {
    isSpeaking = speaking;
    voiceBar.hidden = !speaking;
    if (activeListenBtn) activeListenBtn.classList.toggle('is-playing', speaking);
    if (!speaking) activeListenBtn = null;
    if (!isBusy) robot.setMood(speaking ? 'talking' : 'idle');
  }

  function stopVoice() {
    speakToken++;
    if (speakRequest) speakRequest.abort();
    speakRequest = null;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    setSpeaking(false);
  }

  async function speak(text, listenBtn) {
    if (!voiceAvailable || !text.trim()) return;
    stopVoice();
    const token = ++speakToken;
    activeListenBtn = listenBtn || null;
    setSpeaking(true);
    speakRequest = new AbortController();

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: speakRequest.signal
      });
      if (!res.ok) throw new Error(String(res.status));
      const { url } = await res.json();
      if (token !== speakToken) return;
      audio.src = url;
      await audio.play();
    } catch (err) {
      if (token !== speakToken || err.name === 'AbortError') return;
      setSpeaking(false);
      if (listenBtn && err.message === '403') {
        listenBtn.disabled = true;
        listenBtn.title = 'Audio for this message has expired';
      }
    }
  }

  audio.addEventListener('ended', () => { if (audio.src !== SILENT_WAV) setSpeaking(false); });
  audio.addEventListener('error', () => { if (isSpeaking && audio.getAttribute('src')) setSpeaking(false); });

  function updateVoiceToggle() {
    voiceToggle.innerHTML = voiceEnabled ? ICONS.voiceOn : ICONS.voiceOff;
    voiceToggle.setAttribute('aria-pressed', String(voiceEnabled));
    voiceToggle.setAttribute('aria-label', voiceEnabled ? 'Turn voice replies off' : 'Turn voice replies on');
    voiceToggle.title = voiceEnabled ? 'Voice replies: on' : 'Voice replies: off';
    voiceToggle.classList.toggle('is-off', !voiceEnabled);
  }

  voiceToggle.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    try { localStorage.setItem(VOICE_PREF_KEY, voiceEnabled ? 'on' : 'off'); } catch { /* ignore */ }
    if (!voiceEnabled) stopVoice();
    else unlockAudio();
    updateVoiceToggle();
  });

  stopBtn.addEventListener('click', stopVoice);

  function addListenButton(row, text) {
    if (!voiceAvailable) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pixel-listen';
    btn.innerHTML = `${ICONS.voiceOn}<span>Listen</span>`;
    btn.setAttribute('aria-label', 'Play this answer aloud');
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-playing')) return stopVoice();
      unlockAudio();
      speak(text, btn);
    });
    row.appendChild(btn);
  }

  fetch('/api/config')
    .then((r) => (r.ok ? r.json() : {}))
    .then((cfg) => {
      voiceAvailable = Boolean(cfg.voice);
      if (!voiceAvailable) return;
      voiceToggle.hidden = false;
      updateVoiceToggle();
      // Add Listen buttons to answers restored from this session
      messagesEl.querySelectorAll('.pixel-msg.bot[data-index]').forEach((row) => {
        const msg = history[Number(row.dataset.index)];
        if (msg) addListenButton(row, msg.content);
      });
    })
    .catch(() => {});

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(role, content, extraClass) {
    const row = document.createElement('div');
    row.className = `pixel-msg ${role === 'user' ? 'user' : 'bot'}${extraClass ? ' ' + extraClass : ''}`;
    const bubble = document.createElement('div');
    bubble.className = 'pixel-bubble';
    if (role === 'user') {
      bubble.textContent = content;
    } else {
      bubble.innerHTML = renderMarkdown(content);
    }
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    scrollToBottom();
    return bubble;
  }

  function renderSuggestions() {
    const wrap = document.createElement('div');
    wrap.className = 'pixel-suggestions';
    SUGGESTIONS.forEach((text) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'pixel-chip';
      chip.textContent = text;
      chip.addEventListener('click', () => {
        wrap.remove();
        if (voiceEnabled) unlockAudio();
        sendMessage(text);
      });
      wrap.appendChild(chip);
    });
    messagesEl.appendChild(wrap);
  }

  function renderConversation() {
    messagesEl.innerHTML = '';
    addMessage('assistant', WELCOME);
    history.forEach((m, i) => {
      addMessage(m.role, m.content);
      if (m.role === 'assistant') {
        const row = messagesEl.lastElementChild;
        row.dataset.index = String(i);
        addListenButton(row, m.content);
      }
    });
    if (!history.length) renderSuggestions();
  }

  function setBusy(busy) {
    isBusy = busy;
    panel.classList.toggle('is-thinking', busy);
    statusText.textContent = busy ? 'Pixel is thinking…' : 'Online · Ask me about Petchi';
    updateSendState();
    robot.setMood(busy ? 'thinking' : isSpeaking ? 'talking' : 'idle');
  }

  function updateSendState() {
    sendBtn.disabled = isBusy || !input.value.trim();
  }

  function autoResize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  async function sendMessage(text) {
    const content = text.trim().slice(0, MAX_INPUT);
    if (!content || isBusy) return;

    stopVoice();
    if (voiceEnabled) unlockAudio();

    messagesEl.querySelectorAll('.pixel-suggestions').forEach((el) => el.remove());
    history.push({ role: 'user', content });
    saveHistory();
    addMessage('user', content);

    input.value = '';
    autoResize();
    setBusy(true);

    const bubble = addMessage('assistant', '');
    bubble.innerHTML = '<span class="pixel-typing" aria-label="Pixel is typing"><span></span><span></span><span></span></span>';

    let reply = '';
    let frame = 0;
    activeRequest = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-12) }),
        signal: activeRequest.signal
      });

      if (!res.ok || !res.body) {
        let message = '';
        try { message = (await res.json()).error; } catch { /* not JSON */ }
        throw new Error(message || 'offline');
      }

      robot.setMood('talking');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        if (!frame) {
          frame = requestAnimationFrame(() => {
            frame = 0;
            bubble.innerHTML = renderMarkdown(reply);
            scrollToBottom();
          });
        }
      }
      reply += decoder.decode();
      cancelAnimationFrame(frame);

      if (!reply.trim()) throw new Error('empty');
      bubble.innerHTML = renderMarkdown(reply);
      history.push({ role: 'assistant', content: reply });
      saveHistory();

      const row = bubble.parentElement;
      row.dataset.index = String(history.length - 1);
      addListenButton(row, reply);
      if (voiceEnabled) speak(reply, row.querySelector('.pixel-listen'));
    } catch (err) {
      if (err.name === 'AbortError') {
        bubble.parentElement.remove();
      } else {
        const friendly = err.message && !['offline', 'empty', 'Failed to fetch'].includes(err.message) && !/fetch|network/i.test(err.message)
          ? err.message
          : `Sorry, I can't connect right now. 🙏 Please try again in a moment, or reach Petchi directly at ${CONTACT_EMAIL}.`;
        bubble.parentElement.classList.add('error');
        bubble.innerHTML = renderMarkdown(friendly);
        // Drop the unanswered question so a retry starts cleanly.
        history.pop();
        saveHistory();
      }
    } finally {
      activeRequest = null;
      setBusy(false);
      scrollToBottom();
    }
  }

  /* ------------------------------------------------------------------------
     Open / close
     ------------------------------------------------------------------------ */
  let isOpen = false;
  let greetingTimer = null;

  function hideGreeting() {
    greeting.classList.remove('show');
    clearTimeout(greetingTimer);
  }

  function openChat() {
    if (isOpen) return;
    isOpen = true;
    hideGreeting();
    store.set(GREETING_KEY, '1');
    headerAvatar.appendChild(stage);
    robot.setFraming('portrait');
    robot.wave();
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.classList.add('is-hidden');
    launcher.setAttribute('aria-expanded', 'true');
    scrollToBottom();
    setTimeout(() => input.focus({ preventScroll: true }), 250);
  }

  function closeChat() {
    if (!isOpen) return;
    isOpen = false;
    stopVoice();
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.prepend(stage);
    robot.setFraming('full');
    launcher.classList.remove('is-hidden');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus({ preventScroll: true });
  }

  launcher.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  resetBtn.addEventListener('click', () => {
    if (activeRequest) activeRequest.abort();
    stopVoice();
    history = [];
    store.remove(STORAGE_KEY);
    renderConversation();
    robot.wave();
    input.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  input.addEventListener('input', () => {
    autoResize();
    updateSendState();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  // Friendly one-time nudge per session
  if (!store.get(GREETING_KEY)) {
    setTimeout(() => {
      if (isOpen) return;
      greeting.classList.add('show');
      robot.wave();
      greetingTimer = setTimeout(hideGreeting, 7000);
    }, 3500);
  }

  /* ------------------------------------------------------------------------
     3D robot
     ------------------------------------------------------------------------ */
  const robot = createRobotController();

  function createRobotController() {
    let api = null;
    let pending = { mood: 'idle', framing: 'full', wave: false };

    const proxy = {
      setMood(mood) { pending.mood = mood; if (api) api.setMood(mood); },
      setFraming(f) { pending.framing = f; if (api) api.setFraming(f); },
      wave() { if (api) api.wave(); else pending.wave = true; }
    };

    function supportsWebGL() {
      try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
      } catch {
        return false;
      }
    }

    function loadThree() {
      return new Promise((resolve, reject) => {
        if (window.THREE) return resolve(window.THREE);
        const s = document.createElement('script');
        s.src = THREE_URL;
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.onload = () => (window.THREE ? resolve(window.THREE) : reject(new Error('three missing')));
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    function start() {
      if (!supportsWebGL()) return;
      loadThree()
        .then((THREE) => {
          api = buildRobot(THREE, stage);
          stage.classList.add('is-3d');
          api.setMood(pending.mood);
          api.setFraming(pending.framing, true);
          if (pending.wave) api.wave();
        })
        .catch(() => { /* keep the SVG fallback */ });
    }

    // Load after the page is ready so the portfolio itself stays fast.
    const kickoff = () => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 800));
    if (document.readyState === 'complete') kickoff();
    else window.addEventListener('load', kickoff, { once: true });

    return proxy;
  }

  function buildRobot(THREE, container) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    // Lighting: soft fill, warm key, orange rim to match the site theme
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1a2233, 0.85));
    const key = new THREE.DirectionalLight(0xfff4e6, 1.1);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xf97316, 1.6, 12);
    rim.position.set(-3, 2, -3);
    scene.add(rim);
    const fill = new THREE.PointLight(0x38bdf8, 0.35, 10);
    fill.position.set(3, -2, 2);
    scene.add(fill);

    // Materials
    const shell = new THREE.MeshPhysicalMaterial({ color: 0xf5f7fb, roughness: 0.28, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15 });
    const visorMat = new THREE.MeshPhysicalMaterial({ color: 0x0b111c, roughness: 0.12, metalness: 0.4, clearcoat: 1, clearcoatRoughness: 0.05 });
    const accent = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35, metalness: 0.3 });
    const glow = new THREE.MeshStandardMaterial({ color: 0xffa94d, emissive: 0xf97316, emissiveIntensity: 1.6, roughness: 0.4 });
    const joint = new THREE.MeshStandardMaterial({ color: 0x8792a6, roughness: 0.4, metalness: 0.6 });

    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.4;
    robotGroup.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), shell);
    head.scale.set(1.15, 0.95, 1);
    headGroup.add(head);

    const visor = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), visorMat);
    visor.scale.set(0.85, 0.6, 0.5);
    visor.position.z = 0.55;
    headGroup.add(visor);

    const eyeGeo = new THREE.SphereGeometry(0.13, 24, 24);
    const eyes = [-0.3, 0.3].map((x) => {
      const eye = new THREE.Mesh(eyeGeo, glow);
      eye.position.set(x, 0.06, 1.03);
      eye.scale.set(1, 1.35, 0.5);
      headGroup.add(eye);
      return eye;
    });

    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.026, 10, 32, Math.PI), glow);
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.2, 1.03);
    headGroup.add(smile);

    [-1, 1].forEach((side) => {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.16, 32), accent);
      ear.rotation.z = Math.PI / 2;
      ear.position.x = side * 1.13;
      headGroup.add(ear);
      const earCap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24), glow);
      earCap.rotation.z = Math.PI / 2;
      earCap.position.x = side * 1.23;
      headGroup.add(earCap);
    });

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 12), joint);
    antenna.position.y = 1.1;
    headGroup.add(antenna);
    const antennaBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 24), glow);
    antennaBall.position.y = 1.33;
    headGroup.add(antennaBall);

    // Neck & body
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.2, 24), joint);
    neck.position.y = -0.6;
    robotGroup.add(neck);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 40, 40), shell);
    body.scale.set(1, 0.85, 0.85);
    body.position.y = -1.15;
    robotGroup.add(body);

    const chest = new THREE.Mesh(new THREE.CircleGeometry(0.13, 32), glow);
    chest.position.set(0, -1.05, 0.6);
    robotGroup.add(chest);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.045, 12, 48), accent);
    belt.rotation.x = Math.PI / 2;
    belt.scale.set(1, 0.85, 1);
    belt.position.y = -1.2;
    robotGroup.add(belt);

    // Arms (pivot at the shoulder)
    const arms = [-1, 1].map((side) => {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.68, -0.92, 0);
      const arm = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 24), shell);
      arm.scale.set(0.17, 0.36, 0.17);
      arm.position.y = -0.3;
      pivot.add(arm);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), accent);
      hand.position.y = -0.66;
      pivot.add(hand);
      pivot.rotation.z = side * 0.28;
      robotGroup.add(pivot);
      return { pivot, side };
    });

    // Soft shadow disc
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.75, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.85;
    scene.add(shadow);

    /* ---- framing (full body in launcher, portrait in header) ---- */
    const framings = {
      full: { y: -0.2, dist: 7.6 },
      portrait: { y: 0.15, dist: 6.2 }
    };
    let camTarget = framings.full;
    const camState = { y: camTarget.y, dist: camTarget.dist };

    /* ---- interaction state ---- */
    const pointer = { x: 0, y: 0 };
    let mood = 'idle';
    let waveUntil = 0;
    let nextBlink = performance.now() + 2500;
    let blinkStart = -1;

    window.addEventListener('pointermove', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      pointer.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
      pointer.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
    }, { passive: true });

    function resize() {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container);
    resize();

    const lerp = (a, b, t) => a + (b - a) * t;
    const clock = new THREE.Clock();
    let running = true;

    function frame() {
      if (!running) return;
      requestAnimationFrame(frame);

      const t = clock.getElapsedTime();
      const now = performance.now();
      const motion = reducedMotion ? 0.25 : 1;

      // Float
      robotGroup.position.y = Math.sin(t * 1.6) * 0.08 * motion;
      shadow.scale.setScalar(1 - Math.sin(t * 1.6) * 0.06 * motion);

      // Look toward the cursor; tilt when thinking
      const thinking = mood === 'thinking';
      const targetYaw = pointer.x * 0.55 + (thinking ? Math.sin(t * 1.5) * 0.15 : 0);
      const targetPitch = pointer.y * 0.3 + (thinking ? -0.12 : 0);
      const targetRoll = thinking ? 0.16 : Math.sin(t * 0.8) * 0.03 * motion;
      headGroup.rotation.y = lerp(headGroup.rotation.y, targetYaw, 0.08);
      headGroup.rotation.x = lerp(headGroup.rotation.x, targetPitch, 0.08);
      headGroup.rotation.z = lerp(headGroup.rotation.z, targetRoll, 0.06);
      robotGroup.rotation.y = lerp(robotGroup.rotation.y, pointer.x * 0.25, 0.05);

      // Blink
      if (blinkStart < 0 && now > nextBlink) blinkStart = now;
      let eyeScaleY = 1.35;
      if (blinkStart >= 0) {
        const p = (now - blinkStart) / 160;
        if (p >= 1) {
          blinkStart = -1;
          nextBlink = now + 2200 + Math.random() * 3000;
        } else {
          eyeScaleY = 1.35 * Math.abs(Math.cos(p * Math.PI));
        }
      }
      if (mood === 'talking') eyeScaleY *= 0.85 + Math.abs(Math.sin(t * 9)) * 0.15;
      eyes.forEach((eye) => { eye.scale.y = Math.max(0.12, eyeScaleY); });

      // Glow pulse
      glow.emissiveIntensity = thinking ? 1.2 + Math.abs(Math.sin(t * 6)) * 1.4 : 1.5 + Math.sin(t * 2) * 0.2;
      antennaBall.scale.setScalar(thinking ? 1 + Math.abs(Math.sin(t * 6)) * 0.35 : 1);
      smile.scale.y = mood === 'talking' ? 1 + Math.abs(Math.sin(t * 12)) * 0.6 : 1;

      // Arms: wave or idle sway
      arms.forEach(({ pivot, side }) => {
        let target = side * (0.28 + Math.sin(t * 1.6 + side) * 0.05 * motion);
        if (side === 1 && now < waveUntil) {
          target = 2.5 + Math.sin(t * 12) * 0.35;
        } else if (thinking && side === -1) {
          target = 2.4; // hand to chin
        }
        pivot.rotation.z = lerp(pivot.rotation.z, target, 0.15);
      });

      // Camera framing
      camState.y = lerp(camState.y, camTarget.y, 0.1);
      camState.dist = lerp(camState.dist, camTarget.dist, 0.1);
      camera.position.set(0, camState.y + 0.2, camState.dist);
      camera.lookAt(0, camState.y, 0);

      renderer.render(scene, camera);
    }

    document.addEventListener('visibilitychange', () => {
      const wasRunning = running;
      running = !document.hidden;
      if (running && !wasRunning) {
        clock.getDelta();
        frame();
      }
    });

    frame();

    return {
      setMood(m) { mood = m; },
      setFraming(name, instant) {
        camTarget = framings[name] || framings.full;
        if (instant) {
          camState.y = camTarget.y;
          camState.dist = camTarget.dist;
        }
        requestAnimationFrame(resize);
      },
      wave() {
        if (!reducedMotion) waveUntil = performance.now() + 1800;
      }
    };
  }

  /* ------------------------------------------------------------------------
     Init
     ------------------------------------------------------------------------ */
  renderConversation();
})();
