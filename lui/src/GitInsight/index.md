---
atomId: GitInsight
---

GitInsight 是一个展示 Git 仓库统计信息（包括 Star 数量、Fork 数量和 Commit 数量）的组件。每个统计信息通过 CountCard 组件展示，并带有渐进的动画效果。

# GitInsight

```tsx
import React from 'react';
import { GitInsight } from 'petercat-lui';

export default () => (
  <GitInsight
    forkCount={2122}
    starCount={192123}
    commitCount={320}
  />
);
```
