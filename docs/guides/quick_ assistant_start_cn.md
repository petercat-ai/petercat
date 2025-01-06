## 是什么

Assistant 是一个带有浮动气泡和可拖动的聊天助手组件。  
![image](https://github.com/user-attachments/assets/abb03434-792a-4b19-b88e-a6e91d60eb92)

点击小猫后会展开聊天抽屉

![image](https://github.com/user-attachments/assets/4d396121-ca2d-42ab-828b-80f4a529e278)

## 快速接入

### Token 获取

来到 [https://petercat.ai/](https://petercat.ai/) 进入工作台点击登陆

![image](https://github.com/user-attachments/assets/35bb6659-8a8d-4894-ae4a-4869bffd9967)

点击空间添加答疑机器人

输入你的项目地址,可快速生成机器人

![image](https://github.com/user-attachments/assets/4aac8b0f-52ce-4198-b4d5-90afbfbd6fed)

token 可在这里获取

![image](https://github.com/user-attachments/assets/36d8132a-23ed-4582-b45b-94ac9b15f34d)

### 代码引入

```zsh
npm install @petercatai/assistant
```

```tsx
import { Assistant } from '@petercatai/assistant';
import '@petercatai/assistant/style';

const YourPetercataiAssistant = () => {
  return <Assistant token="your token" apiDomain="https://api.petercat.ai" />;
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* ... */}
      <YourPetercataiAssistant />
    </>
  );
}
```

#### Next.js 接入

> 需要禁用服务端渲染

```tsx
import dynamic from 'next/dynamic';
import '@petercatai/assistant/style';

const Assistant = dynamic(() => import('@petercatai/assistant').then(mod => mod.Assistant), { ssr: false });

// PeterCat AI Assistant: https://petercat.ai/
export const PeterCat = () => {
  return <Assistant token="your token" apiDomain="https://api.petercat.ai" />;
};


```


更详细的入参请参考文档

[petercat/assistant/src/Assistant/index.md at main · petercat-ai/petercat](https://github.com/petercat-ai/petercat/blob/main/assistant/src/Assistant/index.md#api)

## 其他

### UMD 接入

PeterCat 同时支持 UMD 的接入方式

1. external 和 UMD 加载资源

```js
// example for umi project
// .umirc.ts
export default {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    dayjs: 'dayjs',
    'lottie-web': 'lottie',
  },
};
```

> [!NOTE]
> Why external ?
>
> 更小、提高 cache 率 -> 更快的用户体验

下面是一个引入的参考例子

```html
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@petercatai/assistant/dist/umd/assistant.min.css"></link>
  <script src="https://cdn.jsdelivr.net/npm/react/umd/react.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs/dayjs.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/antd/dist/antd.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lottie-web/build/player/lottie.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@petercatai/assistant/dist/umd/assistant.min.js"></script>
</head>
```

2. 加载 PeterCat Assistant

```html
<body>
  ...
   <script>
     PetercatLUI.initAssistant({
       apiDomain: 'https://api.petercat.ai',
       token: 'your-token',
       starters: ['介绍下这个项目', '查看贡献指南', '我该怎样快速上手'],
       clearMessage: true
     });
  </script>
</body>
```

就是这样！现在您可以在您的项目中享受助手组件了。
