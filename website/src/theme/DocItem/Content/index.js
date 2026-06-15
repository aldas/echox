import React from 'react';
import Content from '@theme-original/DocItem/Content';
import DocActions from '@site/src/components/DocActions';

// Wrap the doc body to render the Ask Echo / AI action toolbar above the content.
export default function ContentWrapper(props) {
  return (
    <>
      <DocActions />
      <Content {...props} />
    </>
  );
}
