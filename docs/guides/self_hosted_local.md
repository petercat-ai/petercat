# Self-Hosting

## Install Locally 

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

### Step 3: Copy the `.env.example` Files
Copy the server environment configuration example files:

```bash
cp server/.env.example server/.env
```
Copy the Client environment configuration example files:
```bash
cp client/.env.example client/.env
```

### Step 4: Update the `.env` Files
Open the `.env` file and update the necessary keys. You can use any text editor, like `vim`, `emacs`, `vscode`, or `nano`:

```bash
vim server/.env
```

For local development, configure only the Supabase and OpenAI settings:

```bash
# Supabase Project URL from https://supabase.com/dashboard/project/_/settings/database
SUPABASE_URL=https://{{YOUR_PROJECT_ID}}.supabase.co

# Supabase Project API key for `anon public`
SUPABASE_SERVICE_KEY=xxxx.yyyyy.zzzzz

# OpenAI API key
OPENAI_API_KEY=sk-xxxx
```

### Step 5: Initialize the Database Structure

#### Step 5.1: Navigate to the Migrations Folder
Navigate to the `migrations` folder to prepare for the database setup:

```bash
cd migrations
```

#### Step 5.2: Install Supabase CLI
Install the Supabase CLI following the instructions on [Supabase's Getting Started Guide](https://supabase.com/docs/guides/cli/getting-started):

```bash
brew install supabase/tap/supabase
```

#### Step 5.3: Link to the Remote Project  
To connect to the Supabase project, you'll need to enter the database password. You can find this password in the [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/database):

```bash
supabase link --project-ref {YOUR_PROJECT_ID}
```

If the connection is successful, you'll see output like this:

```
Enter your database password (or leave blank to skip):
Connecting to remote database...
Finished supabase link.
Local config differs from linked project. Try updating supabase/config.toml
[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000
```

#### Step 5.4: Perform Migration
Apply the database migrations to your remote database:

```bash
supabase db push
``` 

If successful, you'll see output similar to:

```
Connecting to remote database...
Do you want to push these migrations to the remote database?
• 20240902023033_remote_schema.sql

[Y/n] Y
Applying migration 20240902023033_remote_schema.sql...
Finished supabase db push.
```

### Step 6: Bootstrap Server
Start the server with the following command:

```bash
yarn run server
```

Check if the server is running by opening `http://127.0.0.1:8000/api/health_checker` in your browser.

### Step 7: Bootstrap Client
Start the client with the following command:

```bash
yarn run client
```

You can check the client service by opening `http://127.0.0.1:3000` in your browser.
