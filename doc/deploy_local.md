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
cp server/.env.example server/.env
cp .env.example .env

# Start the services (in detached mode)
make dev
```

After all the services have started you can see them running in the background:

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
