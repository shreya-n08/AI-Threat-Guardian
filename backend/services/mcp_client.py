import os
import asyncio

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


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


async def call_mcp_investigation(
    url: str
):

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


def investigate_with_mcp(url: str):

    return asyncio.run(
        call_mcp_investigation(url)
    )