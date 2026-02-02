import joblib

MODEL_PATH = "models/habitability_model.pkl"

def load_model():
    model = joblib.load(MODEL_PATH)
    return model
