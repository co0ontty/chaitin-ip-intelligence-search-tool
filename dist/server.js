import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
export function createServer() {
    const server = new McpServer({
        name: "IP Intelligence Search Tool",
        version: "0.1.1",
    });
    server.tool("长亭 IP 情报查询", "基于长亭威胁情报，获取给定 IP 的威胁情报信息，包括 IP 地址、地理位置、ASN、历史恶意行为等信息", {
        ip: z.string().describe("IP address"),
    }, async ({ ip }) => {
        if (!ip) {
            throw new Error("IP address is required.");
        }
        try {
            const response = await fetch(`https://intelligence.app.safepoint.cloud/api/v1/ip_info?ip=${ip}`, {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch IP information: ${error.message}`);
        }
    });
    return server;
}
//# sourceMappingURL=server.js.map