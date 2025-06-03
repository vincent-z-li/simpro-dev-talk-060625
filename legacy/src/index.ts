import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { FieldManagementStore } from './store.js';
import { tools } from './tools.js';
import { ToolHandlers } from './handlers.js';

function initializeServer() {
  const store = new FieldManagementStore();
  const toolHandlers = new ToolHandlers(store);

  const server = new Server(
    {
      name: "simbro-demo-purpose",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await toolHandlers.handleToolCall(request);
  });

  return server;
}


async function main() {
  try {
    const server = initializeServer();
    const transport = new StdioServerTransport();
    
    await server.connect(transport);
    console.log("simbro MCP Server running on stdio");
  } catch (error) {
    console.error("Server error:", error);
    process.exit(1);
  }
}

main();