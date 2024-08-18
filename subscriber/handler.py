import json

from petercat_utils import task as task_helper


def lambda_handler(event, context):
    if event:
        batch_item_failures = []
        sqs_batch_response = {}

        for record in event["Records"]:
            try:
                body = record["body"]
                print(f"receive message here: {body}")

                message_dict = json.loads(body)
                task_id = message_dict["task_id"]
                task_type = message_dict["task_type"]
                task = task_helper.get_task(task_type, task_id)
                if task is None:
                    return task
                task.handle()

                # process message
                print(f"message content: message={message_dict}, task_id={task_id}, task={task}")
            except Exception as e:
                print(f"message handle error: ${e}")
                batch_item_failures.append({"itemIdentifier": record['messageId']})

        sqs_batch_response["batchItemFailures"] = batch_item_failures
        return sqs_batch_response
