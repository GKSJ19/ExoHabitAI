import streamlit as st
import requests

st.set_page_config(page_title="ExoHabitAI", layout="centered")

st.title("🌍 ExoHabitAI - Planet Habitability Predictor")

st.write("Enter planet details to check habitability:")

pl_eqt = st.number_input("Planet Equilibrium Temperature", value=0.0)
pl_rade = st.number_input("Planet Radius (Earth Radius)", value=0.0)
pl_orbsmax = st.number_input("Orbital Semi-Major Axis", value=0.0)

if st.button("Predict"):
    data = {
        "pl_eqt": pl_eqt,
        "pl_rade": pl_rade,
        "pl_orbsmax": pl_orbsmax
    }

    try:
        res = requests.post("https://exohabitai-bv4t.onrender.com/predict", json=data)

        if res.status_code == 200:
            result = res.json()
            st.success(f"Prediction: {result}")
        else:
            st.error("Server error")

    except:
        st.error("Backend not reachable")
