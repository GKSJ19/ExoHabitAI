#!/usr/bin/env python
"""Test script to verify the Flask app can be imported correctly."""
import sys
import os

print("=" * 70)
print("EXOHABITAI - BACKEND IMPORT TEST")
print("=" * 70)

# Show current working directory
print(f"\nCurrent directory: {os.getcwd()}")
print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")

# Test 1: Import from wsgi (Gunicorn use case)
print("\n" + "-" * 70)
print("TEST 1: Importing from wsgi module (Production)")
print("-" * 70)
try:
    from wsgi import app as wsgi_app
    print("[OK] Successfully imported from wsgi:app")
    print(f"    Flask app: {wsgi_app}")
    print(f"    App name: {wsgi_app.name}")
except Exception as e:
    print(f"[FAILED] {e}")
    import traceback
    traceback.print_exc()

# Test 2: Import from backend.app
print("\n" + "-" * 70)
print("TEST 2: Importing from backend.app (Development)")
print("-" * 70)
try:
    from backend.app import app as backend_app
    print("[OK] Successfully imported from backend.app")
    print(f"    Flask app: {backend_app}")
    print(f"    App name: {backend_app.name}")
except Exception as e:
    print(f"[FAILED] {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)
print("TEST COMPLETED")
print("=" * 70)
print("\nTo run the Flask development server:")
print("  python -m flask --app backend.app run")
print("\nTo run with Gunicorn (production):")
print("  gunicorn wsgi:app")
print("=" * 70)
