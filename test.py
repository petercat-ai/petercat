# test_import.py
try:
    from jose import jwt
    print("JOSE package imported successfully!")
except ImportError as e:
    print("Failed to import JOSE:", e)