def validate_input(data, required_fields):
    if data is None:
        return False, "No input data provided"

    for field in required_fields:
        if field not in data:
            return False, f"Missing field: {field}"

        if not isinstance(data[field], (int, float)):
            return False, f"Invalid value for field '{field}': must be a number"

    return True, None
