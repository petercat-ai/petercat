-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing

-- Enable the pgvector extension to work with embedding vectors
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

create table rag_issues
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
  issue_id varchar,
  bot_id varchar
);

-- Drop the existing function if it already exists
drop function if exists match_rag_docs;

create function match_rag_docs
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


-- Drop the existing function if it already exists
drop function if exists match_rag_issues;

create function match_rag_issues
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
    1 - (rag_issues.embedding <=> query_embedding
  ) as similarity
  from rag_issues
  where metadata @> jsonb_extract_path(filter, 'metadata')
  and bot_id = jsonb_extract_path_text(filter, 'bot_id')
  order by rag_issues.embedding <=> query_embedding;
end;
$$;
