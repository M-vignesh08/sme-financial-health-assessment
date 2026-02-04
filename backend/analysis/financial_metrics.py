import pandas as pd




def compute_cashflow_metrics(
    df: pd.DataFrame,
    revenue_col: str,
    expense_col: str,
    cashflow_col: str | None = None
):
    if cashflow_col and cashflow_col in df.columns:
        df[cashflow_col] = pd.to_numeric(df[cashflow_col], errors="coerce")
        avg_cashflow = df[cashflow_col].mean()
    else:
        df["__cashflow__"] = df[revenue_col] - df[expense_col]
        avg_cashflow = df["__cashflow__"].mean()

    if avg_cashflow > 0:
        status = "positive"
    elif avg_cashflow < 0:
        status = "negative"
    else:
        status = "neutral"

    return {
        "average_cashflow": round(avg_cashflow, 2),
        "cashflow_status": status
    }


def compute_health_score(basic_metrics: dict, cashflow_metrics: dict):
    score = 50

    if basic_metrics["net_profit"] > 0:
        score += 20

    if basic_metrics["profit_margin"] > 20:
        score += 15
    elif basic_metrics["profit_margin"] > 10:
        score += 10

    if cashflow_metrics["cashflow_status"] == "positive":
        score += 15
    elif cashflow_metrics["cashflow_status"] == "negative":
        score -= 15

    return max(0, min(score, 100))

