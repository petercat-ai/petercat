
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
        helloMessage="让我们开始对话吧～"
        starters={['介绍下xxx这个项目', '查看xxx的贡献指南', '我该怎样快速上手']}
        apiUrl="/api/chat/stream_builder"
        hideLogo="true"
        getToolsResult={setRes}
      />
    </div>
  );
};
```
