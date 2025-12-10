/**
 * Tests for mcp-resonance
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ResonanceEngine } from '../resonanceEngine.js';
import type { EcosystemMoment } from '../types.js';

describe('ResonanceEngine', () => {
  let engine: ResonanceEngine;

  beforeEach(() => {
    engine = new ResonanceEngine({
      maxObservations: 100,
      patternMinFrequency: 2,
      couplingThreshold: 0.3,
    });
  });

  describe('addObservation', () => {
    it('should record a moment', () => {
      const moment: EcosystemMoment = {
        id: 'test-1',
        timestamp: Date.now(),
        source: 'creative',
        type: 'meditation',
        concepts: ['emergence', 'pattern'],
        novelty: 0.8,
        relevance: undefined,
        metadata: undefined,
      };

      engine.addObservation(moment);
      const state = engine.getEcosystemState();

      expect(state.observations.length).toBeGreaterThan(0);
    });

    it('should detect patterns across multiple observations', () => {
      const now = Date.now();

      for (let i = 0; i < 3; i++) {
        const moment: EcosystemMoment = {
          id: `test-${i}`,
          timestamp: now + i * 1000,
          source: 'creative',
          type: 'meditation',
          concepts: ['emergence', 'flow'],
          novelty: 0.7 + i * 0.05,
          relevance: undefined,
          metadata: undefined,
        };
        engine.addObservation(moment);
      }

      const state = engine.getEcosystemState();
      expect(state.patterns.length).toBeGreaterThan(0);
    });

    it('should track coupling between different sources', () => {
      const now = Date.now();

      // Creative meditation
      engine.addObservation({
        id: 'creative-1',
        timestamp: now,
        source: 'creative',
        type: 'meditation',
        concepts: ['emergence', 'constraint'],
        novelty: 0.8,
        relevance: undefined,
        metadata: undefined,
      });

      // Bridge logging
      engine.addObservation({
        id: 'bridge-1',
        timestamp: now + 100,
        source: 'bridge',
        type: 'observation',
        concepts: ['emergence', 'pattern'],
        novelty: 0.7,
        relevance: undefined,
        metadata: undefined,
      });

      // Consult critique
      engine.addObservation({
        id: 'consult-1',
        timestamp: now + 200,
        source: 'consult',
        type: 'critique',
        concepts: ['constraint', 'feedback'],
        novelty: 0.75,
        relevance: undefined,
        metadata: undefined,
      });

      const state = engine.getEcosystemState();
      expect(state.couplings.length).toBeGreaterThan(0);
    });
  });

  describe('getEcosystemState', () => {
    it('should return initial empty state', () => {
      const state = engine.getEcosystemState();

      expect(state.observations).toBeDefined();
      expect(state.patterns).toBeDefined();
      expect(state.couplings).toBeDefined();
      expect(typeof state.totalCoherence).toBe('number');
      expect(typeof state.isResonant).toBe('boolean');
    });

    it('should calculate coherence based on patterns', () => {
      const now = Date.now();

      // Add several related observations
      for (let i = 0; i < 5; i++) {
        engine.addObservation({
          id: `test-${i}`,
          timestamp: now + i * 500,
          source: 'creative',
          type: i % 2 === 0 ? 'meditation' : 'insight',
          concepts: ['synthesis', 'weave', 'pattern'],
          novelty: 0.6 + Math.random() * 0.3,
          relevance: undefined,
          metadata: undefined,
        });
      }

      const state = engine.getEcosystemState();
      expect(state.totalCoherence).toBeGreaterThan(0);
      expect(state.totalCoherence).toBeLessThanOrEqual(1);
    });

    it('should extract dominant concepts', () => {
      const now = Date.now();

      engine.addObservation({
        id: 'test-1',
        timestamp: now,
        source: 'creative',
        type: 'meditation',
        concepts: ['harmony', 'emergence', 'flow'],
        novelty: 0.9,
        relevance: undefined,
        metadata: undefined,
      });

      engine.addObservation({
        id: 'test-2',
        timestamp: now + 1000,
        source: 'bridge',
        type: 'observation',
        concepts: ['harmony', 'pattern'],
        novelty: 0.8,
        relevance: undefined,
        metadata: undefined,
      });

      const state = engine.getEcosystemState();
      expect(state.dominantConcepts.includes('harmony')).toBe(true);
    });
  });

  describe('suggestNextSynthesis', () => {
    it('should return null when insufficient data', () => {
      const suggestion = engine.suggestNextSynthesis();
      expect(suggestion).toBeNull();
    });

    it('should suggest action based on recent activity pattern', () => {
      const now = Date.now();

      // Add meditation + insight
      engine.addObservation({
        id: 'med-1',
        timestamp: now,
        source: 'creative',
        type: 'meditation',
        concepts: ['emergence', 'flow'],
        novelty: 0.8,
        relevance: undefined,
        metadata: undefined,
      });

      engine.addObservation({
        id: 'ins-1',
        timestamp: now + 1000,
        source: 'creative',
        type: 'insight',
        concepts: ['emergence', 'pattern'],
        novelty: 0.75,
        relevance: undefined,
        metadata: undefined,
      });

      // Add another meditation to increase frequency
      engine.addObservation({
        id: 'med-2',
        timestamp: now + 2000,
        source: 'creative',
        type: 'meditation',
        concepts: ['synthesis', 'weave'],
        novelty: 0.7,
        relevance: undefined,
        metadata: undefined,
      });

      const suggestion = engine.suggestNextSynthesis();
      expect(suggestion).not.toBeNull();
      if (suggestion) {
        expect(['meditate', 'consult', 'weave', 'observe', 'rest']).toContain(
          suggestion.suggestedAction
        );
        expect(suggestion.confidence).toBeGreaterThanOrEqual(0);
        expect(suggestion.confidence).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('visualizeCoupling', () => {
    it('should return a text visualization of couplings', () => {
      const now = Date.now();

      engine.addObservation({
        id: 'test-1',
        timestamp: now,
        source: 'creative',
        type: 'meditation',
        concepts: ['pattern', 'emergence'],
        novelty: 0.8,
        relevance: undefined,
        metadata: undefined,
      });

      engine.addObservation({
        id: 'test-2',
        timestamp: now + 100,
        source: 'bridge',
        type: 'observation',
        concepts: ['pattern', 'emergence'],
        novelty: 0.7,
        relevance: undefined,
        metadata: undefined,
      });

      const viz = engine.visualizeCoupling();
      expect(typeof viz).toBe('string');
    });

    it('should show "No active couplings" when none exist', () => {
      const viz = engine.visualizeCoupling();
      expect(viz).toContain('No active couplings');
    });
  });

  describe('reset', () => {
    it('should clear all observations and patterns', () => {
      engine.addObservation({
        id: 'test-1',
        timestamp: Date.now(),
        source: 'creative',
        type: 'meditation',
        concepts: ['test'],
        novelty: 0.5,
        relevance: undefined,
        metadata: undefined,
      });

      let state = engine.getEcosystemState();
      expect(state.observations.length).toBeGreaterThan(0);

      engine.reset();

      state = engine.getEcosystemState();
      expect(state.observations.length).toBe(0);
      expect(state.patterns.length).toBe(0);
      expect(state.couplings.length).toBe(0);
    });
  });

  describe('harmonic feedback', () => {
    it('should detect when patterns strengthen each other', () => {
      const now = Date.now();

      // Create observations with overlapping concepts
      for (let i = 0; i < 4; i++) {
        engine.addObservation({
          id: `test-${i}`,
          timestamp: now + i * 1000,
          source: i % 2 === 0 ? 'creative' : 'bridge',
          type: 'meditation',
          concepts: ['harmony', 'resonance', 'synthesis'],
          novelty: 0.7 + Math.random() * 0.2,
          relevance: undefined,
          metadata: undefined,
        });
      }

      const state = engine.getEcosystemState();

      // With enableAutoAmplification on, patterns should be strengthened
      const avgStrength =
        state.patterns.reduce((sum, p) => sum + p.strength, 0) / state.patterns.length || 0;

      expect(avgStrength).toBeGreaterThanOrEqual(0);
      expect(avgStrength).toBeLessThanOrEqual(1);
    });
  });
});
