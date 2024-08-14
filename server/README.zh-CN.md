<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18">  [English](./README.md) | 简体中文

# 介绍
PeterCat 服务端，采用 FastAPI 框架开发。使用了 supabase 作为数据存储方案。

# 功能模块
## 存储
采用 [supabase](https://supabase.com) 作为数据库进行存储。
作为开发者你需要熟悉该平台以下功能
- project 管理平台：https://supabase.com/dashboard/project/{projectId}, 请开发者联系管理员赋予相关权限。
- 进入 Project 管理平台后，左边菜单栏中的 Table Editor、SQL Editor、Database 是你的好帮手。
  - Table Editor 支持直接修改数据；
  - SQL Editor 是一个可以在线编写 SQL 并执行的可视化客户端；你可以在其中创建表、删除表、创建函数、删除函数等操作。
  - Database 中提供了数据库的的综合管理；

### Table Typescript 类型支持 
要想获得表内字段的类型支持，需要先安装 supabse CLI 工具 : https://supabase.com/docs/guides/cli/getting-started
```bash
cd migrations
supabase start
supabase gen types typescript --local > database.types.ts
```

## github
### webhook
代码目录

#### 如何测试
1. 先阅读 github webhook 文档
[https://docs.github.com/zh/apps/creating-github-apps/registering-a-github-app/using-webhooks-with-github-apps](https://docs.github.com/zh/apps/creating-github-apps/registering-a-github-app/using-webhooks-with-github-apps)

2. 访问 [smee.io](https://smee.io/) 新建一个 channel,得到形如 https://smee.io/Q2VVS0casGnhZV 的 url 。

3. 本地启动此 server, 得到 hook 服务地址
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

5. 访问 [demo repository settings ](https://github.com/{ORG_NAME}/{REPO_NAME}/settings/installations)

\> 配置 perter-cat 插件 [settings](https://github.com/organizations/{ORG_NAME}/settings/apps/petercat-bot) \> 
Webhook URL \> 填入smee channel url, eg: https://smee.io/Q2VVS0casGnhZV 

6. 在 demo repository 发起 issue 或者 pull-request，在 smee 、本地将能同步看到请求。

7. 在测试完毕后记得将 Webhook URL 改回去, eg:http://pertercat.chat/api/github/app/webhook

## RAG
### API
> server/routers/rag.py
#### rag/add_knowledge_by_doc
新增知识库。执行将 github 上指定的仓库中的文档进行 Embedding 化后，存储在 supabase 中，对应的 table 为 `rag_docs`。

#### rag/search_knowledge
搜索知识。将输入的 query 进行 Embedding 化后，与 supabase 中存储的知识进行匹配，返回匹配结果。

### 数据库
建议将 DB 相关操作备份在 /server/sql/rag_docs.sql 中，方便追踪。
#### 创建知识库
```sql
create extension
if not exists vector;

-- Create a table to store your rag_docs
create table rag_docs
(
  id uuid primary key,
  content text,
  -- corresponds to Document.pageContent
  metadata jsonb,
  -- corresponds to Document.metadata
  embedding vector (1536),
  -- 1536 works for OpenAI embeddings, change if needed
  -- per request info
  repo_name varchar,
  commit_id varchar,
  bot_id varchar,
  file_sha varchar,
  file_path varchar
);
```
### 创建 Function
为了实现知识库的 Embedding 查询，需要创建一个 Function。
[supabase 文档教程](https://supabase.com/docs/guides/ai/vector-columns#querying-a-vector--embedding)

> 建议：
> 1. 如果 Function 的入参发生了变化，需要将该function 进行删除后重新创建。事实上建议在项目上线后创建新版本的函数，保留历史函数。
> 2. 将函数备份在本项目中 server/sql/rag_docs.sql
#### 示例
这些 sql 可以在 SQL Editor 中执行。
```sql
-- 删除函数
drop function if exists match_rag_docs_v1;
-- 新建函数
create function match_rag_docs_v1
 (
  query_embedding vector (1536),
  filter jsonb default '{}'
) returns table
(
  id uuid,
  content text,
  metadata jsonb,
  embedding vector,
  similarity float
) language plpgsql as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    embedding,
    1 - (rag_docs.embedding <=> query_embedding
  ) as similarity
  from rag_docs
  where metadata @> jsonb_extract_path(filter, 'metadata')
  and bot_id = jsonb_extract_path_text(filter, 'bot_id')
  order by rag_docs.embedding <=> query_embedding;
end;
$$;
```
