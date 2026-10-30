from agents.threat_agent import investigate_url


url = "https://secure-bank-verification.xyz/login"

result = investigate_url(url)


print("\n==============================")
print("AI THREAT GUARDIAN")
print("==============================")

print("URL:")
print(result["url"])

print("\nOrchestrator:")
print(result["agent"])

print("\nMCP Connected:")
print(result["mcp"])

print("\nFinal Risk:")
print(result["final_risk"])

print("\nFinal Action:")
print(result["action"])


print("\n==============================")
print("AGENT RESULTS")
print("==============================")


# URL AGENT
url_agent_result = result["agents"]["url_agent"]

print("\n🔗 URL INVESTIGATION AGENT")
print("Risk:", url_agent_result["risk"])
print(
    "Indicators:",
    url_agent_result["matched_indicators"]
)


# DOMAIN AGENT
domain_agent_result = result["agents"]["domain_agent"]

print("\n🌐 DOMAIN INVESTIGATION AGENT")
print("Risk:", domain_agent_result["risk"])
print(
    "Indicators:",
    domain_agent_result["matched_indicators"]
)


# RISK AGENT
risk_agent_result = result["agents"]["risk_agent"]

print("\n🧠 RISK ASSESSMENT AGENT")
print(
    "Final Risk:",
    risk_agent_result["final_risk"]
)
print(
    "Action:",
    risk_agent_result["action"]
)
print(
    "Explanation:",
    risk_agent_result["explanation"]
)

print("\n==============================")
print("INVESTIGATION COMPLETE")
print("==============================")