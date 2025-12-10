#!/usr/bin/env node

/**
 * mcp-resonance
 * The Harmonic Observer - Listens to the ecosystem, detects patterns, amplifies emergence
 */

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

// Export for use as a library
export { ResonanceEngine, engine };
export * from './types.js';
export { createResonanceTools, handleResonanceTool };
export { BridgeIntegrationAdapter, demonstrateIntegration };

// If running as a standalone server (for future MCP integration)
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check for demo flag
  const args = process.argv.slice(2);
  
  if (args.includes('--demo')) {
    demonstrateIntegration().catch(console.error);
  } else {
    console.log('mcp-resonance initialized');
    console.log('Tools available:');
    const tools = createResonanceTools(engine);
    tools.forEach((tool) => {
      console.log(`  • ${tool.name}`);
    });
    console.log('\nRun with --demo flag to see integration in action');
  }
}
