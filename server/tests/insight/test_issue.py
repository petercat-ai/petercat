import unittest
from unittest.mock import patch, MagicMock

from insight.service.issue import get_issue_resolution_duration


class TestGetIssueResolutionDuration(unittest.TestCase):

    @patch("insight.service.issue.requests.get")
    def test_get_issue_resolution_duration(self, mock_get):
        mock_response_data = {
            "avg": {"2024": 11.09},
            "levels": {"2024": [80, 9, 9, 19]},
            "quantile_0": {"2024": 0, "2024Q3": 3, "2024-03": 2},
            "quantile_1": {"2024": 0, "2024Q3": 22, "2024-03": 4},
            "quantile_2": {"2024": 1, "2024Q3": 32, "2024-03": 6},
            "quantile_3": {"2024": 7, "2024Q3": 44, "2024-03": 15},
            "quantile_4": {"2024": 213, "2024Q3": 54, "2024-03": 20},
        }

        mock_get.return_value = MagicMock()
        mock_get.return_value.json.return_value = mock_response_data

        result = get_issue_resolution_duration("petercat-ai/petercat")

        self.assertIn("year", result)
        self.assertIn("quarter", result)
        self.assertIn("month", result)

        self.assertEqual(len(result["year"]), 1)
        self.assertEqual(result["year"][0]["date"], "2024")
        self.assertEqual(result["year"][0]["value"], [0, 0, 1, 7, 213])

        self.assertEqual(len(result["quarter"]), 1)
        self.assertEqual(result["quarter"][0]["date"], "2024Q3")
        self.assertEqual(result["quarter"][0]["value"], [3, 22, 32, 44, 54])

        self.assertEqual(len(result["month"]), 1)
        self.assertEqual(result["month"][0]["date"], "2024-03")
        self.assertEqual(result["month"][0]["value"], [2, 4, 6, 15, 20])
