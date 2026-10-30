import asyncio

from services.mcp_client import investigate_with_mcp


def url_agent(url: str) -> dict:

    print("\n🔗 URL INVESTIGATION AGENT")
    print("--------------------------")

    try:
        result = investigate_with_mcp(url)

        # Extract MCP response
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

        url_analysis = data.get(
            "url_analysis",
            {}
        )

        print("🔎 URL Tool Result:")
        print(url_analysis)

        return {
            "agent": "URL Investigation Agent",
            "url": url,
            "risk": url_analysis.get(
                "risk",
                "UNKNOWN"
            ),
            "matched_indicators":
                url_analysis.get(
                    "matched_indicators",
                    []
                )
        }

    except Exception as error:

        print(
            "❌ URL Agent Error:",
            error
        )

        return {
            "agent": "URL Investigation Agent",
            "url": url,
            "risk": "UNKNOWN",
            "matched_indicators": [],
            "error": str(error)
        }