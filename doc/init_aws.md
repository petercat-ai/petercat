### 

### Install AWS Cli / Login AWS
1. [Installing AWS Cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)
2. [Create your AWS IAM Account Access Token](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
3. [Configure the AWS CLI to use AWS IAM Identity Center](https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html#sso-configure-profile-token-auto-sso) 

#### Login your IAM Account
https://ap-northeast-1.signin.aws/platform/login

### Build docker

#### Docker Login 

```bash
aws ecr get-login-password \
        --region ap-northeast-1 | docker login \
        --username AWS \
        --password-stdin 654654285942.dkr.ecr.ap-northeast-1.amazonaws.com/xuexiao
```

#### Build Docker Image
```bash
docker build -t bot-meta .
```

> If successful, the command line will display the following information:
> 
> ```
> ➜  bot-meta git:(main) ✗ docker build -t bot-meta .
> [+] Building 19.0s (7/8)                                   docker:desktop-linux
> => [internal] load build definition from Dockerfile                       0.0s
> => => transferring dockerfile: 432B                                       0.0s
> => [internal] load metadata for public.ecr.aws/lambda/python:3.10         0.5s
> => [internal] load .dockerignore                                          0.0s
> => => transferring context: 2B                                            0.0s
> => [1/4] FROM public.ecr.aws/lambda/python:3.10@sha256:5b2fff723b6dfd1f4  0.0s
> => [internal] load build context                                          0.0s
> => => transferring context: 1.27kB                                        0.0s
> => CACHED [2/4] COPY ./server /var/task                                   0.0s
> => CACHED [3/4] COPY requirements.txt .                                   0.0s
> => [4/4] RUN pip3 install -r requirements.txt --target "/var/task" -U -  18.5s
> => => # x2014_aarch64.whl (677 kB)
> => => #      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 677.0/677.0 kB 439.9 kB/s e
> => => # ta 0:00:00
> => => # Collecting uvloop!=0.15.0,!=0.15.1,>=0.14.0
> => => #   Downloading uvloop-0.19.0-cp310-cp310-manylinux_2_17_aarch64.manylin
> => => # ux2014_aarch64.whl (3.4 MB)
> ```

#### Tag and Push Docker Image

```bash
docker tag bot-meta:latest 654654285942.dkr.ecr.ap-northeast-1.amazonaws.com/xuexiao:latest
```

```
docker push 654654285942.dkr.ecr.ap-northeast-1.amazonaws.com/xuexiao:latest
```