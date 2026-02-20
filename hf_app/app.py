import gradio as gr
import joblib
import numpy as np

# Load trained model
model = joblib.load("models/random_forest.pkl")

def predict(pl_rade, pl_masse, pl_orbsmax, pl_eqt, pl_dens,
            st_teff, st_lum, habitability_index,
            stellar_compatibility, orbital_stability):

    features = np.array([[pl_rade, pl_masse, pl_orbsmax,
                          pl_eqt, pl_dens,
                          st_teff, st_lum,
                          habitability_index,
                          stellar_compatibility,
                          orbital_stability]])

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    result = "Potentially Habitable" if prediction == 1 else "Not Habitable"

    return result, round(float(probability), 4)

interface = gr.Interface(
    fn=predict,
    inputs=[
        gr.Number(label="Planet Radius"),
        gr.Number(label="Planet Mass"),
        gr.Number(label="Semi-Major Axis"),
        gr.Number(label="Equilibrium Temperature"),
        gr.Number(label="Planet Density"),
        gr.Number(label="Star Temperature"),
        gr.Number(label="Star Luminosity"),
        gr.Number(label="Habitability Index"),
        gr.Number(label="Stellar Compatibility"),
        gr.Number(label="Orbital Stability")
    ],
    outputs=[
        gr.Textbox(label="Prediction"),
        gr.Textbox(label="Confidence Score")
    ],
    title="ExoHabitAI - Habitability Predictor"
)

if __name__ == "__main__":
    interface.launch()