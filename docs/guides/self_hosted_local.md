```
# Self-Hosting

## Local Installation

### Step 1: Clone the Repository
Clone the project repository to your local machine:

```bash
git clone https://github.com/petercat-ai/petercat.git
``` 

### Step 2: Install Dependencies
Install all necessary dependencies using Yarn:

```bash
yarn run bootstrap
```

### Step 3: Start Supabase Locally

Refer to [Supabase Self-Hosting Guide](https://supabase.com/docs/guides/self-hosting/docker#installing-and-running-supabase):

```bash
# Get the code
git clone --depth 1 https://github.com/supabase/supabase

# Go to the docker folder
cd supabase/docker

# Copy the fake env vars
cp .env.example .env

# Pull the latest images
docker compose pull

# Start the services (in detached mode)
docker compose up -d
```

### Step 4: Copy the `.env.example` Files
Copy the client environment configuration example file:
```bash
cp client/.env.local.example client/.env
```

Copy the server environment configuration example file:
```bash
cp server/.env.local.example server/.env
```

Open the `server/.env` file and update the `SERVICE_ROLE_KEY` field to match the value of `SERVICE_ROLE_KEY` from the `docker/.env` file in Supabase.

### Step 5: Initialize Database Schema

#### Step 5.1: Navigate to the Migrations Folder
Navigate to the `migrations` folder to prepare for database setup:

```bash
cd migrations
```

#### Step 5.2: Install Supabase CLI
Install the Supabase CLI following the [Supabase Getting Started Guide](https://supabase.com/docs/guides/cli/getting-started):

```bash
brew install supabase/tap/supabase
```

#### Step 5.3: Run Migrations
Apply the database migrations to your remote database:

```bash
# The postgres db URL can be found in the .env file from Step 4
supabase db push --db-url "postgres://postgres.your-tenant-id:your-super-secret-and-long-postgres-password@127.0.0.1:5432/postgres"
``` 

If successful, you should see output similar to the following:

```
Connecting to remote database...
Do you want to push these migrations to the remote database?
• 20240902023033_remote_schema.sql

[Y/n] Y
Applying migration 20240902023033_remote_schema.sql...
Finished supabase db push.
```

### Step 6: Start the Server
Start the server with the following command:

```bash
yarn run server:local
```

Verify the server is running by opening `http://127.0.0.1:8001/api/health_checker` in your browser.

### Step 7: Start the Client
Start the client with the following command:

```bash
yarn run client
```

Verify the client service by opening `http://127.0.0.1:3000` in your browser.
```