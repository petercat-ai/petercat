![Frame 303](https://github.com/user-attachments/assets/01cf3bb2-650a-47a4-88b3-a63f961ae5e2) ![image](https://github.com/user-attachments/assets/77670023-4fab-4ac9-bbe1-c7ea36363e02)

<h1 align="center"> PeterCat</h1>

<div  align="center">

<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> 简体中文 | [English](./README.en-US.md) | [日本語](./README.ja-JP.md)

**专为社区维护者和开发者打造的智能答疑机器人解决方案。**

[![npm](https://img.shields.io/npm/dm/@petercatai/assistant.svg)](https://www.npmjs.com/package/@petercatai/assistant) [![Version](https://img.shields.io/npm/v/petercat-lui/latest.svg)](https://www.npmjs.com/package/petercat-lui) [![DockerHub Version](https://img.shields.io/docker/v/petercatai/petercat?logo=docker&logoColor=white)](https://hub.docker.com/r/petercatai/petercat) [![CI Test Status](https://github.com/petercat-ai/petercat/actions/workflows/pr-tests.yml/badge.svg)](https://github.com/petercat-ai/petercat/actions/workflows/pr-tests.yml) [![codecov](https://codecov.io/github/petercat-ai/petercat/graph/badge.svg?token=2HAO18FB6X)](https://codecov.io/github/petercat-ai/petercat) [![License](https://img.shields.io/badge/License-MIT%40Peter%20Cat-yellow.svg)](https://github.com/petercat-ai/petercat/blob/master/LICENSE)

</div>

## 🏠 主页

[🐱 窝: petercat.ai](https://petercat.ai)

## ✨ 特性

我们提供对话式答疑 Agent 配置系统、自托管部署方案和便捷的一体化应用 SDK，让您能够为自己的 GitHub 仓库一键创建智能答疑机器人，并快速集成到各类官网或项目中， 为社区提供更高效的技术支持生态。

### 对话即创造

仅需要告知你的仓库地址或名称，PeterCat 即可自动完成创建机器人的全部流程

![对话即创造](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*aQ9uRoNZGe8AAAAAAAAAAAAADrPSAQ/original)

### 知识自动入库

机器人创建后，所有相关 Github 文档和 issue 将自动入库，作为机器人的知识依据

![知识自动入库](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*hkkFSaR1UqgAAAAAAAAAAAAADrPSAQ/original)

### 多平台集成

多种集成方式自由选择，如对话应用 SDK 集成至官网，Github APP 一键安装至 Github 仓库等

| ![官网](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*REw3QYgdJ44AAAAAAAAAAAAADrPSAQ/original) | ![GitHub](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*jlYzSqlcpRIAAAAAAAAAAAAADrPSAQ/original) |
| :-: | :-: |

[完整演示视频](https://www.bilibili.com/video/BV1KiHUeFE4p)

### 不止是 QA 机器人

| 项目信息查询 | 回复 Discussion |
| --- | --- |
| ![search_repo](https://github.com/user-attachments/assets/a7e6d37b-4674-4fd0-a89b-678e10ec01c8) | ![ discussion replay](https://github.com/user-attachments/assets/e28a3ded-dc6c-4ba5-9543-05c41bbff331) |

| PR Summary | Code Review |
| --- | --- |
| ![image](https://github.com/user-attachments/assets/28bd546b-0c00-48a2-a57e-982448d37ef2) | ![image](https://github.com/user-attachments/assets/a39c4d71-1368-4508-bca4-018a00549528) ｜ |

| 查 Issue | 提 Issue | 回 Issue |
| --- | --- | --- |
| ![image](https://github.com/user-attachments/assets/501c6ba0-20c4-480f-97ff-1f20d0a99136) | ![image](https://github.com/user-attachments/assets/d020b03d-74cd-49d2-a199-5d21154b7793) | ![image](https://github.com/user-attachments/assets/f6093cb1-b089-4ac9-ad2c-f1c8126fb86b) |

[完整演示视频](https://www.bilibili.com/video/BV12eHUe8EkT/)

## Agent 工作流

我们为猫猫预置了一个创建机器人的机器人，当得到用户 GitHub 仓库地址或名称时，它会使用创建工具，生成该仓库答疑机器人的各项配置（Prompt，、名字、 头像、开场白、引导语、工具集……），同时触发 Issue 和 Markdown 的入库任务。这些任务会拆分为多个子任务，将该仓库的所有已解决 issue 、高票回复以及所有 Markdown 文件内容经过 load -> split -> embed -> store 的加工过程进行知识库构建，作为机器人的回复知识依据。

![Agent workflow](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*m24tTIZpW7cAAAAAAAAAAAAADrPSAQ/original)

## 📦 私有化部署

部署方案：[AWS](https://aws.amazon.com) + [Supabase](https://supabase.com)

你可以在这里看到完整方案：

- [私有化部署 - 本地启动服务](./docs/guides/self_hosted_local_cn.md)
- [私有化部署 - 部署到 AWS ](./docs/guides/self_hosted_aws_cn.md)

![架构方案](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*0_aUTJpyx1YAAAAAAAAAAAAADrPSAQ/original)

[![演示视频](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*spdZSbWsVhkAAAAAAAAAAAAADrPSAQ/fmt.webp)](https://www.youtube.com/watch?v=Al6R9Ye5mBY)

## ⚙️ 环境变量

本项目需要进行环境变量进行设置：

### Client

`.env.local`

| 环境变量 | 类型 | 描述 | 示例 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_DOMAIN` | 必选 | 后端服务的 API 域名。 | `https://api.petercat.ai` |

### Server

`.env`

| 环境变量 | 类型 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 描述 | 示例 |
| --- | --- | --- | --- |
| **应用基础环境变量** |
| `API_URL` | 必选 | 后端服务的 API 域名 | `https://api.petercat.ai` |
| `WEB_URL` | 必选 | 前端 Web 服务的域名 | `https://petercat.ai` |
| `STATIC_URL` | 必选 | 静态资源域名 | `https://static.petercat.ai` |
| **AWS 相关环境变量** |
| `X_GITHUB_SECRET_NAME` | 必选 | AWS 托管的 Github 私钥文件名 | `prod/githubapp/petercat/pem` |
| `STATIC_SECRET_NAME` | 可选 | AWS 托管的 CloudFront 签名私钥名称。如果配置了该项，将使用 CloudFront 签名 URL 来保护你的资源。更多信息请参阅 [AWS 文档](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html)。 | `prod/petercat/static` |
| `LLM_TOKEN_SECRET_NAME` | 可选 | AWS 托管的 llm 签名私钥名称。如果配置了该项，petercat 将使用 RSA 算法托管用户的 LLM Token | `prod/petercat/llm` |
| `LLM_TOKEN_PUBLIC_NAME` | 可选 | AWS 托管的 llm 签名公钥名称。如果配置了该项，petercat 将使用 RSA 算法托管用户的 LLM Token | `prod/petercat/llm/pub` |
| `STATIC_KEYPAIR_ID` | 可选 | AWS CloudFront 的 Key Pair ID。如果配置了该项，将使用 CloudFront 签名 URL 来保护你的资源。更多信息请参阅 [AWS 文档](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html)。 | `APKxxxxxxxx` |
| `S3_TEMP_BUCKET_NAME` | 可选 | 用于托管 AWS 临时图片文件 S3 的 bucket | `xxx-temp` |
| **SUPABASE 相关 env** |
| `SUPABASE_URL` | 必选 | supabase 服务的 URL，可以在[这里](https://supabase.com/dashboard/project/_/settings/database)找到 | `https://***.supabase.co` |
| `SUPABASE_SERVICE_KEY` | 必选 | supabase 服务密钥，可以在[这里](https://supabase.com/dashboard/project/_/settings/database)找到 | `{{SUPABASE_SERVICE_KEY}}` |
| **Auth0 相关 env** |
| `AUTH0_DOMAIN` | 必选 | auth0 服务域名，从 auth0 / Application / Basic Information 下获取 | `petercat.us.auth0.com` |
| `AUTH0_CLIENT_ID` | 必选 | auth0 客户端 ID，从 auth0 / Application / Basic Information 下获取 | `artfiUxxxx` |
| `AUTH0_CLIENT_SECRET` | 必选 | auth0 客户端密钥， 从 auth0 / Application / Basic Information 下获取 | `xxxx-xxxx-xxx` |
| `API_IDENTIFIER` | 必选 | auth0 的 API Identifier | `https://petercat.us.auth0.com/api/v2/` |
| **LLM 相关的 env** |
| `OPENAI_API_KEY` | 必选 | OpenAI 的密钥 | `sk-xxxx` |
| `OPENAI_BASE_URL` | 可选 | API 请求的基础 URL。仅在使用代理或服务模拟器时指定。 | `https://api.openai.com/v1` |
| `GEMINI_API_KEY` | 可选 | Gemini 的密钥 | `xxxx` |
| `TAVILY_API_KEY` | 可选 | Tavily 的密钥；`auto` 模式下配置此密钥时使用 Tavily | `tvly-xxxxx` |
| `WEB_SEARCH_PROVIDER` | 可选 | 网页搜索提供方：`auto`（默认）、`parallel`、`tavily` 或 `none` | `auto` |
| **注册为 Github App 的 env** |
| `X_GITHUB_APP_ID` | 可选 | 注册为 Github App 时，APPID | `123456` |
| `X_GITHUB_APPS_CLIENT_ID` | 可选 | 注册为 Github App 时，APP 的 Client ID | `Iv1.xxxxxxx` |
| `X_GITHUB_APPS_CLIENT_SECRET` | 可选 | 注册为 Github App 时，APP 的 Client 密钥 | `xxxxxxxx` |
| **限流配置** |
| `RATE_LIMIT_ENABLED` | 可选 | 限流配置是否开启 | `True` |
| `RATE_LIMIT_REQUESTS` | 可选 | 限流的请求数量 | `100` |
| `RATE_LIMIT_DURATION` | 可选 | 限流的统计时长，单位为分钟 | `1` |
| **RAG 服务配置** |
| `WHISKER_API_URL` | 必选 | WHISKER RAG 服务地址   | `http://....` |
| `WHISKER_API_KEY` | 必选 | WHISKER RAG 服务的 KEY | `sk-xxxx` |

### 网页搜索

启用网页搜索且未配置 `TAVILY_API_KEY` 时，PeterCat 默认通过
[Parallel Search MCP](https://docs.parallel.ai/integrations/mcp/search-mcp)
提供免费的 Fast 模式搜索和网页内容提取，无需账号或 API Key。匿名服务有使用频率限制。
查询与网页 URL 会发送给所选提供方；工具调用的总超时为 30 秒，并支持取消。

`WEB_SEARCH_PROVIDER=auto` 会保留已配置的 Tavily。可以设为 `parallel` 或 `tavily`
明确选择提供方，设为 `none` 禁用网页搜索。现有的 `AgentBuilder(enable_tavily=False)`
也会禁用所有网页搜索工具。提供方调用失败时不会自动切换。当前集成仅支持匿名 Parallel
访问，不读取 Parallel API Key。聊天 API 没有持久的对话 ID，因此不会发送可选的
Parallel 对话标识。更新后请重新安装 `server/requirements.txt` 中的依赖。

## 🤝 参与贡献

> PeterCat 使用 yarn 作为包管理器

```bash
git clone https://github.com/petercat-ai/petercat.git

# 安装依赖
yarn run bootstrap

# 调试 client
yarn run client

# 调试 assistant
yarn run assistant

# 调试 server
yarn run server

# 本地启动网站
yarn run client:server

# 本地启动 assistant 组件
yarn run assistant:server

# assistant 构建
cd assistant
yarn run build
npm publish

# docker 构建
yarn run build:docker

# pypi 构建
yarn run build:pypi
yarn run publish:pypi

```

## 💼 企业版接入

请把您的项目地址，使用场景，使用频率等信息发送至 [petercat.assistant@gmail.com ](petercat.assistant@gmail.com)

## 📧 反馈问题

猫猫还在养成阶段，难免有些 “小脾气”，遇到问题请对它宽容一些，可以通过以下两种途径告知铲屎官：

- [提交 Issue](https://github.com/petercat-ai/petercat/issues/new/choose)
- [Discussions](https://github.com/petercat-ai/petercat/discussions) 提问

## 👬 Contributors

![https://github.com/petercat-ai/petercat/graphs/contributors](https://contrib.rocks/image?repo=petercat-ai/petercat)

## 💗 Sponsor

[Ant Design](https://ant.design/)

## 📄 License

MIT@[PeterCat](https://github.com/petercat-ai/petercat/blob/main/LICENSE)
