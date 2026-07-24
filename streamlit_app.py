import streamlit as st
import numpy as np
import pandas as pd
import joblib
import os

st.set_page_config(page_title="Exohabitat", layout="wide")
st.title("🌍 Planet Habitability Predictor")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "habitability_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

FEATURES = [
    "pl_rade", "pl_bmasse", "pl_orbper", "pl_eqt",
    "pl_dens", "st_teff", "st_rad", "st_mass", "st_lum"
]

st.markdown("### 📊 Enter Planet Parameters")

col1, col2 = st.columns(2)
with col1:
    pl_rade = st.number_input("🌍 Planet Radius (Earth Radii)", 0.1, 20.0, 1.0, 0.1)
    pl_bmasse = st.number_input("⚖️ Planet Mass (Earth Mass)", 0.1, 500.0, 1.0, 0.1)
    pl_orbper = st.number_input("🔄 Orbital Period (days)", 0.1, 20000.0, 365.0, 1.0)
with col2:
    pl_eqt = st.number_input("🌡️ Equilibrium Temperature (K)", 50.0, 3000.0, 288.0, 1.0)
    st_teff = st.number_input("⭐ Star Effective Temperature (K)", 2000.0, 15000.0, 5772.0, 1.0)
    st_rad = st.number_input("☀️ Star Radius (Solar Radii)", 0.05, 20.0, 1.0, 0.1)

pl_dens = st.number_input("🪨 Planet Density (g/cm³)", 0.1, 30.0, 5.5, 0.1)
st_mass = st.number_input("🌟 Star Mass (Solar Mass)", 0.05, 20.0, 1.0, 0.1)
st_lum = st.number_input("💡 Star Luminosity (log Solar)", -5.0, 5.0, 0.0, 0.1)

if st.button("🔮 Predict Habitability", use_container_width=True):
    raw_input = pd.DataFrame([{
        "pl_rade": pl_rade,
        "pl_bmasse": pl_bmasse,
        "pl_orbper": pl_orbper,
        "pl_eqt": pl_eqt,
        "pl_dens": pl_dens,
        "st_teff": st_teff,
        "st_rad": st_rad,
        "st_mass": st_mass,
        "st_lum": st_lum
    }])

    scaled_input = pd.DataFrame( scaler.transform(raw_input[FEATURES]),
        columns=FEATURES
    )

    score = model.predict_proba(scaled_input)[:, 1][0]

    st.success("✅ Analysis Complete!")
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Habitability Score", f"{score:.3f}")
        st.progress(score)
    with col2:
        if score > 0.5:
            st.markdown("### 🌟 **HABITABLE**")
            st.success("Strong potential for life!")
        else:
            st.markdown("### ❌ **NOT HABITABLE**")
            st.error("Conditions unlikely to support life.")

