def risk_agent(
    url_result: dict,
    domain_result: dict
) -> dict:

    print("\n🧠 RISK ASSESSMENT AGENT")
    print("-----------------------")

    findings = [
        url_result,
        domain_result
    ]

    high_count = sum(
        1
        for result in findings
        if result.get("risk") == "HIGH"
    )

    medium_count = sum(
        1
        for result in findings
        if result.get("risk") == "MEDIUM"
    )

    all_indicators = []

    for result in findings:

        all_indicators.extend(
            result.get(
                "matched_indicators",
                []
            )
        )

    # Remove duplicates
    all_indicators = list(
        dict.fromkeys(all_indicators)
    )

    if high_count >= 1:

        final_risk = "HIGH"
        action = "BLOCK"

        explanation = (
            "Multiple security indicators "
            "suggest that this URL may be "
            "associated with phishing or fraud."
        )

    elif medium_count >= 1:

        final_risk = "MEDIUM"
        action = "WARN"

        explanation = (
            "Potentially suspicious indicators "
            "were detected. Proceed carefully."
        )

    else:

        final_risk = "LOW"
        action = "ALLOW"

        explanation = (
            "No major suspicious indicators "
            "were detected."
        )

    result = {
        "agent": "Risk Assessment Agent",
        "final_risk": final_risk,
        "action": action,
        "matched_indicators": all_indicators,
        "explanation": explanation
    }

    print("🚨 Final Risk:", final_risk)
    print("🎯 Action:", action)

    return result