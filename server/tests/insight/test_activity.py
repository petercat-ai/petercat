import unittest
from unittest.mock import patch, MagicMock
from insight.service.activity import get_activity_data


class TestGetActivityData(unittest.TestCase):

    @patch("insight.service.activity.requests.get")
    def test_get_activity_data(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "2023-12": [("user1", 10), ("user2", 5)],
            "2024-01": [("user3", 20)],
            "2024-02": [("user4", 25)],
            "2024-03": [("user5", 30)],
        }
        mock_get.return_value = mock_response
        repo_name = "petercat-ai/petercat"
        expected_result = [{"user": "user5", "value": 30}]

        result = get_activity_data(repo_name)

        self.assertIsInstance(result, list)
        self.assertEqual(result, expected_result)

    @patch("insight.service.activity.requests.get")
    def test_get_activity_data_empty(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {}
        mock_get.return_value = mock_response
        repo_name = "petercat-ai/petercat"
        result = get_activity_data(repo_name)

        self.assertEqual(result, [])

    @patch("insight.service.activity.requests.get")
    def test_get_activity_data_invalid_json(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.side_effect = ValueError("Invalid JSON")
        mock_get.return_value = mock_response

        repo_name = "petercat-ai/petercat"
        result = get_activity_data(repo_name)
        self.assertEqual(result, [])
