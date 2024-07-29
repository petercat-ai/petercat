<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18">  [English](./README.md) | 简体中文

# 介绍
perter cat 服务端，采用 fastJSON 框架开发。

# 功能模块
## github
### webhook
代码目录

#### 如何测试
1. 先阅读 github webhook 文档
[https://docs.github.com/zh/apps/creating-github-apps/registering-a-github-app/using-webhooks-with-github-apps](https://docs.github.com/zh/apps/creating-github-apps/registering-a-github-app/using-webhooks-with-github-apps)

2. 访问 [smee.io](https://smee.io/) 新建一个 channel,得到形如 https://smee.io/Q2VVS0casGnhZV 的 url 。

3. 本地启动此 server,得到 hook 服务地址
```bash
# 项目根目录启动 server
yarn run server
# 得到 http://127.0.0.1:8000/api/github/app/webhook 
```

4. 执行脚本
```bash
# 安装 smee-client
yarn global add smee-client
# 绑定 channel
smee -u https://smee.io/Q2VVS0casGnhZV -t http://127.0.0.1:8000/api/github/app/webhook 
 ```

5. 访问 [demo repository settings ](https://github.com/ant-xuexiao/demo-repository/settings/installations)
\> 配置 perter-cat 插件 [settings](https://github.com/organizations/ant-xuexiao/settings/apps/petercat-bot) \> 
Webhook URL \> 填入smee channel url, eg: https://smee.io/Q2VVS0casGnhZV 

6. 在 demo repository 发起 issue 或者 pull-request，在 smee 、本地将能同步看到请求。