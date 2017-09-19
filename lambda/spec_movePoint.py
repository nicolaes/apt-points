import unittest
from .movePoint import lambda_handler

class TestMovePoint(unittest.TestCase):
    def test_non_get(self):
        event = {
            'httpMethod': 'POST'
        }
        res = lambda_handler(event, None)
        self.assertEqual(res, {
            'statusCode': '400'
        })


