
```jsx
import React, { useEffect, useState } from 'react';
import { Chat } from 'petercat-lui';

export default () => {
  const [res, setRes] = useState({});

  useEffect(() => {
    console.log('res', res);
  }, [res]);

  return (
    <div style={{ height: '100vh' }}>
      <Chat
        apiUrl="/api/chat/stream_builder"
        hideLogo="true"
        getToolsResult={setRes}
      />
    </div>
  );
};
```
