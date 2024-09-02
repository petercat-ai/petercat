
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";

CREATE OR REPLACE FUNCTION "public"."execute_sql"("query" "text") RETURNS TABLE("id" "uuid", "created_at" timestamp with time zone, "uid" character varying, "avatar" character varying, "description" character varying, "prompt" "text", "files" "text"[], "enable_img_generation" boolean, "label" character varying, "name" character varying, "starters" "text"[], "public" boolean, "updated_at" timestamp with time zone, "hello_message" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY EXECUTE query;
END;
$$;

ALTER FUNCTION "public"."execute_sql"("query" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, first_name, age)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data['age']::integer);
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_antd_doc"("query_embedding" "public"."vector", "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (antd_doc.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by antd_doc.embedding <=> query_embedding;
end;
$$;

ALTER FUNCTION "public"."match_antd_doc"("query_embedding" "public"."vector", "filter" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_antd_documents"("query_embedding" "public"."vector", "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (antd_documents.embedding <=> query_embedding) as similarity
  from antd_documents
  where metadata @> filter
  order by antd_documents.embedding <=> query_embedding;
end;
$$;

ALTER FUNCTION "public"."match_antd_documents"("query_embedding" "public"."vector", "filter" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_antd_knowledge"("query_embedding" "public"."vector", "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (antd_knowledge.embedding <=> query_embedding) as similarity
  from antd_knowledge
  where metadata @> filter
  order by antd_knowledge.embedding <=> query_embedding;
end;
$$;

ALTER FUNCTION "public"."match_antd_knowledge"("query_embedding" "public"."vector", "filter" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_docs"("query_embedding" "public"."vector", "match_count" integer DEFAULT NULL::integer, "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" bigint, "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

ALTER FUNCTION "public"."match_docs"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding;
end;
$$;

ALTER FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "filter" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_rag_docs"("query_embedding" "public"."vector", "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "embedding" "public"."vector", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
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

ALTER FUNCTION "public"."match_rag_docs"("query_embedding" "public"."vector", "filter" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_text"("query_embedding" "public"."vector", "match_count" integer DEFAULT NULL::integer, "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" bigint, "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

ALTER FUNCTION "public"."match_text"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."rag_docs"("query_embedding" "public"."vector", "filter" "jsonb" DEFAULT '{}'::"jsonb", "query_repo_name" "text" DEFAULT ''::"text") RETURNS TABLE("id" "uuid", "metadata" "jsonb", "content" "text", "similarity" double precision)
    LANGUAGE "sql" STABLE
    AS $$
  select
    rag_docs.id,
    rag_docs.metadata,
    rag_docs.content,
    1 - (rag_docs.embedding <=> query_embedding) as similarity
  from rag_docs
  where metadata @> filter
  and repo_name = query_repo_name
  order by (rag_docs.embedding <=> query_embedding) asc
$$;

ALTER FUNCTION "public"."rag_docs"("query_embedding" "public"."vector", "filter" "jsonb", "query_repo_name" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_timestamp_function"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.update_timestamp = now();
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_timestamp_function"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."bots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "uid" character varying,
    "avatar" character varying DEFAULT ''::character varying,
    "description" character varying DEFAULT ''::character varying,
    "prompt" "text" DEFAULT ''::"text",
    "label" character varying,
    "name" character varying DEFAULT ''::character varying NOT NULL,
    "starters" "text"[],
    "public" boolean DEFAULT false,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "hello_message" "text",
    "llm" character varying DEFAULT 'openai'::character varying
);

ALTER TABLE "public"."bots" OWNER TO "postgres";

COMMENT ON TABLE "public"."bots" IS 'bots list';

CREATE TABLE IF NOT EXISTS "public"."git_issue_tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "repo_name" character varying,
    "status" character varying,
    "node_type" character varying,
    "from_task_id" character varying,
    "issue_id" character varying,
    "bot_id" character varying
);

ALTER TABLE "public"."git_issue_tasks" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."github_app_authorization" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "token" "text",
    "installation_id" character varying,
    "expires_at" timestamp with time zone,
    "permissions" "json",
    "code" character varying
);

ALTER TABLE "public"."github_app_authorization" OWNER TO "postgres";

COMMENT ON TABLE "public"."github_app_authorization" IS 'Authorizations of Github App';

ALTER TABLE "public"."github_app_authorization" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."github_app_authorization_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."github_repo_config" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "repo_name" character varying,
    "robot_id" character varying
);

ALTER TABLE "public"."github_repo_config" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."llm_tokens" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "slug" character varying,
    "limit" numeric,
    "usage" numeric,
    "free" boolean,
    "llm" "text",
    "token" "text"
);

ALTER TABLE "public"."llm_tokens" OWNER TO "postgres";

ALTER TABLE "public"."llm_tokens" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."llm_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "nickname" character varying,
    "name" character varying,
    "picture" character varying,
    "sid" character varying,
    "sub" character varying
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."rag_docs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" "text",
    "metadata" "jsonb",
    "embedding" "public"."vector"(1536),
    "repo_name" "text",
    "commit_id" character varying,
    "file_sha" character varying,
    "file_path" character varying,
    "bot_id" character varying,
    "update_timestamp" timestamp with time zone
);

