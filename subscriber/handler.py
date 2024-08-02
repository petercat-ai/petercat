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
                task = task_helper.get_task_by_id(task_id)
                if not (task is None):
                    if task['node_type'] == 'tree':
                        task_helper.handle_tree_task(task)
                    else:
                        task_helper.handle_blob_task(task)
                # process message
                print(f"message content: message={message_dict}, task_id={task_id}, task={task}")
            except Exception as e:
                batch_item_failures.append({"itemIdentifier": record['messageId']})
        
        sqs_batch_response["batchItemFailures"] = batch_item_failures
        return sqs_batch_response