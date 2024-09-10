alter table "public"."bots" add column "domain_whitelist" text[] default '{}'::text[];

alter table "public"."bots" add column "repo_name" text;

alter table "public"."git_issue_tasks" add column "page_index" numeric;