ALTER TABLE "public"."rag_docs" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."rag_issues" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "update_timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "text",
    "metadata" "jsonb",
    "embedding" "public"."vector",
    "repo_name" character varying,
    "issue_id" character varying,
    "bot_id" character varying,
    "comment_id" character varying
);

ALTER TABLE "public"."rag_issues" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."rag_tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "repo_name" character varying,
    "commit_id" character varying,
    "status" character varying,
    "metadata" "jsonb",
    "node_type" character varying,
    "from_task_id" "uuid",
    "path" character varying,
    "sha" character varying,
    "bot_id" character varying
);

ALTER TABLE "public"."rag_tasks" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_token_usage" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" character varying,
    "last_request" timestamp without time zone,
    "request_count" bigint DEFAULT '0'::bigint
);

ALTER TABLE "public"."user_token_usage" OWNER TO "postgres";

COMMENT ON TABLE "public"."user_token_usage" IS 'token usage of people';

ALTER TABLE "public"."user_token_usage" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_token_usage_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."bots"
    ADD CONSTRAINT "bots_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."git_issue_tasks"
    ADD CONSTRAINT "git_issue_tasks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."github_app_authorization"
    ADD CONSTRAINT "github_app_authorization_installation_id_key" UNIQUE ("installation_id");

ALTER TABLE ONLY "public"."github_app_authorization"
    ADD CONSTRAINT "github_app_authorization_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."github_repo_config"
    ADD CONSTRAINT "github_repo_config_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."rag_issues"
    ADD CONSTRAINT "issue_docs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."llm_tokens"
    ADD CONSTRAINT "llm_tokens_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."rag_docs"
    ADD CONSTRAINT "rag_docs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."rag_tasks"
    ADD CONSTRAINT "rag_tasks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_token_usage"
    ADD CONSTRAINT "user_token_usage_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "update_timestamp_trigger" BEFORE INSERT OR UPDATE ON "public"."rag_docs" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp_function"();

CREATE POLICY "Enable read access for all users" ON "public"."llm_tokens" FOR SELECT USING (true);

ALTER TABLE "public"."llm_tokens" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."execute_sql"("query" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."execute_sql"("query" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."execute_sql"("query" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."match_antd_doc"("query_embedding" "public"."vector", "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_antd_doc"("query_embedding" "public"."vector", "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_antd_doc"("query_embedding" "public"."vector", "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."match_antd_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_antd_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_antd_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."match_antd_knowledge"("query_embedding" "public"."vector", "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_antd_knowledge"("query_embedding" "public"."vector", "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_antd_knowledge"("query_embedding" "public"."vector", "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."match_docs"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_docs"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_docs"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."match_rag_docs"("query_embedding" "public"."vector", "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_rag_docs"("query_embedding" "public"."vector", "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_rag_docs"("query_embedding" "public"."vector", "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."match_text"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_text"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_text"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."rag_docs"("query_embedding" "public"."vector", "filter" "jsonb", "query_repo_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."rag_docs"("query_embedding" "public"."vector", "filter" "jsonb", "query_repo_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rag_docs"("query_embedding" "public"."vector", "filter" "jsonb", "query_repo_name" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."update_timestamp_function"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_timestamp_function"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_timestamp_function"() TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "service_role";

GRANT ALL ON TABLE "public"."bots" TO "anon";
GRANT ALL ON TABLE "public"."bots" TO "authenticated";
GRANT ALL ON TABLE "public"."bots" TO "service_role";

GRANT ALL ON TABLE "public"."git_issue_tasks" TO "anon";
GRANT ALL ON TABLE "public"."git_issue_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."git_issue_tasks" TO "service_role";

GRANT ALL ON TABLE "public"."github_app_authorization" TO "anon";
GRANT ALL ON TABLE "public"."github_app_authorization" TO "authenticated";
GRANT ALL ON TABLE "public"."github_app_authorization" TO "service_role";

GRANT ALL ON SEQUENCE "public"."github_app_authorization_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."github_app_authorization_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."github_app_authorization_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."github_repo_config" TO "anon";
GRANT ALL ON TABLE "public"."github_repo_config" TO "authenticated";
GRANT ALL ON TABLE "public"."github_repo_config" TO "service_role";

GRANT ALL ON TABLE "public"."llm_tokens" TO "anon";
GRANT ALL ON TABLE "public"."llm_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."llm_tokens" TO "service_role";

GRANT ALL ON SEQUENCE "public"."llm_tokens_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."llm_tokens_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."llm_tokens_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."rag_docs" TO "anon";
GRANT ALL ON TABLE "public"."rag_docs" TO "authenticated";
GRANT ALL ON TABLE "public"."rag_docs" TO "service_role";

GRANT ALL ON TABLE "public"."rag_issues" TO "anon";
GRANT ALL ON TABLE "public"."rag_issues" TO "authenticated";
GRANT ALL ON TABLE "public"."rag_issues" TO "service_role";

GRANT ALL ON TABLE "public"."rag_tasks" TO "anon";
GRANT ALL ON TABLE "public"."rag_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."rag_tasks" TO "service_role";

GRANT ALL ON TABLE "public"."user_token_usage" TO "anon";
GRANT ALL ON TABLE "public"."user_token_usage" TO "authenticated";
GRANT ALL ON TABLE "public"."user_token_usage" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_token_usage_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_token_usage_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_token_usage_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
