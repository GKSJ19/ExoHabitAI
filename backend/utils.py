import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "logistic_regression_final.pkl"
)



def load_model():
    return joblib.load(MODEL_PATH)


