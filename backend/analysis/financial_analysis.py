def analyze_financial_health(
    basic_metrics: dict,
    cashflow_metrics: dict,
    health_score: int
) -> dict:

    insights = []
    risks = []

    if basic_metrics["net_profit"] <= 0:
        risks.append("Business is operating at a loss.")
    else:
        insights.append("Business is profitable.")

    if basic_metrics["profit_margin"] < 10:
        risks.append("Low profit margin indicates cost inefficiency.")
    elif basic_metrics["profit_margin"] > 25:
        insights.append("Strong profit margin compared to industry norms.")

    if cashflow_metrics["cashflow_status"] == "negative":
        risks.append("Irregular or negative cash flow detected.")
    else:
        insights.append("Stable positive cash flow.")

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
def generate_ai_insights(
    basic_metrics: dict,
    cashflow_metrics: dict,
    health_score: int
) -> list[str]:
    """
    AI-style reasoning layer.
    Converts financial metrics into human-readable insights.
    Rule-based, deterministic, interview-safe.
    """

    insights = []

    # Overall health
    if health_score >= 80:
        insights.append("The business shows excellent overall financial health.")
    elif health_score >= 60:
        insights.append("The business is financially stable but has room for improvement.")
    elif health_score >= 40:
        insights.append("The business has moderate financial risk and should optimize operations.")
    else:
        insights.append("The business is at high financial risk and needs immediate attention.")

    # Profitability
    if basic_metrics["net_profit"] > 0:
        insights.append("The business is operating profitably.")
    else:
        insights.append("The business is currently operating at a loss.")

    if basic_metrics["profit_margin"] < 10:
        insights.append("Low profit margin suggests high operating or overhead costs.")
    elif basic_metrics["profit_margin"] > 25:
        insights.append("Strong profit margin indicates efficient cost management.")

    # Cash flow
    if cashflow_metrics["cashflow_status"] == "positive":
        insights.append("Cash flow is stable, supporting smooth day-to-day operations.")
    elif cashflow_metrics["cashflow_status"] == "negative":
        insights.append("Negative cash flow indicates potential liquidity issues.")

    return insights

