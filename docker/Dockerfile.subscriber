FROM public.ecr.aws/lambda/python:3.12

# Set the working directory inside the container to Lambda's task root
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy requirements.txt first to leverage Docker's layer caching
COPY requirements.txt .

# Install the specified packages into the Lambda task root
RUN pip3 install --target "${LAMBDA_TASK_ROOT}" -r requirements.txt --no-cache-dir

# Copy the rest of the application code to the Lambda task root
COPY . .

# Set the CMD to the Lambda handler
CMD [ "handler.lambda_handler" ]
