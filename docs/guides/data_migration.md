## Database migrations
Database changes are managed through "migrations." Database migrations are a common way of tracking changes to your database over time.


For this guide, we'll create a table called employees and see how we can make changes to it.

> Link your project
$ supabase link --project-ref {{YOUR_SUPBASE_PROJECT_ID}} 

> Run all migrations against this project
$ supabase db push 

