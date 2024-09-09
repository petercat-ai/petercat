create table "public"."user_llm_tokens" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "slug" text,
    "user_id" text,
    "llm" text,
    "encrypted_token" text
);


alter table "public"."llm_tokens" add column "encrypted_token" text;

alter table "public"."llm_tokens" add column "user_id" text;

alter table "public"."llm_tokens" alter column "token" set default ''::text;

alter table "public"."llm_tokens" disable row level security;

alter table "public"."rag_tasks" add column "page_index" numeric;

CREATE UNIQUE INDEX user_llm_tokens_pkey ON public.user_llm_tokens USING btree (id);

alter table "public"."user_llm_tokens" add constraint "user_llm_tokens_pkey" PRIMARY KEY using index "user_llm_tokens_pkey";

grant delete on table "public"."user_llm_tokens" to "anon";

grant insert on table "public"."user_llm_tokens" to "anon";

grant references on table "public"."user_llm_tokens" to "anon";

grant select on table "public"."user_llm_tokens" to "anon";

grant trigger on table "public"."user_llm_tokens" to "anon";

grant truncate on table "public"."user_llm_tokens" to "anon";

grant update on table "public"."user_llm_tokens" to "anon";

grant delete on table "public"."user_llm_tokens" to "authenticated";

grant insert on table "public"."user_llm_tokens" to "authenticated";

grant references on table "public"."user_llm_tokens" to "authenticated";

grant select on table "public"."user_llm_tokens" to "authenticated";

grant trigger on table "public"."user_llm_tokens" to "authenticated";

grant truncate on table "public"."user_llm_tokens" to "authenticated";

grant update on table "public"."user_llm_tokens" to "authenticated";

grant delete on table "public"."user_llm_tokens" to "service_role";

grant insert on table "public"."user_llm_tokens" to "service_role";

grant references on table "public"."user_llm_tokens" to "service_role";

grant select on table "public"."user_llm_tokens" to "service_role";

grant trigger on table "public"."user_llm_tokens" to "service_role";

grant truncate on table "public"."user_llm_tokens" to "service_role";

grant update on table "public"."user_llm_tokens" to "service_role";


