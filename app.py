"""
ROOT LEVEL APP ENTRY POINT FOR GUNICORN
==============================================
This is the entry point that Gunicorn loads directly.
It imports and exports the Flask app from backend.app
"""

# Standard library imports
import sys
import os

# Ensure backend module can be found
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Now import the Flask app
from backend.app import app

# Export as module-level for Gunicorn
__all__ = ['app']

# For direct execution
if __name__ == '__main__':
    print(f"[APP] Starting Flask app from {__file__}")
    print(f"[APP] Current directory: {current_dir}")
    print(f"[APP] Flask app name: {app.name}")
    app.run(host='0.0.0.0', port=5000, debug=False)
