/**
 * mcp-resonance
 * The Harmonic Observer - Listens to the ecosystem, detects patterns, amplifies emergence
 */
import { ResonanceEngine } from './resonanceEngine.js';
import { createResonanceTools, handleResonanceTool } from './tools.js';

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
