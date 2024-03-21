# Using a slim version for a smaller base image
FROM python:3.11.6-slim-bullseye

# Copy function code
COPY . ${LAMBDA_TASK_ROOT}
# from your project folder.
COPY requirements.txt .
RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}" -U --no-cache-dir

EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80", "--workers", "6"]