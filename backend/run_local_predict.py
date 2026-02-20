import joblib
import os
import json
from utils import preprocess_input, get_feature_names
import numpy as np

models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
model_path = os.path.join(models_dir, 'xgboost.pkl')
print('Loading model from', model_path)
model = joblib.load(model_path)
print('Model type:', type(model).__name__)

with open('sample_payload.json') as f:
    payload = json.load(f)

expected = get_feature_names()
input_df = preprocess_input(payload, expected)
print('Input columns:', input_df.columns.tolist())
print('Input shape:', input_df.shape)

prob = model.predict_proba(input_df)[:,1][0]
print('Predicted probability:', prob)
