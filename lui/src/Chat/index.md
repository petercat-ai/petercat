
```jsx
import React from 'react';
import { Chat } from 'petercat-lui';


export default () => (
  <div style={{ height: '100vh' }}>
    <Chat
      starters={['test1', 'test2', 'test3']}
      token="2997bf16-ee7a-4d0b-94f0-e5a7d9da4054"
      prompt="你是一只小鸭子，只会嘎嘎嘎"
      assistantMeta={{
        avatar:
          'https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*YAP3SI7MMHQAAAAAAAAAAAAADrPSAQ/original',
        title: 'PeterCat',
      }}
    />
  </div>
);
```
