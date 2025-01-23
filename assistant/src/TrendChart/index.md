
# TrendChart

TrendChart 是一个展示数据趋势的组件，可以按照年、季度、月的维度展示数据的变化情况。

## 安装

确保你已经安装了必要的依赖：

```bash
npm install @petercatai/assistant
```

## 使用示例
###  折线图

```tsx
import React from 'react';
import { TrendChart } from '@petercatai/assistant';

export default () => {
  const data = {
    year: [
      { type: 'open', date: '2024', value: 132 },
      { type: 'close', date: '2024', value: 124 },
      { type: 'comment', date: '2024', value: 815 },
    ],
    quarter: [
      { type: 'open', date: '2024Q3', value: 20 },
      { type: 'close', date: '2024Q3', value: 22 },
      { type: 'comment', date: '2024Q3', value: 352 },
      { type: 'open', date: '2024Q4', value: 112 },
      { type: 'close', date: '2024Q4', value: 102 },
      { type: 'comment', date: '2024Q4', value: 463 },
    ],
    month: [
      { type: 'open', date: '2024-09', value: 20 },
      { type: 'close', date: '2024-09', value: 22 },
      { type: 'comment', date: '2024-09', value: 350 },
      { type: 'open', date: '2024-10', value: 16 },
      { type: 'close', date: '2024-10', value: 11 },
      { type: 'comment', date: '2024-10', value: 69 },
      { type: 'open', date: '2024-11', value: 50 },
      { type: 'close', date: '2024-11', value: 32 },
      { type: 'comment', date: '2024-11', value: 162 },
      { type: 'open', date: '2024-12', value: 46 },
      { type: 'close', date: '2024-12', value: 59 },
      { type: 'comment', date: '2024-12', value: 232 },
      { type: 'open', date: '2024-08', value: 0 },
      { type: 'close', date: '2024-08', value: 0 },
      { type: 'comment', date: '2024-08', value: 2 },
    ],
  };

  return <TrendChart data={data} />;
}
```

### 面积图


```tsx
import React from 'react';
import { TrendChart } from '@petercatai/assistant';

export default () => {
 const data ={
    "year": [
      {
        "type": "add",
        "date": "2024",
        "value": 181615
      },
      {
        "type": "remove",
        "date": "2024",
        "value": -238621
      }
    ],
    "quarter": [
      {
        "type": "add",
        "date": "2024Q3",
        "value": 115521
      },
      {
        "type": "remove",
        "date": "2024Q3",
        "value": -96766
      },
      {
        "type": "add",
        "date": "2024Q4",
        "value": 66094
      },
      {
        "type": "remove",
        "date": "2024Q4",
        "value": -141855
      }
    ],
    "month": [
      {
        "type": "add",
        "date": "2024-08",
        "value": 2
      },
      {
        "type": "remove",
        "date": "2024-08",
        "value": -2
      },
      {
        "type": "add",
        "date": "2024-09",
        "value": 115519
      },
      {
        "type": "remove",
        "date": "2024-09",
        "value": -96764
      },
      {
        "type": "add",
        "date": "2024-10",
        "value": 19246
      },
      {
        "type": "remove",
        "date": "2024-10",
        "value": -22630
      },
      {
        "type": "add",
        "date": "2024-11",
        "value": 20128
      },
      {
        "type": "remove",
        "date": "2024-11",
        "value": -14924
      },
      {
        "type": "add",
        "date": "2024-12",
        "value": 26720
      },
      {
        "type": "remove",
        "date": "2024-12",
        "value": -104301
      }
    ]
  };


  return <TrendChart data={data} isArea={true} />;
}
```

