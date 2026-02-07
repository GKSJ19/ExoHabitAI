# from flask import Flask, request, jsonify
# import joblib
# import pandas as pd
# import numpy as np

# app = Flask(__name__)

# # Load model
# model = joblib.load("C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/models/exohabit_model.pkl")

# # Load feature template
# df = pd.read_csv("C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/data/processed/reprocessed.csv")
# FEATURES = df.drop("habitable", axis=1).columns.tolist()

# @app.route("/")
# def home():
#     return "🌍 ExoHabitAI Running!"

# @app.route("/predict", methods=["POST"])
# def predict():

#     data = request.json

#     input_df = pd.DataFrame(np.zeros((1, len(FEATURES))), columns=FEATURES)

#     for key in data:
#         if key in input_df.columns:
#             input_df[key] = data[key]

#     prediction = model.predict(input_df)[0]
#     probability = model.predict_proba(input_df)[0][1]

#     return jsonify({
#         "status": "Habitable" if prediction == 1 else "Not Habitable",
#         "probability": round(float(probability) * 100, 2)
#     })

# if __name__ == "__main__":
#     app.run(debug=True)














from flask import Flask, request, jsonify, send_from_directory
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__, static_folder="../frontend")

model = joblib.load("C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/models/exohabit_model.pkl")
df = pd.read_csv("C:/Users/Admin/OneDrive/Desktop/ExoHabitAI/data/processed/reprocessed.csv")

FEATURES = df.drop("habitable", axis=1).columns.tolist()

@app.route("/")
def home():
    return send_from_directory("../frontend", "index.html")

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    input_df = pd.DataFrame(np.zeros((1,len(FEATURES))), columns=FEATURES)

    for k in data:
        if k in input_df.columns:
            input_df[k] = data[k]

    pred = model.predict(input_df)[0]
    prob = model.predict_proba(input_df)[0][1]

    return jsonify({
        "status":"Habitable" if pred==1 else "Not Habitable",
        "probability":round(float(prob)*100,2)
    })

if __name__=="__main__":
    app.run(debug=True)
