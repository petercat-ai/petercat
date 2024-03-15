CREATE TABLE public.profiles (
    id character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    nickname character varying,
    name character varying,
    picture character varying,
    sid character varying,
    sub character varying
);


ALTER TABLE public.profiles OWNER TO postgres;
