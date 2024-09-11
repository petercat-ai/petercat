alter table "public"."bots" add column "token_id" text default '''''::text'::text;

alter table "public"."user_token_usage" drop column "last_request";

alter table "public"."user_token_usage" drop column "request_count";

alter table "public"."user_token_usage" add column "bot_id" text;

alter table "public"."user_token_usage" add column "date" date;

alter table "public"."user_token_usage" add column "input_token" bigint;

alter table "public"."user_token_usage" add column "output_token" bigint;

alter table "public"."user_token_usage" add column "token_id" text;

alter table "public"."user_token_usage" add column "total_token" bigint;

alter table "public"."user_token_usage" alter column "id" set default gen_random_uuid();

alter table "public"."user_token_usage" alter column "id" drop identity;

alter table "public"."user_token_usage" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."user_token_usage" alter column "user_id" set data type text using "user_id"::text;


