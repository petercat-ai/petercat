---
atomId: Assistant
---

# Assistant

Assistant 是一个带有浮动气泡和可拖动的聊天助手组件。

## 安装

确保你已经安装了必要的依赖：

```bash
npm install @petercatai/assitant
```

## 使用示例

```tsx
import React from 'react';
import { Assistant } from '@petercatai/assistant';

export default () => (
  <Assistant
    token="009f73bc-f700-44e6-b9b7-2397d46cd086"
    clearMessage={true}
  />
);
```
## API

| 属性名                 | 类型                      | 默认值      | 描述                                                                                 |
| ---------------------- | ------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `showBubble`           | `boolean`                 | `true`      | 是否显示浮动气泡。                                                                   |
| `isVisible`            | `boolean`                 | `false`     | 控制聊天窗口是否可见。                                                               |
| `onClose`              | `() => void`              | `undefined` | 聊天窗口关闭时的回调函数。                                                           |
| `drawerWidth`          | `number`                  | `500`       | 控制聊天窗口的宽度。                                                                 |
| `helloMessage`         | `string`                  | `undefined` | 设定聊天窗口打开时的欢迎消息。                                                       |
| `assistantMeta`        | `MetaData`                | `{}`        | 设置聊天助手的元数据信息，包括头像、标题和背景颜色。                                  |
| `starters`             | `string[]`                | `[]`        | 聊天启动器消息的数组，用户可以选择这些消息来快速开始对话。                           |
| `style`                | `React.CSSProperties`     | `{}`        | 自定义聊天组件的内联样式。                                                           |
| `hideLogo`             | `boolean`                 | `false`     | 是否隐藏聊天窗口顶部的Logo。                                                         |
| `disabled`             | `boolean`                 | `false`     | 是否禁用聊天输入区域，禁用后用户无法输入消息。                                        |
| `disabledPlaceholder`  | `string`                  | `undefined` | 当聊天输入区域被禁用时显示的占位符文本。                                             |
| `getToolsResult`       | `(response: any) => void` | `undefined` | 用于接收工具处理结果的回调函数。                                                     |

