import pandas as pd
import os

def parse_financial_file(file_path: str):
    """
    Parse uploaded financial CSV/XLSX file into a pandas DataFrame
    """

    if not os.path.exists(file_path):
        raise ValueError("File not found")

    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    elif file_path.endswith(".xlsx"):
        df = pd.read_excel(file_path)
    else:
        raise ValueError("Unsupported file format")

    return {
        "rows": len(df),
        "columns": list(df.columns),
        "preview": df.head(5).to_dict(orient="records")
    }
