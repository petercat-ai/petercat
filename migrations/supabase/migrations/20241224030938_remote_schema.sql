set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.analyze_user_token_usage(start_date date, end_date date)
 RETURNS TABLE(bot_id text, usage_date date, input_tokens bigint, output_tokens bigint, total_tokens bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        u.bot_id AS bot_id,
        u.date AS usage_date,  -- 使用别名来避免歧义
        SUM(u.input_token)::BIGINT AS input_tokens,  -- 将结果转换为 BIGINT
        SUM(u.output_token)::BIGINT AS output_tokens,  -- 将结果转换为 BIGINT
        SUM(u.total_token)::BIGINT AS total_tokens  -- 将结果转换为 BIGINT
    FROM user_token_usage u
    WHERE 
        u.date >= start_date AND
        u.date <= end_date
    GROUP BY u.date, u.bot_id;
END;
$function$
;


