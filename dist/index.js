#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
async function main() {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.debug("IP Intelligence Search Tool running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map