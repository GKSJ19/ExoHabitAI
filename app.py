"""Root-level app entry point for Gunicorn - simply re-exports backend.app"""
from backend.app import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
