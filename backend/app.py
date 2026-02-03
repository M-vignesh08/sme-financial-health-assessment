from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import os
import pandas as pd

# Phase 1 utilities
from backend.utils.file_parser import parse_financial_file
from backend.models.schemas import UploadResponse

# Phase 2A intelligence
from backend.analysis.financial_metrics import (
    compute_basic_metrics,
    compute_cashflow_metrics,
    compute_health_score
)
from backend.analysis.financial_analysis import analyze_financial_health


# --------------------------------------------------
# APP CONFIG
# --------------------------------------------------
app = FastAPI(
    title="SME Financial Health Assessment API",
    version="0.2.0"
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# --------------------------------------------------
# PHASE 1: FILE UPLOAD + PARSING
# --------------------------------------------------
@app.post("/upload-financials", response_model=UploadResponse)
async def upload_financials(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        parsed = parse_financial_file(file_path)

        return {
            "status": "success",
            **parsed
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# --------------------------------------------------
# PHASE 2A: FINANCIAL INTELLIGENCE (METRICS + ANALYSIS)
# --------------------------------------------------
@app.post("/analyze-financials")
async def analyze_financials(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Reuse Phase 1 parser
        parsed = parse_financial_file(file_path)

        # Convert parsed preview to DataFrame
        df = pd.DataFrame(parsed["preview"])

        if df.empty:
            raise ValueError("Parsed data is empty")

        # Normalize column names
        df.columns = [col.lower() for col in df.columns]

        # -----------------------------
        # COMPUTE NUMERICAL METRICS
        # -----------------------------
        basic_metrics = compute_basic_metrics(df)
        cashflow_metrics = compute_cashflow_metrics(df)
        health_score = compute_health_score(
            basic_metrics,
            cashflow_metrics
        )

        # -----------------------------
        # BUSINESS INTERPRETATION
        # -----------------------------
        analysis = analyze_financial_health(
            basic_metrics,
            cashflow_metrics,
            health_score
        )

        return {
            "status": "success",
            "basic_metrics": basic_metrics,
            "cashflow_metrics": cashflow_metrics,
            "health_score": health_score,
            "analysis": analysis
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
