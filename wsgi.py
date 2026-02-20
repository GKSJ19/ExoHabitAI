"""WSGI entry point for Gunicorn"""
import sys
import os

# Ensure the project root directory is in the Python path
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Import the Flask app from backend module
from backend.app import app

if __name__ == "__main__":
    app.run()
