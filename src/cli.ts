#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { engine } from './index.js';
import { createResonanceTools, handleResonanceTool } from './tools.js';

async function main(): Promise<void> {
  const server = new McpServer({
    name: 'mcp-resonance',
    version: '1.1.1',
  });

  const tools = createResonanceTools(engine);

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        title: tool.name,
        description: tool.description,
        // SDK accepts JSON Schema or Zod; our tools provide JSON Schema objects
        inputSchema: tool.inputSchema as any,
      },
      async (args: Record<string, unknown>) => {
        const content = await handleResonanceTool(engine, {
          name: tool.name,
          arguments: args,
        });

        return { content: [content] };
      }
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('mcp-resonance MCP server running on stdio');
}

main().catch((error) => {
  console.error('Failed to start mcp-resonance:', error);
  process.exit(1);
});
