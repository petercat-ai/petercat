import json
import boto3
from botocore.exceptions import ClientError
import logging

from data_class import ExecuteMessage

logger = logging.getLogger(__name__)
sqs = boto3.resource("sqs")

def get_queue(name):
    try:
        queue = sqs.get_queue_by_name(QueueName=name)
    except ClientError as error:
        logger.exception("Couldn't get queue named %s.", name)
        raise error
    else:
        return queue
    
def send_message(queue, message: ExecuteMessage, message_attributes=None):
    if not message_attributes:
        message_attributes = {
            "type": { "StringValue": message.type, "DataType": "String" }, 
            "repo": { "StringValue": message.repo, "DataType": "String" },
            "path": { "StringValue": message.path, "DataType": "String" },
        }

    message_body = encode_message(message=message)

    try:
        response = queue.send_message(
            MessageBody=message_body, MessageAttributes=message_attributes
        )

    except ClientError as error:
        logger.exception("Send message failed: %s", message_body)
        raise error
    else:
        return response

async def receive_messages(queue, max_number = 10, wait_time = 2):
    try:
        messages = queue.receive_messages(
            MessageAttributeNames=["All"],
            MaxNumberOfMessages=max_number,
            WaitTimeSeconds=wait_time,
        )
        for msg in messages:
            logger.info("Received message: %s: %s", msg.message_id, msg.body)
            type, repo, path = unpack_message(msg)
            yield json.dumps({ "type": type, "repo": repo, "path": path })
        delete_messages(queue, messages)

    except ClientError as error:
        logger.exception("Couldn't receive messages from queue: %s", queue)
        raise error


def delete_messages(queue, messages):
    """
    Delete a batch of messages from a queue in a single request.

    :param queue: The queue from which to delete the messages.
    :param messages: The list of messages to delete.
    :return: The response from SQS that contains the list of successful and failed
             message deletions.
    """
    try:
        entries = [
            {"Id": str(ind), "ReceiptHandle": msg.receipt_handle}
            for ind, msg in enumerate(messages)
        ]
        response = queue.delete_messages(Entries=entries)
        if "Successful" in response:
            for msg_meta in response["Successful"]:
                logger.info("Deleted %s", messages[int(msg_meta["Id"])].receipt_handle)
        if "Failed" in response:
            for msg_meta in response["Failed"]:
                logger.warning(
                    "Could not delete %s", messages[int(msg_meta["Id"])].receipt_handle
                )
    except ClientError:
        logger.exception("Couldn't delete messages from queue %s", queue)
    else:
        return response
    
def encode_message(message: ExecuteMessage):
    return json.dumps({
        "type": message.type,
        "repo": message.repo,
        "path": message.path,
    })

def unpack_message(msg):
    if (msg is None):
        return (f"", f"", f"")
    else:
        return (
            msg.message_attributes["type"]["StringValue"],
            msg.message_attributes["repo"]["StringValue"],
            msg.message_attributes["path"]["StringValue"],
        )