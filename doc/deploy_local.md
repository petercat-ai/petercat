# Self-Hosting with Docker
Learn how to configure and deploy BotMeta with Docker.
--------------

## Before you begin

You need the following installed in your system: [Git](https://git-scm.com/downloads) and Docker ([Windows](https://docs.docker.com/desktop/install/windows-install/), [MacOS](https://docs.docker.com/desktop/install/mac-install/), or [Linux](https://docs.docker.com/desktop/install/linux-install/)).

## Running BotMeta

Follow these steps to start BotMeta locally:

```sh
# Get the code
git clone --depth 1 git@github.com:ant-xuexiao/bot-meta.git

# Copy the fake env vars
cp docker/.env.example docker/.env
cp .env.example .env

# Start the services (in detached mode)
make dev
```

After all the services have started you can see them running in the background:

```sh
docker compose -f docker/docker-compose.yml ps
## or run make
make dev-ps
```

```
docker compose -f docker/docker-compose.yml ps
NAME                             IMAGE                              COMMAND                   SERVICE        CREATED       STATUS                      PORTS
backend-core                     backend-base                       "uvicorn main:app --h…"    backend-core   2 hours ago   Up 54 seconds               0.0.0.0:5050->5050/tcp
realtime-dev.supabase-realtime   supabase/realtime:v2.25.66         "/usr/bin/tini -s -g…"    realtime       2 hours ago   Up 37 seconds (healthy)
redis                            redis:latest                       "docker-entrypoint.s…"    redis          2 hours ago   Up 54 seconds               0.0.0.0:6379->6379/tcp
supabase-analytics               supabase/logflare:1.4.0            "sh run.sh"               analytics      2 hours ago   Up 43 seconds (healthy)     0.0.0.0:4000->4000/tcp
supabase-auth                    supabase/gotrue:v2.143.0           "auth"                    auth           2 hours ago   Up 37 seconds (healthy)
supabase-db                      supabase/postgres:15.1.0.147       "docker-entrypoint.s…"    db             2 hours ago   Up 49 seconds (healthy)     0.0.0.0:5432->5432/tcp
supabase-edge-functions          supabase/edge-runtime:v1.38.0      "edge-runtime start …"    functions      2 hours ago   Up 37 seconds
supabase-imgproxy                darthsim/imgproxy:v3.8.0           "imgproxy"                imgproxy       2 hours ago   Up 54 seconds (healthy)     8080/tcp
supabase-kong                    kong:2.8.1                         "bash -c 'eval \"echo…"   kong           2 hours ago   Up 37 seconds (healthy)     0.0.0.0:8000->8000/tcp, 8001/tcp, 0.0.0.0:8443->8443/tcp, 8444/tcp
supabase-meta                    supabase/postgres-meta:v0.79.0     "docker-entrypoint.s…"    meta           2 hours ago   Up 37 seconds (healthy)     8080/tcp
supabase-rest                    postgrest/postgrest:v12.0.1        "postgrest"               rest           2 hours ago   Up 37 seconds               3000/tcp
supabase-storage                 supabase/storage-api:v0.46.4       "docker-entrypoint.s…"    storage        2 hours ago   Up 37 seconds (healthy)     5000/tcp
supabase-studio                  supabase/studio:20240301-0942bfe   "docker-entrypoint.s…"    studio         2 hours ago   Up 37 seconds (unhealthy)   3000/tcp
supabase-vector                  timberio/vector:0.28.1-alpine      "/usr/local/bin/vect…"    vector         2 hours ago   Up 54 seconds (healthy)
```
### Accessing Supabase dashboard

You can access the Supabase Dashboard through the API gateway on port `8000`. For example: `http://<your-ip>:8000`, or [localhost:8000](http://localhost:8000) if you are running Docker locally.

You will be prompted for a username and password. By default, the credentials are:

- Username: `supabase`
- Password: `this_password_is_insecure_and_should_be_updated`

## Accessing the APIs

Each of the APIs are available through the same API gateway:

- REST: `http://<your-ip>:8000/rest/v1/`
- Auth: `http://<your-domain>:8000/auth/v1/`
- Storage: `http://<your-domain>:8000/storage/v1/`
- Realtime: `http://<your-domain>:8000/realtime/v1/`
