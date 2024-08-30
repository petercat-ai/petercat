# Self-Hosting with Docker

Docker is the easiest way to get started with self-hosted Petercat. This guide assumes you are running the command from the machine you intend to host from.

## Before you begin

You need the following installed in your system: 
- [Git](https://git-scm.com/downloads)
- Docker ([Windows](https://docs.docker.com/desktop/install/windows-install/), [MacOS](https://docs.docker.com/desktop/install/mac-install/), or [Linux](https://docs.docker.com/desktop/install/linux-install/)).


## Running Petercat

Follow these steps to start Supabase locally:


- **Step 0**: Clone the repository:

  ```bash
  git clone https://github.com/petercat-ai/petercat.git && cd server
  ```

- **Step 1**: Copy the `.env.example` files

  ```bash
  cp .env.example .env
  ```

- **Step 2**: Update the `.env` files

  ```bash
  vim .env # or emacs or vscode or nano
  ```
  Update services keys in the `.env` file.
  
  ***OPENAI***:
  
  You need to update the `OPENAI_API_KEY` variable in the `.env` file. You can get your API key [here](https://platform.openai.com/api-keys). You need to create an account first. And put your credit card information. Don't worry, you won't be charged unless you use the API. You can find more information about the pricing [here](https://openai.com/pricing/).

  ***SUPABASE***:

  You need to update the `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` variable in the `.env` file. You can get your help from [here](https://supabase.com/docs/guides/database/connecting-to-postgres#finding-your-database-hostname). You need to create a supabase account first. 


- **Step 4**: Launch the project

  ```bash
  docker compose --env-file .env -f docker/docker-compose.yml up
  ```
