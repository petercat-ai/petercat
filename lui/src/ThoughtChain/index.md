---
atomId: ThoughtChain
---

# ThoughtChain

```tsx
import React from 'react';
import { ThoughtChain } from 'petercat-lui';

export default () => (
  <ThoughtChain
    content={[
      {
        source: '已搜索知识库',
        knowledgeName: '测试知识库',
        status: 'success' as Status,
        timeCost: '0.6s',
        children: `recall slice 1:
          test：test`,
      },
      {
        source: '已调用必应搜索',
        pluginName: '必应搜索',
        status: 'success' as Status,
        timeCost: '4.3s：模型3.4s | 工具0.9s',
        children: `{"code":0,"data":{"_type":"SearchResponse","images":{"id":"","isFamilyFriendly":false,"readLink":"","value":null,"webSearchUrl":""},"queryContext":{"originalQuery":"杭州天气"},"rankingResponse":{"mainline":{"items":[{"answerType":"WebPages","value":{"id":"https://api.bing.microsoft.com/api/v7/#WebPages.0"}},{"answerType":"WebPages","resultIndex":1,"value":{"id":"https://api.bing.microsoft.com/api/v7/#WebPages.1"}},{"answerType":"WebPages","resultIndex":2,"value":{"id":"https://api.bing.microsoft.com/api/v7/#WebPages.2"}},{"answerType":"WebPages","resultIndex":3,"value":{"id":"https://api.bing.microsoft.com/api/v7/#WebPages.3"}},{"answerType":"WebPages","resultIndex":4,"value":{"id":"https://api.bing.microsoft.com/api/v7/#WebPages.4"}},`,
      },
    ]}
    status={'success'}
    source={'运行完毕'}
    timeCost={'4.9s（LLM 3.4s｜插件 0.9s｜知识库 0.6s）'}
  />
);
```
