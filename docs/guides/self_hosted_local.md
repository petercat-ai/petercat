```
# Self-Hosting Guide

## Local Installation

### Step 1: Clone the Repository
Clone the project repository to your local machine:

```bash
git clone https://github.com/petercat-ai/petercat.git
``` 

### Step 2: Install Dependencies
Install all required dependencies using Yarn:

```bash
yarn run bootstrap
```

### Step 3: Copy `.env.example` Files
Copy the server environment configuration example file:

```bash
cp server/.env.example server/.env
```
Copy the client environment configuration example file:
```bash
cp client/.env.example client/.env
```

### Step 4: Start Supabase Locally with Docker Compose

```bash
yarn run docker
```

### Step 5: Initialize the Database Schema

#### Step 5.1: Navigate to the Migrations Folder
Navigate to the `migrations` folder to prepare for database setup:

```bash
cd migrations
```

#### Step 5.2: Install Supabase CLI
Install the Supabase CLI following the instructions in the [Supabase Getting Started Guide](https://supabase.com/docs/guides/cli/getting-started):

```bash
brew install supabase/tap/supabase
```

#### Step 5.3: Apply Migrations
Apply the database migrations to your remote database:

```bash
supabase db push --db-url "postgres://postgres.your-tenant-id:your-super-secret-and-long-postgres-password@127.0.0.1:5432/postgres"
``` 

If successful, you will see output similar to the following:

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
yarn run server
```

Check if the server is running by opening `http://127.0.0.1:8000/api/health_checker` in your browser.

### Step 7: Start the Client
Start the client with the following command:

```bash
yarn run client
```

You can check the client service by opening `http://127.0.0.1:3000` in your browser.
```