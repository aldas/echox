import React, {useState, useEffect, useRef, useCallback} from 'react';

// Quick-start prompts shown before the user types.
const SUGGESTIONS = [
  {icon: 'ph-lock-key', q: 'How do I add JWT authentication?'},
  {icon: 'ph-globe', q: 'How do I enable CORS?'},
  {icon: 'ph-link', q: 'How do I bind a JSON request body?'},
  {icon: 'ph-folder-open', q: 'How do I serve static files?'},
];

// Demo answer used by the prototype. To make this real, replace `streamAnswer`
// with a call to your RAG provider, e.g. kapa.ai:
//   const r = await fetch('https://api.kapa.ai/query/v1/projects/<id>/chat/',
//     {method:'POST', headers:{'X-API-KEY': KEY,'Content-Type':'application/json'},
//      body: JSON.stringify({query})});
// then stream r.body. The UI below is provider-agnostic.
const DEMO_ANSWER =
`To add JWT authentication, use Echo's built-in <strong>JWT middleware</strong>. Register it on the routes (or group) you want to protect:

<pre><code>import echojwt "github.com/labstack/echo-jwt/v4"

e.Use(echojwt.WithConfig(echojwt.Config{
    SigningKey: []byte("your-secret"),
}))</code></pre>

Requests must then send <code>Authorization: Bearer &lt;token&gt;</code>. Inside a handler, read claims via <code>c.Get("user")</code>. For login, issue a token with <strong>github.com/golang-jwt/jwt/v5</strong>.`;

const SOURCES = [
  'Guide › Middleware › JWT',
  'Cookbook › JWT Authentication',
  'API › echo-jwt',
];

export default function AskEcho() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [thinking, setThinking] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);
  const timer = useRef(null);

  const reset = () => {
    setQuery(''); setAnswer(''); setThinking(false); setDone(false);
    if (timer.current) clearInterval(timer.current);
  };
  const close = useCallback(() => { setOpen(false); reset(); }, []);
  const openPalette = useCallback(() => { reset(); setOpen(true); }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => { if (o) reset(); return !o; });
      }
      if (e.key === 'Escape') close();
    };
    const onOpen = () => openPalette();
    window.addEventListener('keydown', onKey);
    window.addEventListener('ask-echo-open', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('ask-echo-open', onOpen);
      if (timer.current) clearInterval(timer.current);
    };
  }, [close, openPalette]);

  useEffect(() => {
    if (open && inputRef.current) setTimeout(() => inputRef.current.focus(), 40);
  }, [open]);

  // Typewriter stream of the (demo) answer.
  const ask = (q) => {
    setQuery(q); setThinking(true); setAnswer(''); setDone(false);
    if (timer.current) clearInterval(timer.current);
    setTimeout(() => {
      setThinking(false);
      let i = 0;
      timer.current = setInterval(() => {
        i += 5;
        setAnswer(DEMO_ANSWER.slice(0, i));
        if (i >= DEMO_ANSWER.length) {
          clearInterval(timer.current);
          setAnswer(DEMO_ANSWER);
          setDone(true);
        }
      }, 12);
    }, 450);
  };

  if (!open) {
    return (
      <button className="ask-fab" onClick={openPalette} aria-label="Ask Echo">
        <i className="ph ph-sparkle" /> Ask Echo <kbd>⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="ask-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="ask-palette" role="dialog" aria-label="Ask Echo">
        <div className="ask-top">
          <i className="ph ph-sparkle ask-spark" />
          <input
            ref={inputRef}
            className="ask-input"
            placeholder="Ask Echo a question…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) ask(query.trim()); }}
            autoComplete="off"
          />
          <span className="ask-esc">ESC</span>
        </div>

        <div className="ask-body">
          {!answer && !thinking && (
            <div className="ask-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s.q} className="ask-s" onClick={() => ask(s.q)}>
                  <i className={`ph ${s.icon}`} /> {s.q}
                  <span className="ask-k">↵</span>
                </button>
              ))}
            </div>
          )}

          {thinking && (
            <div className="ask-badge"><span className="ask-dot" /> Ask Echo is thinking…</div>
          )}

          {answer && (
            <>
              <div className="ask-badge"><span className="ask-dot" /> Ask Echo</div>
              <div
                className="ask-answer"
                dangerouslySetInnerHTML={{ __html: answer + (done ? '' : '<span class="ask-cursor"></span>') }}
              />
              {done && (
                <div className="ask-sources">
                  <h5>Sources</h5>
                  {SOURCES.map((s, i) => (
                    <div className="ask-src" key={s}><span className="ask-n">{i + 1}</span> {s}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="ask-foot">
          <span><b>↵</b> ask</span><span><b>esc</b> close</span>
          <span style={{marginLeft: 'auto'}}>Powered by <b>Ask Echo</b> · answers in your language</span>
        </div>
      </div>
    </div>
  );
}
