import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app  # Now Python knows where to find it

def test_index_route():
    tester = app.test_client()
    response = tester.get('/')
    assert response.status_code == 200
    assert b"Real-Time Traffic Dashboard" in response.data
    print("test_app test case passed!")

if __name__ == '__main__':
    test_index_route()
