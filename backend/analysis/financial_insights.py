def generate_trends(df, revenue_col, expense_col):
    if len(df) < 2:
        return {
            "revenue_trend": "insufficient data",
            "expense_trend": "insufficient data"
        }

    revenue_change = df[revenue_col].iloc[-1] - df[revenue_col].iloc[0]
    expense_change = df[expense_col].iloc[-1] - df[expense_col].iloc[0]

    revenue_trend = "increasing" if revenue_change > 0 else "decreasing" if revenue_change < 0 else "stable"
    expense_trend = "increasing" if expense_change > 0 else "decreasing" if expense_change < 0 else "stable"

    return {
        "revenue_trend": revenue_trend,
        "expense_trend": expense_trend
    }


def generate_risk_flags(basic_metrics, cashflow_metrics):
    risks = []

    if basic_metrics["net_profit"] < 0:
        risks.append("Business is running at a loss")

    if basic_metrics["profit_margin"] < 10:
        risks.append("Low profit margin")

    if cashflow_metrics["cashflow_status"] == "negative":
        risks.append("Negative cashflow detected")

    return risks


def generate_recommendations(risk_flags):
    recommendations = []

    for risk in risk_flags:
        if "loss" in risk.lower():
            recommendations.append("Reduce costs and review pricing")

        if "profit margin" in risk.lower():
            recommendations.append("Improve profit margin")

        if "cashflow" in risk.lower():
            recommendations.append("Improve cashflow management")

    if not recommendations:
        recommendations.append("Business is financially stable")

    return recommendations


def explain_health_score(basic_metrics, cashflow_metrics):
    explanation = []

    if basic_metrics["net_profit"] > 0:
        explanation.append("+20: Net profit is positive")
    else:
        explanation.append("-20: Net profit is negative")

    if basic_metrics["profit_margin"] > 20:
        explanation.append("+15: Strong profit margin")
    elif basic_metrics["profit_margin"] > 10:
        explanation.append("+10: Moderate profit margin")
    else:
        explanation.append("0: Low profit margin")

    if cashflow_metrics["cashflow_status"] == "positive":
        explanation.append("+15: Positive cashflow")
    elif cashflow_metrics["cashflow_status"] == "negative":
        explanation.append("-15: Negative cashflow")

    return explanation
