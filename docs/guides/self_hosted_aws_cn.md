以下是翻译成中文的版本：

```markdown
## 一键在 AWS 上部署 Petercat：准备步骤

在 AWS 上部署 Petercat 之前，请确保您已完成以下准备工作：

- 开通 AWS 账户。
- 本地安装 Docker。

## 示例：在亚太区 - 新加坡（ap-southeast-1）本地部署您的服务

### 第一步：安装 AWS CLI 和 SAM CLI

1. 安装 AWS CLI 工具。

2. 访问配置文档并配置您的 AWS CLI：[AWS CLI 配置指南](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)

3. 安装 SAM CLI 工具。

4. 访问 [SAM CLI 安装指南](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)。

### 第二步：登录 AWS

使用单点登录 (SSO) 会话登录您的 AWS 账户：

```bash
aws sso login --sso-session $YOUR_PROFILE_NAME
```

### 第三步：复制并修改配置文件

运行以下命令复制示例配置文件：

```bash
cp .aws/petercat-example.toml .aws/petercat-ap-southeast.toml
```

### 第四步：更新 `.toml` 文件

打开 `.toml` 文件并更新必要的键值。您可以使用任何文本编辑器，例如 `vim`、`emacs`、`vscode` 或 `nano`：

```bash
vim .aws/petercat-ap-southeast.toml
```

将 `YOUR_REGION` 替换为 `ap-southeast-1`，并将 `YOUR_STACK_NAME` 替换为您的自定义栈名称，例如 `petercat-selfhosted`。

```toml
version = 0.1
[default.deploy.parameters]
stack_name = "petercat-selfhosted"
resolve_s3 = true
s3_prefix = "petercat-selfhosted"
region = "ap-southeast-1"
confirm_changeset = true
capabilities = "CAPABILITY_IAM"
disable_rollback = true
```

### 第五步：本地构建 Docker 镜像

在项目的根目录中运行以下命令。根据您计算机的配置，这一步可能需要一些时间：

```bash
sam build --use-container --config-file .aws/petercat-ap-southeast.toml
```

构建完成后，您应该会看到以下输出：

```
Build Succeeded

Built Artifacts  : .aws-sam/build
Built Template   : .aws-sam/build/template.yaml

Commands you can use next
=========================
[*] Validate SAM template: sam validate
[*] Invoke Function: sam local invoke
[*] Test Function in the Cloud: sam sync --stack-name {{stack-name}} --watch
[*] Deploy: sam deploy --guided
```

### 第六步：加载环境变量并开始部署

在根目录中，执行以下命令以加载环境变量：

```bash
source server/.env
```

然后，运行以下命令进行部署：

```bash
sam deploy \
    --guided \
    --no-confirm-changeset \
    --config-file .aws/petercat-ap-southeast.toml \
    --parameter-overrides APIUrl=$API_URL \
                          WebUrl=$WEB_URL \
                          AWSSecretName=$AWS_SECRET_NAME \
                          S3TempBucketName=$S3_TEMP_BUCKET_NAME \
                          GitHubAppID=$X_GITHUB_APP_ID \
                          GithubAppsClientId=$X_GITHUB_APPS_CLIENT_ID \
                          GithubAppsClientSecret=$X_GITHUB_APPS_CLIENT_SECRET \
                          OpenAIAPIKey=$OPENAI_API_KEY \
                          GeminiAPIKey=$GEMINI_API_KEY \
                          SupabaseServiceKey=$SUPABASE_SERVICE_KEY \
                          SupabaseUrl=$SUPABASE_URL \
                          TavilyAPIKey=$TAVILY_API_KEY \
                          APIIdentifier=$API_IDENTIFIER \
                          FastAPISecretKey=$FASTAPI_SECRET_KEY \
                          Auth0Domain=$AUTH0_DOMAIN \
                          Auth0ClientId=$AUTH0_CLIENT_ID \
                          Auth0ClientSecret=$AUTH0_CLIENT_SECRET
```

### 第七步：检查您的服务

查看 CloudFormation 部署栈的输出：


```
------------------------------------------------------------------------------------------------------------------------------------
Outputs
------------------------------------------------------------------------------------------------------------------------------------
Key                 FastAPIFunction
Description         FastAPI Lambda Function ARN
Value               arn:aws:lambda:ap-southeast-1:654654285942:function:petercat-selfhosted-FastAPIFunction-x0bez5v1EMDL

Key                 SQSSubscriptionFunction
Description         SQS Subscription Function Lambda Function ARN
Value               arn:aws:lambda:ap-southeast-1:654654285942:function:petercat-selfhosted-SQSSubscriptionFunction-ghluUSulMO4y

Key                 FastAPIFunctionUrl
Description         Function URL for FastAPI function
Value               https://itebdgout4h33aqpy2ygxaedgm0nlnys.lambda-url.ap-southeast-1.on.aws/

Key                 SQSSubscriptionFunctionUrl
Description         Function URL for SQS Subscription function
Value               https://q7kpxukbpgxkkjldgnvvbc6dyi0akzuk.lambda-url.ap-southeast-1.on.aws/
------------------------------------------------------------------------------------------------------------------------------------
```

使用 `curl` 测试您的服务：

```bash 
curl https://itebdgout4h33aqpy2ygxaedgm0nlnys.lambda-url.ap-southeast-1.on.aws/api/health_checker
```
```

这就是翻译后的版本，格式和结构保持一致。请告诉我是否需要进一步调整！