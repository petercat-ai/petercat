drop function if exists "public"."analyze_user_token_usage"(start_date date, end_date date);

alter table "public"."profiles" add column "is_admin" boolean default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.bot_token_usage_rate(start_date date, end_date date)
 RETURNS TABLE(bot_id text, bot_name text, input_tokens bigint, output_tokens bigint, total_tokens bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT * from (
SELECT
        u.bot_id AS bot_id,
        COALESCE(b.name, '未命名')::text as bot_name,
        SUM(u.input_token)::BIGINT AS input_tokens,  -- 将结果转换为 BIGINT
        SUM(u.output_token)::BIGINT AS output_tokens,  -- 将结果转换为 BIGINT
        SUM(u.total_token)::BIGINT AS total_tokens  -- 将结果转换为 BIGINT
    FROM user_token_usage u
    LEFT JOIN bots b
        ON b.id::text = u.bot_id
    GROUP BY u.bot_id, b.name
) bu
ORDER BY total_tokens DESC
limit 3;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.user_token_usage_rate(start_date date, end_date date)
 RETURNS TABLE(user_id text, user_name text, input_tokens bigint, output_tokens bigint, total_tokens bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT * from (
SELECT
        u.user_id AS user_id,
        COALESCE(p.name, '匿名用户')::text as user_name,
        SUM(u.input_token)::BIGINT AS input_tokens,  -- 将结果转换为 BIGINT
        SUM(u.output_token)::BIGINT AS output_tokens,  -- 将结果转换为 BIGINT
        SUM(u.total_token)::BIGINT AS total_tokens  -- 将结果转换为 BIGINT
    FROM user_token_usage u
    LEFT JOIN profiles p
        ON p.id = u.user_id
    WHERE 
        u.token_id = 'DEFAULT_TOKEN' AND
        u.date >= start_date AND
        u.date <= end_date
    GROUP BY u.user_id, p.name
) bu
ORDER BY total_tokens DESC
limit 3;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.analyze_user_token_usage(start_date date, end_date date)
 RETURNS TABLE(bot_id text, bot_name text, usage_date date, input_tokens bigint, output_tokens bigint, total_tokens bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        u.bot_id AS bot_id,
        COALESCE(b.name, '未命名')::text as bot_name,
        Date(u.date) AS usage_date,  -- 使用别名来避免歧义
        SUM(u.input_token)::BIGINT AS input_tokens,  -- 将结果转换为 BIGINT
        SUM(u.output_token)::BIGINT AS output_tokens,  -- 将结果转换为 BIGINT
        SUM(u.total_token)::BIGINT AS total_tokens  -- 将结果转换为 BIGINT
    FROM user_token_usage u
    LEFT JOIN bots b
        ON b.id::text = u.bot_id
    WHERE 
        u.date >= start_date AND
        u.date <= end_date
    GROUP BY u.date, u.bot_id, b.name
    ORDER by u.date DESC;
END;
$function$
;


