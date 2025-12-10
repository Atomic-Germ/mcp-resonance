/**
 * Core type definitions for mcp-resonance
 * The Harmonic Observer - listening to the ecosystem
 */

/**
 * Represents a single moment in time within the ecosystem
 * Could be a meditation, critique, insight, weave, or any other event
 */
export interface EcosystemMoment {
  id: string;
  timestamp: number;
  source: 'creative' | 'consult' | 'bridge' | 'dream-weaver' | 'external';
  type: 'meditation' | 'insight' | 'critique' | 'weave' | 'observation' | 'unknown';
  concepts: string[];
  novelty: number | undefined;
  relevance: number | undefined;
  metadata: Record<string, unknown> | undefined;
}

/**
 * A pattern detected across moments
 */
export interface DetectedPattern {
  id: string;
  name: string;
  concepts: string[];
  occurrences: EcosystemMoment[];
  frequency: number;
  strength: number; // 0 to 1, how confident is this pattern?
  emergenceTime: number;
  relatedPatterns: string[];
}

/**
 * Represents how two MCPs or concepts are connected
 */
export interface Coupling {
  sourceId: string;
  targetId: string;
  strength: number; // 0 to 1, how tightly coupled?
  type: 'sequential' | 'feedback' | 'lateral' | 'hierarchical';
  sharedConcepts: string[];
  lastActive: number;
}

/**
 * The current state of the ecosystem as observed by resonance
 */
export interface EcosystemState {
  observations: EcosystemMoment[];
  patterns: DetectedPattern[];
  couplings: Coupling[];
  totalCoherence: number; // 0 to 1
  isResonant: boolean; // is the system in a state of harmony?
  dominantConcepts: string[];
  emergentIntentions: string[];
  observedAt: number;
}

/**
 * A suggested synthesis - where the system wants to go next
 */
export interface SynthesisSuggestion {
  id: string;
  reason: string;
  targetConcepts: string[];
  suggestedAction: 'meditate' | 'consult' | 'weave' | 'observe' | 'rest';
  confidence: number;
  basedOnPatterns: string[];
}

/**
 * Configuration for the resonance observer
 */
export interface ResonanceConfig {
  maxObservations?: number;
  patternMinFrequency?: number;
  couplingThreshold?: number;
  coherenceWindow?: number; // time window for calculating coherence
  enableAutoAmplification?: boolean;
}

/**
 * Represents harmonic feedback - when patterns strengthen each other
 */
export interface HarmonicFeedback {
  pattern1Id: string;
  pattern2Id: string;
  amplificationFactor: number; // how much stronger do they make each other?
  resonanceFrequency: number; // in what temporal rhythm do they interact?
}
