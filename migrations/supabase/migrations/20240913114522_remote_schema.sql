alter table "public"."bots" alter column "token_id" set default ''::text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_bot_stats(filter_bot_id text)
 RETURNS TABLE(call_cnt bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(1)::BIGINT AS call_cnt
    FROM user_token_usage u
    WHERE u.bot_id = filter_bot_id  -- 使用别名来引用参数
    GROUP BY u.bot_id;
END;
$function$
;


