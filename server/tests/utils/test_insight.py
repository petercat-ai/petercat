import unittest
from unittest.mock import patch, Mock
from utils.insight import get_data


class TestGetData(unittest.TestCase):

    @patch("requests.get")
    def test_get_data_success(self, mock_get):
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"2023-01": 10, "2023-02": 20, "2023-03": 30}
        mock_get.return_value = mock_response

        repo_name = "test-repo"
        metrics_mapping = {"metric1": "sum", "metric2": "average"}

        expected_result = {
            "year": [
                {"type": "sum", "date": "2023", "value": 60},
                {"type": "average", "date": "2023", "value": 60},
            ],
            "quarter": [
                {"type": "sum", "date": "2023Q1", "value": 60},
                {"type": "average", "date": "2023Q1", "value": 60},
            ],
            "month": [
                {"type": "sum", "date": "2023-01", "value": 10},
                {"type": "average", "date": "2023-01", "value": 10},
                {"type": "sum", "date": "2023-02", "value": 20},
                {"type": "average", "date": "2023-02", "value": 20},
                {"type": "sum", "date": "2023-03", "value": 30},
                {"type": "average", "date": "2023-03", "value": 30},
            ],
        }

        result = get_data(repo_name, metrics_mapping)
        self.assertEqual(result, expected_result)

    @patch("requests.get")
    def test_get_data_failure(self, mock_get):
        mock_response = Mock()
        mock_response.status_code = 500
        mock_get.return_value = mock_response

        repo_name = "test-repo"
        metrics_mapping = {"metric1": "sum"}

        expected_result = {
            "year": [],
            "quarter": [],
            "month": [],
        }

        result = get_data(repo_name, metrics_mapping)
        self.assertEqual(result, expected_result)

    @patch("requests.get")
    def test_get_data_empty_response(self, mock_get):
        # 模拟返回空数据
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {}
        mock_get.return_value = mock_response

        repo_name = "test-repo"
        metrics_mapping = {"metric1": "sum"}

        expected_result = {"year": [], "quarter": [], "month": []}

        result = get_data(repo_name, metrics_mapping)
        self.assertEqual(result, expected_result)
