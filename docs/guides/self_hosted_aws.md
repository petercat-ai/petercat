[![演示视频](https://img.youtube.com/vi/Al6R9Ye5mBY/0.jpg)](https://www.youtube.com/watch?v=Al6R9Ye5mBY)

## Deploying Petercat on AWS with One Click: Preparation Steps

Before deploying Petercat on AWS, ensure you have completed the following prerequisites:

- Set up an AWS account.
- Install Docker locally.

## Example: Deploying Your Service Locally in Asia Pacific (Singapore) Region (ap-southeast-1)

### Step 1: Install AWS CLI and SAM CLI

1. Install the AWS CLI tool.

2. Visit the configuration documentation and configure your AWS CLI: [AWS CLI Configuration Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)

3. Install the SAM CLI tool.

4. Visit [SAM CLI Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).

### Step 2: AWS Login

Log in to your AWS account using the Single Sign-On (SSO) session:

```bash
aws sso login --sso-session $YOUR_PROFILE_NAME
```

### Step 3: Copy and Modify the Configuration File

Run the following command to copy the example configuration file:

```bash
cp .aws/petercat-example.toml .aws/petercat-ap-southeast.toml
```

### Step 4: Update the `.toml` File

Open the `.toml` file and update the necessary keys. You can use any text editor, such as `vim`, `emacs`, `vscode`, or `nano`:

```bash
vim .aws/petercat-ap-southeast.toml
```

Replace `YOUR_REGION` with `ap-southeast-1` and `YOUR_STACK_NAME` with your custom stack name, e.g., `petercat-selfhosted`.

```toml
version = 0.1
[default.deploy.parameters]
stack_name = "petercat-selfhosted"
resolve_s3 = true
s3_prefix = "petercat-selfhosted"
region = "ap-southeast-1"
confirm_changeset = true
capabilities = "CAPABILITY_IAM"
disable_rollback = true
```

### Step 5: Build the Docker Image Locally

In the root directory of the project, run the following command. This step might take a while, depending on your computer's configuration:

```bash
sam build --use-container --config-file .aws/petercat-ap-southeast.toml
```

Once the build is complete, you should see the following output:

```
Build Succeeded

Built Artifacts  : .aws-sam/build
Built Template   : .aws-sam/build/template.yaml

Commands you can use next
=========================
[*] Validate SAM template: sam validate
[*] Invoke Function: sam local invoke
[*] Test Function in the Cloud: sam sync --stack-name {{stack-name}} --watch
[*] Deploy: sam deploy --guided
```

### Step 6: Load Environment Variables and Start Deployment

In the root directory, execute the following command to load the environment variables:

```bash
source server/.env
```

Then, run the following command to deploy:

```bash
sam deploy \
    --guided \
    --no-confirm-changeset \
    --config-file .aws/petercat-ap-southeast.toml \
    --parameter-overrides APIUrl=$API_URL \
                          WebUrl=$WEB_URL \
                          AWSSecretName=$AWS_SECRET_NAME \
                          S3TempBucketName=$S3_TEMP_BUCKET_NAME \
                          GitHubAppID=$X_GITHUB_APP_ID \
                          GithubAppsClientId=$X_GITHUB_APPS_CLIENT_ID \
                          GithubAppsClientSecret=$X_GITHUB_APPS_CLIENT_SECRET \
                          OpenAIAPIKey=$OPENAI_API_KEY \
                          GeminiAPIKey=$GEMINI_API_KEY \
                          SupabaseServiceKey=$SUPABASE_SERVICE_KEY \
                          SupabaseUrl=$SUPABASE_URL \
                          TavilyAPIKey=$TAVILY_API_KEY \
                          APIIdentifier=$API_IDENTIFIER \
                          FastAPISecretKey=$FASTAPI_SECRET_KEY \
                          Auth0Domain=$AUTH0_DOMAIN \
                          Auth0ClientId=$AUTH0_CLIENT_ID \
                          Auth0ClientSecret=$AUTH0_CLIENT_SECRET
```

### Step 7: Check Your Service

CloudFormation outputs from the deployed stack:

```
------------------------------------------------------------------------------------------------------------------------------------
Outputs
------------------------------------------------------------------------------------------------------------------------------------
Key                 FastAPIFunction
Description         FastAPI Lambda Function ARN
Value               arn:aws:lambda:ap-southeast-1:654654285942:function:petercat-selfhosted-FastAPIFunction-x0bez5v1EMDL

Key                 SQSSubscriptionFunction
Description         SQS Subscription Function Lambda Function ARN
Value               arn:aws:lambda:ap-southeast-1:654654285942:function:petercat-selfhosted-SQSSubscriptionFunction-ghluUSulMO4y

Key                 FastAPIFunctionUrl
Description         Function URL for FastAPI function
Value               https://itebdgout4h33aqpy2ygxaedgm0nlnys.lambda-url.ap-southeast-1.on.aws/

Key                 SQSSubscriptionFunctionUrl
Description         Function URL for SQS Subscription function
Value               https://q7kpxukbpgxkkjldgnvvbc6dyi0akzuk.lambda-url.ap-southeast-1.on.aws/
------------------------------------------------------------------------------------------------------------------------------------
```

Test your service using `curl`:

```bash 
curl https://itebdgout4h33aqpy2ygxaedgm0nlnys.lambda-url.ap-southeast-1.on.aws/api/health_checker
```
