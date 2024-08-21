alter table "public"."github_repo_config" alter column "id" set default gen_random_uuid();

alter table "public"."github_repo_config" alter column "id" drop identity;

alter table "public"."github_repo_config" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."github_repo_config" alter column "repo_name" drop default;

alter table "public"."github_repo_config" alter column "robot_id" drop default;

alter table "public"."github_repo_config" disable row level security;


