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
  embedding vector (1536)
  -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to search for rag_docs
create function match_rag_docs(
  query_embedding vector (1536),
  filter jsonb default '{}'
) returns table
(
  id uuid,
  content text,
  metadata jsonb,
  similarity float
) language plpgsql as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (rag_docs.embedding <=> query_embedding
  ) as similarity
  from rag_docs
  where metadata @> filter
  order by rag_docs.embedding <=> query_embedding;
end;
$$;
