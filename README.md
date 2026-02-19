# ExoHabitAI – Milestone 2

## Project Overview
ExoHabitAI is a machine learning system for predicting the habitability of exoplanets using planetary and orbital features.

This repository contains the complete implementation of the Machine Learning training phase.

---

## Folder Structure

ExoHabitAI/
│
├── data/
│   └── processed/
│       ├── exohabit_ml.csv
│       └── habitability_ranked.csv
│
├── models/
│   └── random_forest.pkl
│
├── notebooks/
│   ├── train_model.py
│   └── Milestone2_ExoHabitAI_Report.pdf
│
├── preprocessing.py
└── README.md

---

## Machine Learning Pipeline

1. Data Preprocessing and Cleaning  
2. Feature Engineering and Selection  
3. Baseline Model (Logistic Regression)  
4. Primary Model (Random Forest)  
5. Model Evaluation  
6. Habitability Ranking  
7. Documentation (Milestone-2 Report)

---

## How to Run

```bash
python3 notebooks/train_model.py
