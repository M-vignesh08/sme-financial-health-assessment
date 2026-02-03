def generate_trends(df, revenue_col, expense_col):
    """
    Detect simple revenue and expense trends.
    """

    if len(df) < 2:
        return {
            "revenue_trend": "insufficient data",
            "expense_trend": "insufficient data"
        }

    revenue_change = df[revenue_col].iloc[-1] - df[revenue_col].iloc[0]
    expense_change = df[expense_col].iloc[-1] - df[expense_col].iloc[0]

    if revenue_change > 0:
        revenue_trend = "increasing"
    elif revenue_change < 0:
        revenue_trend = "decreasing"
    else:
        revenue_trend = "stable"

    if expense_change > 0:
        expense_trend = "increasing"
    elif expense_change < 0:
        expense_trend = "decreasing"
    else:
        expense_trend = "stable"

    return {
        "revenue_trend": revenue_trend,
        "expense_trend": expense_trend
    }


def generate_risk_flags(basic_metrics, cashflow_metrics):
    """
    Identify financial risk signals.
    """

    risks = []

    if basic_metrics["net_profit"] < 0:
        risks.append("Business is running at a loss")

    if basic_metrics["profit_margin"] < 10:
        risks.append("Low profit margin")

    if cashflow_metrics["cashflow_status"] == "negative":
        risks.append("Negative cashflow detected")

    return risks


def generate_recommendations(risk_flags):
    """
    Generate business recommendations based on risks.
    """

    recommend
