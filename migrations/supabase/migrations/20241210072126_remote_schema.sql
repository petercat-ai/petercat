revoke delete on table "public"."github_app_authorization" from "anon";

revoke insert on table "public"."github_app_authorization" from "anon";

revoke references on table "public"."github_app_authorization" from "anon";

revoke select on table "public"."github_app_authorization" from "anon";

revoke trigger on table "public"."github_app_authorization" from "anon";

revoke truncate on table "public"."github_app_authorization" from "anon";

revoke update on table "public"."github_app_authorization" from "anon";

revoke delete on table "public"."github_app_authorization" from "authenticated";

revoke insert on table "public"."github_app_authorization" from "authenticated";

revoke references on table "public"."github_app_authorization" from "authenticated";

revoke select on table "public"."github_app_authorization" from "authenticated";

revoke trigger on table "public"."github_app_authorization" from "authenticated";

revoke truncate on table "public"."github_app_authorization" from "authenticated";

revoke update on table "public"."github_app_authorization" from "authenticated";

revoke delete on table "public"."github_app_authorization" from "service_role";

revoke insert on table "public"."github_app_authorization" from "service_role";

revoke references on table "public"."github_app_authorization" from "service_role";

revoke select on table "public"."github_app_authorization" from "service_role";

revoke trigger on table "public"."github_app_authorization" from "service_role";

revoke truncate on table "public"."github_app_authorization" from "service_role";

revoke update on table "public"."github_app_authorization" from "service_role";

revoke delete on table "public"."github_app_installations" from "anon";

revoke insert on table "public"."github_app_installations" from "anon";

revoke references on table "public"."github_app_installations" from "anon";

revoke select on table "public"."github_app_installations" from "anon";

revoke trigger on table "public"."github_app_installations" from "anon";

revoke truncate on table "public"."github_app_installations" from "anon";

revoke update on table "public"."github_app_installations" from "anon";

revoke delete on table "public"."github_app_installations" from "authenticated";

revoke insert on table "public"."github_app_installations" from "authenticated";

revoke references on table "public"."github_app_installations" from "authenticated";

revoke select on table "public"."github_app_installations" from "authenticated";

revoke trigger on table "public"."github_app_installations" from "authenticated";

revoke truncate on table "public"."github_app_installations" from "authenticated";

revoke update on table "public"."github_app_installations" from "authenticated";

revoke delete on table "public"."github_app_installations" from "service_role";

revoke insert on table "public"."github_app_installations" from "service_role";

revoke references on table "public"."github_app_installations" from "service_role";

revoke select on table "public"."github_app_installations" from "service_role";

revoke trigger on table "public"."github_app_installations" from "service_role";

revoke truncate on table "public"."github_app_installations" from "service_role";

revoke update on table "public"."github_app_installations" from "service_role";

alter table "public"."github_app_authorization" drop constraint "github_app_authorization_installation_id_key";

drop function if exists "public"."match_rag_docs"(query_embedding vector, filter jsonb);

alter table "public"."github_app_authorization" drop constraint "github_app_authorization_pkey";

alter table "public"."github_app_installations" drop constraint "github_app_installations_pkey";

alter table "public"."rag_docs" drop constraint "rag_docs_pkey";

drop index if exists "public"."github_app_authorization_installation_id_key";

drop index if exists "public"."github_app_authorization_pkey";

drop index if exists "public"."github_app_installations_pkey";

drop index if exists "public"."rag_docs_pkey";

drop table "public"."github_app_authorization";

drop table "public"."github_app_installations";

alter table "public"."bots" add column "n" smallint default '1'::smallint;

alter table "public"."bots" add column "temperature" real default '0.2'::real;

alter table "public"."bots" add column "top_p" real;

alter table "public"."profiles" add column "agreement_accepted" boolean default false;

alter table "public"."rag_docs" alter column "repo_name" set not null;

CREATE UNIQUE INDEX rag_docs_pkey ON public.rag_docs USING btree (id, repo_name);

alter table "public"."rag_docs" add constraint "rag_docs_pkey" PRIMARY KEY using index "rag_docs_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.count_rag_docs_by_sha(file_sha_input text)
 RETURNS TABLE(count bigint, file_sha character varying, repo_name text, file_path character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(id) AS count,
        r.file_sha AS file_sha,
        r.repo_name AS repo_name,
        r.file_path AS file_path
    FROM
        rag_docs r
    WHERE
        r.file_sha = file_sha_input
    GROUP BY
        r.file_sha,
        r.repo_name,
        r.file_path
    ORDER BY
        count ASC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.match_embedding_docs(query_embedding vector, filter jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(id uuid, content text, metadata jsonb, embedding vector, similarity double precision)
 LANGUAGE plpgsql
AS $function$
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
  and repo_name = jsonb_extract_path_text(filter, 'repo_name')
  order by rag_docs.embedding <=> query_embedding;
end;
$function$
;


