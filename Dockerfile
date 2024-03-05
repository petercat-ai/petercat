FROM public.ecr.aws/lambda/python:3.10
# Copy function code
COPY ./server ${LAMBDA_TASK_ROOT}
# from your project folder.
COPY requirements.txt .
RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}" -U --no-cache-dir
# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ]

