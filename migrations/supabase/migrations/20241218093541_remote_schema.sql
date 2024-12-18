alter table "public"."profiles" drop constraint "profile_pkey";

drop index if exists "public"."profile_pkey";

alter table "public"."profiles" alter column "sub" set not null;

CREATE INDEX idx_file_sha ON public.rag_docs USING btree (file_sha);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

set check_function_bodies = off;

create or replace view "public"."bots_with_profiles_and_github" as  SELECT bots.id,
    bots.created_at,
    bots.updated_at,
    bots.avatar,
    bots.description,
    bots.name,
    bots.public,
    bots.starters,
    bots.uid,
    bots.repo_name,
    profiles.picture,
    profiles.nickname,
        CASE
            WHEN (github_repo_config.robot_id IS NOT NULL) THEN true
            ELSE false
        END AS github_installed
   FROM ((bots
     LEFT JOIN profiles ON (((bots.uid)::text = (profiles.sub)::text)))
     LEFT JOIN github_repo_config ON ((bots.id = (github_repo_config.robot_id)::uuid)));


CREATE OR REPLACE FUNCTION public.get_bots_with_profiles_and_github()
 RETURNS TABLE(id uuid, created_at timestamp without time zone, updated_at timestamp without time zone, avatar text, description text, name text, public boolean, starters text, uid text, domain_whitelist text[], repo_name text, picture text, nickname text, github_installed boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        b.id::uuid, 
        b.created_at::timestamp, 
        b.updated_at::timestamp, 
        b.avatar::text, 
        b.description::text, 
        b.name::text, 
        b.public::boolean, 
        b.starters::text, 
        b.uid::text, 
        b.domain_whitelist::text[],
        b.repo_name::text,
        p.picture::text,
        p.nickname::text,
        CASE 
            WHEN grc.robot_id IS NOT NULL THEN TRUE 
            ELSE FALSE 
        END AS github_installed
    FROM 
        bots b
    LEFT JOIN 
        profiles p ON b.uid = p.sub
    LEFT JOIN 
        github_repo_config grc ON b.id::varchar = grc.robot_id;
END;
$function$
;


