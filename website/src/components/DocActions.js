import React, {useState} from 'react';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Toolbar rendered at the top of every doc page: Ask Echo + "open in AI" deep links.
export default function DocActions() {
  const {siteConfig} = useDocusaurusContext();
  const {pathname} = useLocation();
  const [copied, setCopied] = useState(false);

  const url = (siteConfig.url || '') + (pathname || '');
  const prompt =
    `I'm reading the Echo (Go web framework) docs page: ${url} — help me understand it and write example code.`;
  const gpt = 'https://chatgpt.com/?q=' + encodeURIComponent(prompt);
  const claude = 'https://claude.ai/new?q=' + encodeURIComponent(prompt);

  const ask = () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('ask-echo-open'));
  };
  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="doc-actions">
      <button className="doc-act doc-act--primary" onClick={ask}>
        <i className="ph ph-sparkle" /> Ask Echo
      </button>
      <button className="doc-act" onClick={copy}>
        <i className={`ph ${copied ? 'ph-check' : 'ph-copy'}`} /> {copied ? 'Copied' : 'Copy'}
      </button>
      <a className="doc-act" href={gpt} target="_blank" rel="noopener noreferrer">
        <i className="ph ph-chat-circle-dots" /> ChatGPT
      </a>
      <a className="doc-act" href={claude} target="_blank" rel="noopener noreferrer">
        <i className="ph ph-asterisk" /> Claude
      </a>
    </div>
  );
}
