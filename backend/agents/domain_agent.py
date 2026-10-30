import asyncio

from services.mcp_client import investigate_with_mcp

def domain_agent(url: str) -> dict:

    print("\n🌐 DOMAIN INVESTIGATION AGENT")
    print("----------------------------")

    try:
        result = investigate_with_mcp(url)

        data = None

        if hasattr(result, "structuredContent"):
            data = result.structuredContent

        elif hasattr(result, "structured_content"):
            data = result.structured_content

        if not data:

            for content in result.content:

                if hasattr(content, "text"):

                    import json

                    try:
                        data = json.loads(content.text)
                    except Exception:
                        pass

                    if data:
                        break

        domain_analysis = data.get(
            "domain_analysis",
            {}
        )

        print("🌐 Domain Tool Result:")
        print(domain_analysis)

        return {
            "agent": "Domain Investigation Agent",
            "url": url,
            "domain":
                domain_analysis.get(
                    "domain",
                    ""
                ),
            "risk":
                domain_analysis.get(
                    "risk",
                    "UNKNOWN"
                ),
            "matched_indicators":
                domain_analysis.get(
                    "matched_indicators",
                    []
                )
        }

    except Exception as error:

        print(
            "❌ Domain Agent Error:",
            error
        )

        return {
            "agent": "Domain Investigation Agent",
            "url": url,
            "risk": "UNKNOWN",
            "matched_indicators": [],
            "error": str(error)
        }