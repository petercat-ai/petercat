import unittest
from unittest.mock import Mock, patch, MagicMock
from insight.service.activity import get_activity_data, get_active_dates_and_times


class TestGetActivityData(unittest.TestCase):

    @patch("insight.service.activity.get_activity_data.requests.get")
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

    @patch("insight.service.activity.get_activity_data.requests.get")
    def test_get_activity_data_empty(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {}
        mock_get.return_value = mock_response
        repo_name = "petercat-ai/petercat"
        result = get_activity_data(repo_name)

        self.assertEqual(result, [])

    @patch("insight.service.activity.get_activity_data.requests.get")
    def test_get_activity_data_invalid_json(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.side_effect = ValueError("Invalid JSON")
        mock_get.return_value = mock_response

        repo_name = "petercat-ai/petercat"
        result = get_activity_data(repo_name)
        self.assertEqual(result, [])


class TestGetActiveDatesAndTimes(unittest.TestCase):

    @patch("insight.service.activity.get_active_dates_and_times.requests.get")
    def test_get_active_dates_and_times(self, mock_get):
        fake_json = {
            "2024": [0] * 168,
            "2025": [1] * 168,
            "2025Q1": [2] * 168,
            "2025-01": [3] * 168,
        }

        mock_resp = Mock()
        mock_resp.json.return_value = fake_json
        mock_resp.status_code = 200
        mock_get.return_value = mock_resp

        result = get_active_dates_and_times("petercat-ai/petercat")

        self.assertIn("year", result)
        self.assertIn("quarter", result)
        self.assertIn("month", result)

        self.assertEqual(len(result["year"]), 168)
        self.assertEqual(len(result["quarter"]), 168)
        self.assertEqual(len(result["month"]), 168)

        self.assertEqual(result["year"][0], {"day": "Mon", "hour": 0, "value": 1})
        self.assertEqual(result["year"][167], {"day": "Sun", "hour": 23, "value": 1})

        self.assertEqual(result["quarter"][0], {"day": "Mon", "hour": 0, "value": 2})
        self.assertEqual(result["quarter"][167], {"day": "Sun", "hour": 23, "value": 2})

        self.assertEqual(result["month"][0], {"day": "Mon", "hour": 0, "value": 3})
        self.assertEqual(result["month"][167], {"day": "Sun", "hour": 23, "value": 3})
