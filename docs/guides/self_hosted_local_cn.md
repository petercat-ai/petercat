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

### 第三步：在本地启动 supabase

参考 https://supabase.com/docs/guides/self-hosting/docker#installing-and-running-supabase

```
# Get the code
git clone --depth 1 https://github.com/supabase/supabase

# Go to the docker folder
cd supabase/docker

# Copy the fake env vars
cp .env.example .env

# Pull the latest images
docker compose pull

# Start the services (in detached mode)
docker compose up -d
```

### 第四步：复制 `.env.example` 文件
复制客户端环境配置示例文件：
```bash
cp client/.env.local.example client/.env
```

复制服务器环境配置示例文件：

```bash
cp server/.env.local.example server/.env
```

打开 `server/.env` 文件，把 `SERVICE_ROLE_KEY` 字段改成从 supabase 的 `docker/.env` 文件的 `SERVICE_ROLE_KEY` 的值

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

#### 第五步 5.3：执行迁移
将数据库迁移应用到您的远程数据库：

```bash
# postgres db url 在第四步的 .env 文件中可以找到
supabase db push --db-url "postgres://postgres.your-tenant-id:your-super-secret-and-long-postgres-password@127.0.0.1:5432/postgres"
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
yarn run server:local
```

通过在浏览器中打开 `http://127.0.0.1:8001/api/health_checker` 检查服务器是否正在运行。

### 第七步：启动客户端
使用以下命令启动客户端：

```bash
yarn run client
```

您可以通过在浏览器中打开 `http://127.0.0.1:3000` 来检查客户端服务。
