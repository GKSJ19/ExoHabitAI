import pandas as pd
import os

PROCESSED_DATA_PATH = "data/processed/exoplanet_ml_ready.csv"
OUTPUT_PATH = "data/processed/habitable_planets.csv"

def show_habitable_planets():
    print(" Analyzing habitable planets...")

    if not os.path.exists(PROCESSED_DATA_PATH):
        print(" Preprocessed file not found!")
        return

    # Load preprocessed data
    df = pd.read_csv(PROCESSED_DATA_PATH)

    print(" Total planets after preprocessing:", len(df))

    # Separate habitable and non-habitable planets
    habitable = df[df["habitable"] == 1]
    non_habitable = df[df["habitable"] == 0]

    print(" Habitable planets count:", len(habitable))
    print(" Non-habitable planets count:", len(non_habitable))

    # Show sample habitable planets
    print("\n Sample Habitable Planets:")
    print(habitable.head())

    # Save habitable planets to separate CSV
    habitable.to_csv(OUTPUT_PATH, index=False)
    print("\n Habitable planets saved to:", OUTPUT_PATH)


if __name__ == "__main__":
    show_habitable_planets()
