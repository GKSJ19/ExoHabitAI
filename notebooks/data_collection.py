import pandas as pd
import os

print(" data_collection.py started")

RAW_DATA_PATH = "data/exoplanet_data.csv"
PROCESSED_DATA_PATH = "data/exoplanet_data_cleaned.csv"


def load_dataset(path):
    print(f" Trying to load dataset from: {path}")

    if not os.path.exists(path):
        print(" File does NOT exist!")
        return None

    try:
        df = pd.read_csv(
            path,
            engine="python",
            on_bad_lines="skip"
        )
        print(" Dataset loaded successfully")
        print(f" Dataset shape: {df.shape}")
        return df
    except Exception as e:
        print(" Error loading dataset:", e)
        return None


def validate_dataset(df):
    print("\n Dataset Info:")
    print(df.info())

    print("\n Missing Values (Top 20):")
    print(df.isnull().sum().head(20))

    print("\n Statistical Summary:")
    print(df.describe(include="all").head())


def clean_dataset(df):
    print("\n Cleaning dataset...")

    before = df.shape[0]
    df = df.drop_duplicates()
    after = df.shape[0]

    print(f"🗑 Removed {before - after} duplicate rows")

    return df


def save_dataset(df, path):
    df.to_csv(path, index=False)
    print(f"\n Cleaned dataset saved to: {path}")


def main():
    print("Starting data collection pipeline...")

    df = load_dataset(RAW_DATA_PATH)
    if df is None:
        print(" Data loading failed. Exiting.")
        return

    validate_dataset(df)
    df_cleaned = clean_dataset(df)
    save_dataset(df_cleaned, PROCESSED_DATA_PATH)

    print("\n Data collection completed successfully!")


if __name__ == "__main__":
    main()

