import pandas as pd


def compute_basic_metrics(df: pd.DataFrame, revenue_col: str, expense_col: str):
    total_revenue = float(df[revenue_col].sum())
    total_expense = float(df[expense_col].sum())
    net_profit = total_revenue - total_expense

    profit_margin = (
        (net_profit / total_revenue) * 100
        if total_revenue != 0
        else 0
    )

    return {
        "total_revenue": round(total_revenue, 2),
        "total_expense": round(total_expense, 2),
        "net_profit": round(net_profit, 2),
        "profit_margin": round(profit_margin, 2)
    }


def compute_cashflow_metrics(
    df: pd.DataFrame,
    revenue_col: str,
    expense_col: str,
    cashflow_col: str | None = None
):
    if cashflow_col and cashflow_col in df.columns:
        avg_cashflow = float(pd.to_numeric(df[cashflow_col], errors="coerce").mean())
    else:
        avg_cashflow = float((df[revenue_col] - df[expense_col]).mean())

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

    return int(max(0, min(score, 100)))
