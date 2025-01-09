 ## What is it?

Assistant is a draggable chat assistant component with a floating bubble.

![image](https://github.com/user-attachments/assets/abb03434-792a-4b19-b88e-a6e91d60eb92)

Clicking on the cat will expand the chat drawer.

![image](https://github.com/user-attachments/assets/4d396121-ca2d-42ab-828b-80f4a529e278)

## Quick Integration

### Token Acquisition

Visit [https://petercat.ai/](https://petercat.ai/), enter the workspace, and click login.

![image](https://github.com/user-attachments/assets/35bb6659-8a8d-4894-ae4a-4869bffd9967)

Click on the space to add a Q&A bot.

Enter your project address to quickly generate a bot.

![image](https://github.com/user-attachments/assets/4aac8b0f-52ce-4198-b4d5-90afbfbd6fed)

You can get the token here.

![image](https://github.com/user-attachments/assets/36d8132a-23ed-4582-b45b-94ac9b15f34d)

### Code Import

```zsh
npm install @petercatai/assistant
```

```tsx
import { Assistant } from '@petercatai/assistant';
import '@petercatai/assistant/style';

const YourPetercataiAssistant = () => {
  return <Assistant token="<your token>" showBubble={true} isVisible={false} apiDomain="https://api.petercat.ai" />;
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

### Next.js Integration
> Server-side rendering needs to be disabled.

```tsx
import dynamic from 'next/dynamic';
import '@petercatai/assistant/style';

const Assistant = dynamic(() => import('@petercatai/assistant').then(mod => mod.Assistant), { ssr: false });

// PeterCat AI Assistant: https://petercat.ai/
export const PeterCat = () => {
  return <Assistant token="your token" apiDomain="https://api.petercat.ai" />;
};
```

For more detailed parameters, please refer to the documentation.

[petercat/assistant/src/Assistant/index.md at main · petercat-ai/petercat](https://github.com/petercat-ai/petercat/blob/main/assistant/src/Assistant/index.md#api)

## Others

### UMD Integration

Petercat also supports UMD integration.

1. External and UMD loading resources

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
> Why external?
>
> Smaller, higher cache rate -> Faster user experience

Here is a reference example of an import:

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

2. Loading PeterCat Assistant

```html
<body>
  ...
   <script>
     PetercatLUI.initAssistant({
       apiDomain: 'https://api.petercat.ai',
       token: 'your-token'
     });
  </script>
</body>
```

That's it! Now you can enjoy the assistant component in your project.  
