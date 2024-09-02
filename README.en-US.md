![banner](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*m23lS7sVRDgAAAAAAAAAAAAADrPSAQ/original)

# Peter Cat

<div align="center">

  <img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [Simplified Chinese](./README.md) | English

  **An intelligent Q&A bot solution specifically designed for community maintainers and developers.**

 [![npm](https://img.shields.io/npm/dm/petercat-lui.svg)](https://www.npmjs.com/package/petercat-lui)
  [![Version](https://img.shields.io/npm/v/petercat-lui/latest.svg)](https://www.npmjs.com/package/petercat-lui)
  [![DockerHub Version](https://img.shields.io/docker/v/petercatai/petercat?logo=docker&logoColor=white)](https://hub.docker.com/r/petercatai/petercat)
  [![CI Test Status](https://github.com/petercat-ai/petercat/actions/workflows/pr-tests.yml/badge.svg)](https://github.com/petercat-ai/petercat/actions/workflows/pr-tests.yml)
  [![License](https://img.shields.io/badge/License-MIT%40Peter%20Cat-yellow.svg)](https://github.com/petercat-ai/petercat/blob/master/LICENSE)
 

</div>

## 🏠 Homepage

[🐱Nest: petercat.ai](https://www.petercat.ai)

## ✨ Features

We provide a conversational Q&A agent configuration system, self-hosted deployment solutions, and a convenient all-in-one application SDK, allowing you to create intelligent Q&A bots for your GitHub repositories with a single click and quickly integrate them into various official websites or projects, providing a more efficient technical support ecosystem for your community.

### Create with Conversations

You only need to provide the address or name of your repository, and Peter Cat will automatically complete the entire process of creating a bot.

![Create with Conversations](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*aQ9uRoNZGe8AAAAAAAAAAAAADrPSAQ/original)

### Automated Knowledge Base

After the bot is created, all relevant GitHub documentation and issues will be automatically added to the knowledge base as the bot's knowledge source.

![Automated Knowledge Base](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*hkkFSaR1UqgAAAAAAAAAAAAADrPSAQ/original)

### Multi-Platform Integration

Various integration options, such as SDK integration into official websites or one-click installation of the GitHub App into GitHub repositories.

| ![Website](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*REw3QYgdJ44AAAAAAAAAAAAADrPSAQ/original) | ![GitHub](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*jlYzSqlcpRIAAAAAAAAAAAAADrPSAQ/original) |
|:----------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------:|

## Agent Workflow

![Agent workflow](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*m24tTIZpW7cAAAAAAAAAAAAADrPSAQ/original)

## 📦 Self-Hosted Deployment

Deployment solution: [AWS](https://aws.amazon.com) + [Supabase](https://supabase.com)

![Deployment Solution](https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*0_aUTJpyx1YAAAAAAAAAAAAADrPSAQ/original)

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
| `AWS_REGION_NAME`          | Required                                   | AWS Region for deployment                     | `ap-northeast-1`                            |
| `AWS_SECRET_NAME`          | Required                                   | AWS secret file name                          | `prod/githubapp/petercat/pem`               |
| `S3_BUCKET_NAME`           | Required                                   | AWS S3 bucket for image files                 | `xxx-temp`                                  |
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
| `GEMINI_API_KEY`           | Required                                   | Gemini API key                                 | `xxxx`                                      |
| `TAVILY_API_KEY`           | Required                                   | Tavily API key                                 | `tvly-xxxxx`                                |
| **GitHub App Registration Environment Variables**                       |
| `X_GITHUB_APP_ID`          | Optional                                   | GitHub App ID                                  | `123456`                                    |
| `X_GITHUB_APPS_CLIENT_ID`  | Optional                                   | GitHub App Client ID                           | `Iv1.xxxxxxx`                               |
| `X_GITHUB_APPS_CLIENT_SECRET` | Optional                               | GitHub App Client Secret                       | `xxxxxxxx`                                  |
| **Rate Limiting Configuration**                                         |
| `RATE_LIMIT_ENABLED`       | Optional                                   | Whether rate limiting is enabled               | `True`                                      |
| `RATE_LIMIT_REQUESTS`      | Optional                                   | Number of requests for rate limiting           | `100`                                       |
| `RATE_LIMIT_DURATION`      | Optional                                   | Duration for rate limiting (in minutes)        | `1`                                         |

## 🤝 Contributing

> Peter Cat uses yarn as the package manager.

```bash
git clone https://github.com/petercat-ai/petercat.git

# Install dependencies
yarn run bootstrap

# Debug client
yarn run client

# Debug lui
yarn run lui

# Debug server
yarn run server

# Start website locally
yarn run client:server

# Start lui component locally
yarn run lui:server

# Build lui
cd lui
yarn run build
npm publish

# Docker build
yarn run build:docker

# PyPI build
yarn run build:pypi
yarn run publish:pypi
```


## 💼 Enterprise Integration

## 📧 Reporting Issues

Peter Cat is still in its growth stage, and occasional “tantrums” are to be expected. Please report issues via the following channels:

	•	Submit an Issue
	•	Discussions

👬 Contributors

![https://github.com/petercat-ai/petercat/graphs/contributors](https://contrib.rocks/image?repo=petercat-ai/petercat)

## 📄 License

MIT@[Peter Cat](https://github.com/petercat-ai/petercat/blob/main/LICENSE)
