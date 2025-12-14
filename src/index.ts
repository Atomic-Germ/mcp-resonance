#!/usr/bin/env node

/**
 * mcp-resonance
 * The Harmonic Observer - Listens to the ecosystem, detects patterns, amplifies emergence
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ResonanceEngine } from './resonanceEngine.js';
import { createResonanceTools, handleResonanceTool } from './tools.js';
import { BridgeIntegrationAdapter, demonstrateIntegration } from './bridgeIntegration.js';

// Initialize the resonance engine
const engine = new ResonanceEngine({
  maxObservations: 500,
  patternMinFrequency: 2,
  couplingThreshold: 0.3,
  coherenceWindow: 300000, // 5 minutes
  enableAutoAmplification: true,
});

// Create MCP server
const server = new Server(
  {
    name: 'mcp-resonance',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = createResonanceTools(engine);
  return {
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const params = request.params as { name: string; arguments?: Record<string, unknown> };
  const { name, arguments: args } = params;
  try {
    const result = await handleResonanceTool(engine, name, args || {});
    return {
      content: [result],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// Export for use as a library
export { ResonanceEngine, engine };
export * from './types.js';
export { createResonanceTools, handleResonanceTool };
export { BridgeIntegrationAdapter, demonstrateIntegration };

// Run the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('mcp-resonance MCP server started');
