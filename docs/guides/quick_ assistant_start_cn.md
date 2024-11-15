## 是什么

Assistant 是一个带有浮动气泡和可拖动的聊天助手组件。  
![image](../imgs/image.png)

点击小猫后会展开聊天抽屉

![image-1](../imgs/image-1.png)

## 快速接入

### Token 获取

来到 [https://petercat.ai/](https://petercat.ai/) 进入工作台点击登陆

![image-2](../imgs/image-2.png)

点击空间添加答疑机器人

输入你的项目地址,可快速生成机器人

![image-3](../imgs/image-3.png)

token 可在这里获取

![image-4](../imgs/image-4.png)

### 代码引入

```zsh
npm install @petercatai/assitant
```

```tsx
import { Assistant } from '@petercatai/assistant';
import '@petercatai/assistant/style';

const YourPetercataiAssistant = () => {
  return <Assistant token="< 你的 token >" />;
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

更详细的入参请参考文档

[petercat/assistant/src/Assistant/index.md at main · petercat-ai/petercat](https://github.com/petercat-ai/petercat/blob/main/assistant/src/Assistant/index.md#api)

## 其他

### UMD 接入

petercat 同时支持 UMD 的接入方式

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
  <script src="https://cdn.jsdelivr.net/npm/react/umd/react.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs/dayjs.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/antd/dist/antd.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lottie-web/build/player/lottie.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@petercatai/assistant@1.0.7/dist/umd/assistant.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@petercatai/assistant@1.0.7/dist/umd/assistant.min.css">
</head>
```

2. 加载 PetercatLUI

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
