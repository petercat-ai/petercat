import pytest  
import json
import os

from server.event_handler.pull_request import PullRequestEventHandler

def test_event_handler():
    filepath = os.path.join(os.path.dirname(__file__), 'pull_request_event.json')
    with open(filepath) as ev:
        event = json.load(ev)
        handler = PullRequestEventHandler(payload = event, access_token="123")
        result = handler.execute()
        assert result["success"] == True
