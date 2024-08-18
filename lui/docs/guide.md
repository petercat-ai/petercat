## How to integrate PertercatLUI by UMD way?

Step 1, externalize the following dependencies for your project **if you already used them in your project**:

```ts
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

Step 2, add the following script tag to your entry HTML file:

```diff
...
<head>
+ <script src="https://example.cdn.com/react/umd/react.development.js"></script>
+ <script src="https://example.cdn.com/react-dom/umd/react-dom.development.js"></script>
+ <script src="https://example.cdn.com/dayjs/dayjs.min.js"></script>
+ <script src="https://example.cdn.com/antd/dist/antd.js"></script>
+ <script src="https://example.cdn.com/lottie-web/build/player/lottie.js"></script>
+ <script src="https://example.cdn.com/petercat-lui/dist/umd/petercat-lui.min.js"></script>
+ <link rel="stylesheet" href="https://example.cdn.com/petercat-lui/dist/umd/petercat-lui.min.css">
</head>
...
```

Step 3, render Assistant component in your project:

```diff
<body>
  ...
+  <script>
+    PetercatLUI.initAssistant({
+      apiDomain: 'https://api.petercat.chat',
+      token: 'your-token',
+      starters: ['介绍下这个项目', '查看贡献指南', '我该怎样快速上手'],
+      clearMessage: true
+    });
+ </script>
</body>
```

That's it! Now you can enjoy the Assistant component in your project.
