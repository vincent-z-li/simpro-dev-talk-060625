import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { tools } from './tools';
import { McpHandlerService } from './mcp-handler.service';

@Injectable()
export class McpService implements OnModuleInit {
  private server: Server;

  constructor(private mcpHandler: McpHandlerService) {}

  async onModuleInit() {
    this.initializeServer();
    await this.startServer();
  }

  private initializeServer() {
    this.server = new Server(
      {
        name: "simbro-nestjs-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      return await this.mcpHandler.handleToolCall(request);
    });
  }

  private async startServer() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      process.stderr.write('MCP server connected successfully\n');
    } catch (error) {
      process.stderr.write(`MCP Server error: ${error}\n`);
    }
  }
}
