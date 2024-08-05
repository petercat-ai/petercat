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

-- Drop the existing function if it already exists
drop function if exists match_rag_docs;

-- Create a function to search for rag_docs
create function match_rag_docs
 (
  query_embedding vector (1536),
  query_bot_id text,
  filter jsonb default '{}',
  query_limit integer default 4
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
  where metadata @> filter
  and bot_id = query_bot_id
  order by rag_docs.embedding <=> query_embedding
  limit query_limit;
end;
$$;