
import asyncio
import os

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from agents.url_agent import url_agent
from agents.domain_agent import domain_agent
from agents.risk_agent import risk_agent


# ============================================================
# MCP SERVER CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MCP_SERVER_PATH = os.path.join(
    BASE_DIR,
    "mcp_server",
    "server.py"
)


# ============================================================
# MCP CLIENT
# ============================================================

async def investigate_with_mcp(url: str) -> dict:

    server_params = StdioServerParameters(
        command=os.sys.executable,
        args=[MCP_SERVER_PATH]
    )

    async with stdio_client(
        server_params
    ) as (read, write):

        async with ClientSession(
            read,
            write
        ) as session:

            await session.initialize()

            result = await session.call_tool(
                "investigate_url",
                {
                    "url": url
                }
            )

            return result


# ============================================================
# MULTI-AGENT ORCHESTRATOR
# ============================================================

def investigate_url(url: str) -> dict:

    print("\n")
    print("=" * 60)
    print("🛡️ AI THREAT GUARDIAN")
    print("=" * 60)

    print("\n🎯 ORCHESTRATOR AGENT")
    print("---------------------")

    print(
        "Delegating investigation to "
        "specialized security agents..."
    )

    # --------------------------------------------------------
    # AGENT 1
    # --------------------------------------------------------

    url_result = url_agent(url)

    # --------------------------------------------------------
    # AGENT 2
    # --------------------------------------------------------

    domain_result = domain_agent(url)

    # --------------------------------------------------------
    # AGENT 3
    # --------------------------------------------------------

    final_result = risk_agent(
        url_result,
        domain_result
    )

    # --------------------------------------------------------
    # FINAL MULTI-AGENT RESULT
    # --------------------------------------------------------

    return {

        "url": url,

        "agent":
            "Threat Investigation Orchestrator",

        "mcp": True,

        "agents": {

            "url_agent":
                url_result,

            "domain_agent":
                domain_result,

            "risk_agent":
                final_result
        },

        "final_risk":
            final_result["final_risk"],

        "action":
            final_result["action"],

        "matched_indicators":
            final_result["matched_indicators"],

        "message":
            final_result["explanation"]
    }