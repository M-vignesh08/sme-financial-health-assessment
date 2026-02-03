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
from backend.analysis.financial_insights import (
    generate_trends,
    generate_risk_flags,
    generate_recommendations,
    explain_health_score
)

from backend.analysis.financial_analysis import analyze_financial_health


# --------------------------------------------------
# APP CONFIG
# --------------------------------------------------
app = FastAPI(
    title="SME Financial Health Assessment API",
    version="0.2.1"  # 🔧 version bump
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# --------------------------------------------------
# HELPER: RESILIENT COLUMN FINDER
# --------------------------------------------------
def find_column(df, keywords):
    for col in df.columns:
        if any(keyword in col for keyword in keywords):
            return col
    return None


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
# PHASE 2A: FINANCIAL INTELLIGENCE
# --------------------------------------------------
@app.post("/analyze-financials")
async def analyze_financials(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Phase 1 validation
        parse_financial_file(file_path)

        # Load CSV
        df = pd.read_csv(file_path)

        # -----------------------------
        # DEFENSIVE CHECKS
        # -----------------------------
        if df.empty:
            raise ValueError("Uploaded file contains no financial records")

        # Normalize column names
        df.columns = [col.strip().lower() for col in df.columns]

        # -----------------------------
        # RESILIENT COLUMN DETECTION
        # -----------------------------
        revenue_col = find_column(df, ["revenue", "sales", "income"])
        expense_col = find_column(df, ["expense", "cost"])
        cashflow_col = find_column(df, ["cashflow", "cash_flow", "net_cash"])

        missing_cols = []
        if not revenue_col:
            missing_cols.append("revenue")
        if not expense_col:
            missing_cols.append("expense")

        if missing_cols:
            raise ValueError(
                f"Missing required financial columns: {', '.join(missing_cols)}. "
                f"Available columns: {list(df.columns)}"
            )

        # -----------------------------
        # NUMERIC SAFETY
        # -----------------------------
        df[revenue_col] = pd.to_numeric(df[revenue_col], errors="coerce")
        df[expense_col] = pd.to_numeric(df[expense_col], errors="coerce")

        if cashflow_col:
            df[cashflow_col] = pd.to_numeric(df[cashflow_col], errors="coerce")

        df.dropna(subset=[revenue_col, expense_col], inplace=True)

        if df.empty:
            raise ValueError("Financial columns contain no valid numeric data")

        # -----------------------------
        # NUMERICAL METRICS
        # -----------------------------
        basic_metrics = compute_basic_metrics(df, revenue_col, expense_col)
        cashflow_metrics = compute_cashflow_metrics(
            df,
            revenue_col,
            expense_col,
            cashflow_col
        )
        health_score = compute_health_score(
            basic_metrics,
            cashflow_metrics
        )
        # -----------------------------
        # PHASE 2B: ADVANCED INSIGHTS
        # -----------------------------
        trends = generate_trends(df, revenue_col, expense_col)

        risk_flags = generate_risk_flags(
            basic_metrics,
            cashflow_metrics
        )

        recommendations = generate_recommendations(risk_flags)

        health_score_explanation = explain_health_score(
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
            "health_score_explanation": health_score_explanation,
            "trends": trends,
            "risk_flags": risk_flags,
            "recommendations": recommendations,
            "analysis": analysis
        }

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
