# utils.py

def validate_input(data, required_fields):
    """
    Validate incoming JSON data against required ML features
    """
    if data is None:
        return False, "No input data provided"

    for field in required_fields:
        if field not in data:
            return False, f"Missing field: {field}"

        if not isinstance(data[field], (int, float)):
            return False, f"Invalid value for field: {field}"

    return True, None