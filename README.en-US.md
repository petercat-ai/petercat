<img width="1785" alt="image" src="https://github.com/user-attachments/assets/50ae3bb2-e4da-4537-8df0-89a1ce23e800">


# PeterCat

<div align="center">

  <img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18">[简体中文](./README.md) | English | [日本語](./README.ja-JP.md)

  **An intelligent Q&A bot solution specifically designed for community maintainers and developers.**

  [![npm](https://img.shields.io/npm/dm/@petercatai/assistant.svg)](https://www.npmjs.com/package/@petercatai/assistant)
  [![Version](https://img.shields.io/npm/v/petercat-lui/latest.svg)](https://www.npmjs.com/package/petercat-lui)
  [![DockerHub Version](https://img.shields.io/docker/v/petercatai/petercat?logo=docker&logoColor=white)](https://hub.docker.com/r/petercatai/petercat)
  [![CI Test Status](https://github.com/petercat-ai/petercat/actions/workflows/pr-tests.yml/badge.svg)](https://github.com/petercat-ai/petercat/actions/workflows/pr-tests.yml)
  [![codecov](https://codecov.io/github/petercat-ai/petercat/graph/badge.svg?token=2HAO18FB6X)](https://codecov.io/github/petercat-ai/petercat)
  [![License](https://img.shields.io/badge/License-MIT%40Peter%20Cat-yellow.svg)](https://github.com/petercat-ai/petercat/blob/master/LICENSE)
 

</div>

## 🏠 Homepage

[🐱Nest: petercat.ai](https://petercat.ai)

## ✨ Features

We provide a conversational Q&A agent configuration system, self-hosted deployment solutions, and a convenient all-in-one application SDK, allowing you to create intelligent Q&A bots for your GitHub repositories with a single click and quickly integrate them into various official websites or projects, providing a more efficient technical support ecosystem for your community.

### Chatting means creating

You only need to provide the address or name of your repository, and PeterCat will automatically complete the entire process of creating a bot.

![Create with Conversations](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*aQ9uRoNZGe8AAAAAAAAAAAAADrPSAQ/original)

### Automated Knowledge Base

After the bot is created, all relevant GitHub documentation and issues will be automatically added to the knowledge base as the bot's knowledge source.

![Automated Knowledge Base](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*hkkFSaR1UqgAAAAAAAAAAAAADrPSAQ/original)

### Multi-Platform Integration

Various integration options, such as SDK integration into official websites or one-click installation of the GitHub App into GitHub repositories.

| ![Website](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*REw3QYgdJ44AAAAAAAAAAAAADrPSAQ/original) | ![GitHub](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*jlYzSqlcpRIAAAAAAAAAAAAADrPSAQ/original) |
|:----------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------:|

### More than QA Robot

| project information Query                | Discussion Reply                          
| ----------------------------------------- | --------------------------------------- | 
| ![search_repo](https://github.com/user-attachments/assets/a7e6d37b-4674-4fd0-a89b-678e10ec01c8) | ![ discussion replay](https://github.com/user-attachments/assets/e28a3ded-dc6c-4ba5-9543-05c41bbff331)|


| PR Summary       | Code Review     | 
| ----------------------------------------- | --------------------------------------- | 
| ![image](https://github.com/user-attachments/assets/28bd546b-0c00-48a2-a57e-982448d37ef2)| ![image](https://github.com/user-attachments/assets/a39c4d71-1368-4508-bca4-018a00549528) ｜

| Issue Search                          | Issue Submit                             | Issue Reply      | 
| ----------------------------------------- | --------------------------------------- | --------------------------------------- | 
| ![image](https://github.com/user-attachments/assets/501c6ba0-20c4-480f-97ff-1f20d0a99136)| ![image](https://github.com/user-attachments/assets/d020b03d-74cd-49d2-a199-5d21154b7793)| ![image](https://github.com/user-attachments/assets/f6093cb1-b089-4ac9-ad2c-f1c8126fb86b) |

[Watch full video](https://www.youtube.com/watch?v=83Y0_q2Fskk)

## Agent Workflow

![Agent workflow](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*m24tTIZpW7cAAAAAAAAAAAAADrPSAQ/original)

## 📦 Self-Hosted Deployment

Deployment solution: [AWS](https://aws.amazon.com) + [Supabase](https://supabase.com)

Here you can find the complete guides:
- [Self-Hosting - Start the Service Locally](./docs/guides/self_hosted_local.md)
- [Self-Hosting - Deploy to AWS](./docs/guides/self_hosted_aws.md)


![Deployment Solution](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*0_aUTJpyx1YAAAAAAAAAAAAADrPSAQ/original)

[![Self hosted Video](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*spdZSbWsVhkAAAAAAAAAAAAADrPSAQ/fmt.webp)](https://www.youtube.com/watch?v=Al6R9Ye5mBY)


## ⚙️ Environment Variables

The project requires environment variables to be set:

### Client
`.env.local`

| Environment Variable       | Type    | Description                                      | Example                                     |
|----------------------------|---------|--------------------------------------------------|---------------------------------------------|
| `NEXT_PUBLIC_API_DOMAIN`    | Required | API domain of the backend service                | `https://api.petercat.ai`                   |


### Server

`.env`

| Environment Variable       | Type                                       | Description                                   | Example                                     |
|----------------------------|--------------------------------------------|-----------------------------------------------|---------------------------------------------|
| **Basic Application Environment Variables**                             |
| `API_URL`                  | Required                                   | API domain of the backend service             | `https://api.petercat.ai`                   |
| `WEB_URL`                  | Required                                   | Domain of the frontend web service            | `https://petercat.ai`                       |
| `STATIC_URL`               | Required                                   | Static resource domain                        | `https://static.petercat.ai`                |
| **AWS Related Environment Variables**                                  |
| `AWS_GITHUB_SECRET_NAME`          | Required                                   | AWS secret file name                          | `prod/githubapp/petercat/pem`               |
| `AWS_STATIC_SECRET_NAME` | Optional | The name of the AWS-managed CloudFront private key. If configured, CloudFront signed URLs will be used to protect your resources. For more information, see the [AWS documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html). | `prod/petercat/static` |
| `AWS_LLM_TOKEN_SECRET_NAME` | Optional | The name of the LLM signing private key managed by AWS. If configured, Petercat will use the RSA algorithm to manage the user's LLM Token. | `prod/petercat/llm` |
| `AWS_LLM_TOKEN_PUBLIC_NAME` | Optional | The name of the LLM signing public key managed by AWS. If configured, Petercat will use the RSA algorithm to manage the user's LLM Token. | `prod/petercat/llm/pub` |
| `AWS_STATIC_KEYPAIR_ID` | Optional | The Key Pair ID for AWS CloudFront. If configured, CloudFront signed URLs will be used to protect your resources. For more information, see the [AWS documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html). | `APKxxxxxxxx` |
| `S3_TEMP_BUCKET_NAME`      | Required                                   | AWS S3 bucket for temporary image files                 | `xxx-temp`                                  |
| `SQS_QUEUE_URL`            | Required                                   | AWS SQS queue URL                             | `https://sqs.ap-northeast-1.amazonaws.com/xxx/petercat-task-queue` |
| **Supabase Related Environment Variables**                              |
| `SUPABASE_URL`             | Required                                   | Supabase service URL, found [here](https://supabase.com/dashboard/project/_/settings/database) | `https://***.supabase.co`                   |
| `SUPABASE_SERVICE_KEY`     | Required                                   | Supabase service key, found [here](https://supabase.com/dashboard/project/_/settings/database) | `{{SUPABASE_SERVICE_KEY}}`                  |
| **Auth0 Related Environment Variables**                                 |
| `AUTH0_DOMAIN`             | Required                                   | Auth0 domain, from Auth0 / Application / Basic Information | `petercat.us.auth0.com`                     |
| `AUTH0_CLIENT_ID`          | Required                                   | Auth0 Client ID, from Auth0 / Application / Basic Information | `artfiUxxxx`                                |
| `AUTH0_CLIENT_SECRET`      | Required                                   | Auth0 Client Secret, from Auth0 / Application / Basic Information | `xxxx-xxxx-xxx`                             |
| `API_IDENTIFIER`           | Required                                   | Auth0 API Identifier                           | `https://petercat.us.auth0.com/api/v2/`     |
| **LLM Related Environment Variables**                                   |
| `OPENAI_API_KEY`           | Required                                   | OpenAI API key                                 | `sk-xxxx`                                   |
| `OPENAI_BASE_URL`          | Optional                                   | Base URL for API requests. Only specify if using a proxy or service emulator.     | `https://api.openai.com/v1`
| `GEMINI_API_KEY`           | Optional                                   | Gemini API key                                 | `xxxx`                                      |
| `TAVILY_API_KEY`           | Optional                                   | Tavily API key                                 | `tvly-xxxxx`                                |
| **GitHub App Registration Environment Variables**                       |
| `X_GITHUB_APP_ID`          | Optional                                   | GitHub App ID                                  | `123456`                                    |
| `X_GITHUB_APPS_CLIENT_ID`  | Optional                                   | GitHub App Client ID                           | `Iv1.xxxxxxx`                               |
| `X_GITHUB_APPS_CLIENT_SECRET` | Optional                               | GitHub App Client Secret                       | `xxxxxxxx`                                  |
| **Rate Limiting Configuration**                                         |
| `RATE_LIMIT_ENABLED`       | Optional                                   | Whether rate limiting is enabled               | `True`                                      |
| `RATE_LIMIT_REQUESTS`      | Optional                                   | Number of requests for rate limiting           | `100`                                       |
| `RATE_LIMIT_DURATION`      | Optional                                   | Duration for rate limiting (in minutes)        | `1`                                         |

## 🤝 Contributing

> PeterCat uses yarn as the package manager.

```bash
git clone https://github.com/petercat-ai/petercat.git

# Install dependencies
yarn run bootstrap

# Debug client
yarn run client

# Debug assistant
yarn run assistant

# Debug server
yarn run server

# Start website locally
yarn run client:server

# Start assistant component locally
yarn run assistant:server

# Build assistant
cd assistant
yarn run build
npm publish

# Docker build
yarn run build:docker

# PyPI build
yarn run build:pypi
yarn run publish:pypi
```


## 💼 Enterprise Integration

Please send your project address, usage scenarios, usage frequency, and other information to [antd.antgroup@gmail.com](antd.antgroup@gmail.com) 

## 📧 Reporting Issues

PeterCat is still in its growth stage, and occasional “tantrums” are to be expected. Please report issues via the following channels:

* [Submit an Issue(https://github.com/petercat-ai/petercat/issues/new/choose)
*  [Discussions](https://github.com/petercat-ai/petercat/discussions) 

👬 Contributors

![https://github.com/petercat-ai/petercat/graphs/contributors](https://contrib.rocks/image?repo=petercat-ai/petercat)

## 💗 Sponsor

[Ant Design](https://ant.design/)

## 📄 License

MIT@[PeterCat](https://github.com/petercat-ai/petercat/blob/main/LICENSE)
