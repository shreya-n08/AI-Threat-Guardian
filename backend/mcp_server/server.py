
import sys
import os

BACKEND_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)


from mcp.server import MCPServer

from tools.url_tool import check_url
from tools.domain_tool import check_domain

mcp = MCPServer(
    "AI Threat Guardian MCP"
)


@mcp.tool()
def investigate_url(url: str) -> dict:
    """
    Investigate a URL using multiple security tools.
    """

    url_result = check_url(url)

    domain_result = check_domain(url)

    return {
        "url": url,
        "url_analysis": url_result,
        "domain_analysis": domain_result
    }


@mcp.tool()
def check_url_safety(url: str) -> dict:
    """
    Analyze URL structure and suspicious keywords.
    """

    return check_url(url)


@mcp.tool()
def check_domain_reputation(url: str) -> dict:
    """
    Analyze domain characteristics.
    """

    return check_domain(url)


if __name__ == "__main__":
    mcp.run()