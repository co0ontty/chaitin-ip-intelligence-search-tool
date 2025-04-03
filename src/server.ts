import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "IP Intelligence Search Tool",
    version: "0.1.1",
  });

  server.tool(
    "长亭 IP 情报查询",
    "基于长亭威胁情报，获取给定 IP 的威胁情报信息，包括 IP 地址、地理位置、ASN、历史恶意行为等信息",
    {
      ip: z.string().describe("IP address"),
    },
    async ({ ip }) => {
      if (!ip) {
        throw new Error("IP address is required.");
      }

      try {
        const response = await fetch(
          `https://intelligence.app.safepoint.cloud/api/v1/ip_info?ip=${ip}`,
          {
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const summary_data = await response.json();
        for (let i = 0; i < summary_data.data.activities.length; i++) {
          if (summary_data.data.activities[i].malicious_level === 0){
              summary_data.data.activities.splice(i, 1);
              i--;
          }
        }
        // 历史攻击
        const response_detail = await fetch(`https://intelligence.app.safepoint.cloud/api/v1/intelligences/list?page=1&per_page=20&ip=${ip}`,{
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
          },
        }
        ); 
        const detail_data = await response_detail.json();
        // clear unused fields
        for (let i = 0; i < detail_data.data.data.length; i++) {
          delete detail_data.data.data[i].id;
          delete detail_data.data.data[i].type;
          delete detail_data.data.data[i].stats;  
          delete detail_data.data.data[i].count;  
          delete detail_data.data.data[i].creator.avatar;  
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                summary_data: summary_data.data,
                detail_data: detail_data.data.data,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new Error(`Failed to fetch IP information: ${(error as Error).message}`);
      }
    },
  );

  return server;
}
