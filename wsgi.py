"""WSGI entry point for Gunicorn"""
import sys
import os

# Get absolute paths
current_file = os.path.abspath(__file__)
current_dir = os.path.dirname(current_file)

# Ensure project root is in Python path for imports
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Also add parent directory in case we're deployed in a subdirectory
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

print(f"[WSGI] Starting with file: {current_file}")
print(f"[WSGI] Project root: {current_dir}")
print(f"[WSGI] sys.path updated with {current_dir}")

# Import Flask app - this is what Gunicorn will call
from backend.app import app

# Export as module-level variable for Gunicorn
__all__ = ['app']

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
