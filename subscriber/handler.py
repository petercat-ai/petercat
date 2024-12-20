import json

from petercat_utils import task as task_helper
from petercat_utils.data_class import TaskType

MAX_RETRY_COUNT = 5


def lambda_handler(event, context):
    if event:
        batch_item_failures = []
        sqs_batch_response = {}

        for record in event["Records"]:
            body = record["body"]
            print(f"receive message here: {body}")

            message_dict = json.loads(body)
            task_id = message_dict["task_id"]
            task_type = message_dict["task_type"]
            retry_count = message_dict["retry_count"]
            task = task_helper.get_task(TaskType(task_type), task_id)
            try:
                if task is None:
                    return task
                task.handle()
                # process message
                print(
                    f"message content: message={message_dict}, task_id={task_id}, task={task}, retry_count={retry_count}"
                )
            except Exception as e:
                if retry_count < MAX_RETRY_COUNT:
                    retry_count += 1
                    task_helper.trigger_task(task_type, task_id, retry_count)
                else:
                    print(f"message handle error: ${e}")
                    batch_item_failures.append({"itemIdentifier": record["messageId"]})

        sqs_batch_response["batchItemFailures"] = batch_item_failures
        return sqs_batch_response
