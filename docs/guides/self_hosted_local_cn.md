# 自我托管

## 本地安装

### 第一步：克隆仓库
将项目仓库克隆到本地计算机：

```bash
git clone https://github.com/petercat-ai/petercat.git
``` 

### 第二步：安装依赖
使用 Yarn 安装所有必需的依赖项：

```bash
yarn run bootstrap
```

### 第三步：复制 `.env.example` 文件
复制服务器环境配置示例文件：

```bash
cp server/.env.example server/.env
```
复制客户端环境配置示例文件：
```bash
cp client/.env.example client/.env
```

### 第四步：更新 `.env` 文件
打开 `.env` 文件并更新必要的键值。您可以使用任何文本编辑器，例如 `vim`、`emacs`、`vscode` 或 `nano`：

```bash
vim server/.env
```

对于本地开发，只需配置 Supabase 和 OpenAI 设置：

```bash
# Supabase 项目 URL，获取路径：https://supabase.com/dashboard/project/_/settings/database
SUPABASE_URL=https://{{YOUR_PROJECT_ID}}.supabase.co

# Supabase 项目 API 密钥，`anon public`
SUPABASE_SERVICE_KEY=xxxx.yyyyy.zzzzz

# OpenAI API 密钥
OPENAI_API_KEY=sk-xxxx
```

### 第五步：初始化数据库结构

#### 第五步 5.1：导航到 Migrations 文件夹
导航到 `migrations` 文件夹，准备进行数据库设置：

```bash
cd migrations
```

#### 第五步 5.2：安装 Supabase CLI
按照 [Supabase 入门指南](https://supabase.com/docs/guides/cli/getting-started) 中的说明安装 Supabase CLI：

```bash
brew install supabase/tap/supabase
```

#### 第五步 5.3：连接到远程项目  
要连接到 Supabase 项目，您需要输入数据库密码。您可以在 [Supabase 控制面板](https://supabase.com/dashboard/project/_/settings/database) 中找到该密码：

```bash
supabase link --project-ref {YOUR_PROJECT_ID}
```

如果连接成功，您将看到类似以下的输出：

```
Enter your database password (or leave blank to skip):
Connecting to remote database...
Finished supabase link.
Local config differs from linked project. Try updating supabase/config.toml
[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000
```

#### 第五步 5.4：执行迁移
将数据库迁移应用到您的远程数据库：

```bash
supabase db push
``` 

如果成功，您将看到类似以下的输出：

```
Connecting to remote database...
Do you want to push these migrations to the remote database?
• 20240902023033_remote_schema.sql

[Y/n] Y
Applying migration 20240902023033_remote_schema.sql...
Finished supabase db push.
```

### 第六步：启动服务器
使用以下命令启动服务器：

```bash
yarn run server
```

通过在浏览器中打开 `http://127.0.0.1:8000/api/health_checker` 检查服务器是否正在运行。

### 第七步：启动客户端
使用以下命令启动客户端：

```bash
yarn run client
```

您可以通过在浏览器中打开 `http://127.0.0.1:3000` 来检查客户端服务。
