# Self-Hosting with Docker

Docker is the easiest way to get started with self-hosted Petercat. This guide assumes you are running the command from the machine you intend to host from.

## Before you begin

You need the following installed in your system: [Git](https://git-scm.com/downloads) and Docker ([Windows](https://docs.docker.com/desktop/install/windows-install/), [MacOS](https://docs.docker.com/desktop/install/mac-install/), or [Linux](https://docs.docker.com/desktop/install/linux-install/)).

## Running Petercat

Follow these steps to start Supabase locally:


```sh
# Get the code
git clone --depth 1 https://github.com/ant-xuexiao/bot-meta

# Copy the fake env vars
cp .env.example .env

# Pull the latest images
docker compose pull

# Start the services (in detached mode)
docker compose up -d
```

