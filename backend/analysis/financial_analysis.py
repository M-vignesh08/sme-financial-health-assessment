def analyze_financial_health(
    basic_metrics: dict,
    cashflow_metrics: dict,
    health_score: int
) -> dict:
    """
    Interprets computed metrics into business insights.
    No calculations here — only reasoning.
    """

    insights = []
    risks = []

    # Profitability insights
    if basic_metrics["net_profit"] <= 0:
        risks.append("Business is operating at a loss.")
    else:
        insights.append("Business is profitable.")

    if basic_metrics["profit_margin_percent"] < 10:
        risks.append("Low profit margin indicates cost inefficiency.")
    elif basic_metrics["profit_margin_percent"] > 25:
        insights.append("Strong profit margin compared to industry norms.")

    # Cashflow insights
    if cashflow_metrics["negative_months"] > 0:
        risks.append("Irregular cash flow detected.")
    else:
        insights.append("Stable positive cash flow.")

    # Overall health
    if health_score >= 80:
        status = "Excellent"
    elif health_score >= 60:
        status = "Good"
    elif health_score >= 40:
        status = "Moderate"
    else:
        status = "High Risk"

    return {
        "health_status": status,
        "key_insights": insights,
        "risk_flags": risks
    }
