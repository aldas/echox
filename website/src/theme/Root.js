import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Root wraps the whole app — mount the global Ask Echo command palette (⌘K) here.
export default function Root({children}) {
  return (
    <>
      {children}
      <BrowserOnly>{() => {
        const AskEcho = require('@site/src/components/AskEcho').default;
        return <AskEcho />;
      }}</BrowserOnly>
    </>
  );
}
