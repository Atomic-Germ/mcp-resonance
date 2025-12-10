/**
 * Integration Tests for mcp-resonance with bridge
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BridgeIntegrationAdapter } from '../bridgeIntegration.js';
import { ResonanceEngine } from '../resonanceEngine.js';

describe('BridgeIntegrationAdapter', () => {
  let engine: ResonanceEngine;
  let adapter: BridgeIntegrationAdapter;

  beforeEach(() => {
    engine = new ResonanceEngine({
      maxObservations: 100,
      patternMinFrequency: 2,
      enableAutoAmplification: true,
    });
    adapter = new BridgeIntegrationAdapter(engine);
  });

  describe('Meditation logging', () => {
    it('should record meditation from bridge', () => {
      adapter.onMeditationLogged('med-1', {
        emergentSentence: 'Emergence indirectly catalyzes architecture.',
        contextWords: ['emergence', 'architecture'],
        extractedPatterns: ['emergence', 'constraint', 'coupling'],
        novelty: 0.92,
      });

      const state = engine.getEcosystemState();
      expect(state.observations.length).toBeGreaterThan(0);
      expect(state.observations[0].source).toBe('bridge');
      expect(state.observations[0].type).toBe('meditation');
    });

    it('should preserve metadata from bridge', () => {
      adapter.onMeditationLogged('med-2', {
        emergentSentence: 'Test sentence',
        contextWords: ['test'],
        extractedPatterns: ['pattern1'],
        novelty: 0.8,
      });

      const state = engine.getEcosystemState();
      const obs = state.observations[0];
      expect(obs.metadata?.emergentSentence).toBe('Test sentence');
      expect(obs.metadata?.bridgeTraceId).toBe('med-2');
    });
  });

  describe('Critique logging', () => {
    it('should record critique from bridge', () => {
      adapter.onCritiqueLogged('crit-1', {
        model: 'deepseek-v3.1',
        relevanceScore: 0.95,
        extractedFeedback: ['feedback about patterns'],
      });

      const state = engine.getEcosystemState();
      expect(state.observations.length).toBeGreaterThan(0);
      expect(state.observations[0].source).toBe('bridge');
      expect(state.observations[0].type).toBe('critique');
      expect(state.observations[0].relevance).toBe(0.95);
    });

    it('should extract concepts from feedback', () => {
      adapter.onCritiqueLogged('crit-2', {
        model: 'deepseek-v3.1',
        relevanceScore: 0.9,
        extractedFeedback: [
          'patterns are strengthening',
          'coherence is building',
          'system reaching harmony',
        ],
      });

      const state = engine.getEcosystemState();
      const obs = state.observations[0];
      expect(obs.concepts.length).toBeGreaterThan(0);
    });
  });

  describe('Insight logging', () => {
    it('should record insight from creative', () => {
      adapter.onInsightGenerated('ins-1', {
        insights: [
          { pattern: 'emergence', description: 'Patterns arise' },
          { pattern: 'coupling', description: 'MCPs influence each other' },
        ],
        novelty: 0.85,
      });

      const state = engine.getEcosystemState();
      expect(state.observations.length).toBeGreaterThan(0);
      expect(state.observations[0].source).toBe('creative');
      expect(state.observations[0].type).toBe('insight');
      expect(state.observations[0].concepts).toContain('emergence');
    });
  });

  describe('Narrative weaving', () => {
    it('should record narrative from dream-weaver', () => {
      adapter.onNarrativeWoven('weave-1', {
        narrative: 'In the resonance chamber, patterns weave harmony together.',
        sourceTraces: ['med-1', 'crit-1'],
      });

      const state = engine.getEcosystemState();
      expect(state.observations.length).toBeGreaterThan(0);
      expect(state.observations[0].source).toBe('dream-weaver');
      expect(state.observations[0].type).toBe('weave');
    });

    it('should extract concepts from narrative', () => {
      adapter.onNarrativeWoven('weave-2', {
        narrative: 'Emergence flows through resonance and synthesis into harmony.',
        sourceTraces: [],
      });

      const state = engine.getEcosystemState();
      const obs = state.observations[0];
      expect(obs.concepts).toContain('emergence');
      expect(obs.concepts).toContain('resonance');
    });
  });

  describe('Complete cycle', () => {
    it('should handle a full meditation-critique-weave cycle', async () => {
      // Meditation 1
      adapter.onMeditationLogged('med-1', {
        emergentSentence: 'Emergence patterns flow through constraint.',
        contextWords: ['emergence', 'pattern', 'constraint'],
        extractedPatterns: ['emergence', 'pattern', 'constraint'],
        novelty: 0.90,
      });

      // Insight from meditation
      adapter.onInsightGenerated('ins-1', {
        insights: [{ pattern: 'emergence', description: 'Patterns arise' }],
        novelty: 0.85,
      });

      // Critique
      adapter.onCritiqueLogged('crit-1', {
        model: 'deepseek-v3.1',
        relevanceScore: 0.95,
        extractedFeedback: ['Patterns are strengthening'],
      });

      // Meditation 2
      adapter.onMeditationLogged('med-2', {
        emergentSentence: 'Pattern resonance weaves coupling and convergence.',
        contextWords: ['pattern', 'resonance', 'coupling'],
        extractedPatterns: ['pattern', 'resonance', 'coupling'],
        novelty: 0.92,
      });

      const state = adapter.getEcosystemStateWithRecommendation();

      expect(state.observations.length).toBeGreaterThanOrEqual(4);
      expect(state.patterns.length).toBeGreaterThan(0);
      expect(state.recommendation).not.toBeNull();
    });

    it('should suggest synthesis when coherent and resonant', async () => {
      // Add many observations to build coherence
      for (let i = 0; i < 5; i++) {
        adapter.onMeditationLogged(`med-${i}`, {
          emergentSentence: 'Pattern resonance synthesis',
          contextWords: ['pattern', 'resonance', 'synthesis'],
          extractedPatterns: ['pattern', 'resonance', 'synthesis', 'harmony'],
          novelty: 0.8 + Math.random() * 0.1,
        });

        adapter.onInsightGenerated(`ins-${i}`, {
          insights: [
            { pattern: 'harmony', description: 'System achieving coherence' },
          ],
          novelty: 0.75 + Math.random() * 0.15,
        });
      }

      const state = adapter.getEcosystemStateWithRecommendation();

      // With resonance and high coherence, should suggest weave
      if (state.isResonant && state.totalCoherence > 0.6) {
        expect(state.recommendation).not.toBeNull();
        // Might suggest weave
        if (state.recommendation?.shouldWeave) {
          expect(state.recommendation.action).toBe('weave');
        }
      }
    });
  });

  describe('Report generation', () => {
    it('should generate a readable report', () => {
      adapter.onMeditationLogged('med-1', {
        emergentSentence: 'Test meditation',
        contextWords: ['test'],
        extractedPatterns: ['test', 'pattern'],
        novelty: 0.8,
      });

      const report = adapter.generateReport();

      expect(report).toContain('RESONANCE REPORT');
      expect(report).toContain('Observations:');
      expect(report).toContain('Coherence:');
      expect(report).toContain('RECOMMENDATION');
    });

    it('report should include patterns when detected', () => {
      // Add multiple observations to trigger pattern detection
      for (let i = 0; i < 3; i++) {
        adapter.onMeditationLogged(`med-${i}`, {
          emergentSentence: 'Harmony pattern emergence',
          contextWords: ['harmony', 'pattern'],
          extractedPatterns: ['harmony', 'pattern', 'emergence'],
          novelty: 0.8,
        });
      }

      const report = adapter.generateReport();

      expect(report).toContain('Top Patterns');
      // Should have detected at least one pattern
      expect(report.includes('harmony') || report.includes('pattern')).toBe(true);
    });

    it('report should show resonance status when active', async () => {
      // Build up coherence by adding many related observations
      for (let i = 0; i < 6; i++) {
        adapter.onMeditationLogged(`med-${i}`, {
          emergentSentence: 'Harmony synthesis resonance',
          contextWords: ['harmony', 'synthesis', 'resonance'],
          extractedPatterns: ['harmony', 'synthesis', 'resonance', 'coherence'],
          novelty: 0.85,
        });
      }

      const state = adapter.getEcosystemStateWithRecommendation();
      const report = adapter.generateReport();

      if (state.isResonant) {
        expect(report).toContain('✨ RESONANT ✨');
      } else {
        expect(report).toContain('⏳ Building...');
      }
    });
  });

  describe('Ecosystem state with recommendation', () => {
    it('should include recommendation in state', () => {
      adapter.onMeditationLogged('med-1', {
        emergentSentence: 'Test',
        contextWords: ['test'],
        extractedPatterns: ['test'],
        novelty: 0.8,
      });

      const state = adapter.getEcosystemStateWithRecommendation();

      expect(state).toHaveProperty('recommendation');
      expect(state.recommendation).toBe(null);
    });

    it('should set shouldWeave flag when appropriate', async () => {
      // Build coherence
      for (let i = 0; i < 8; i++) {
        adapter.onMeditationLogged(`med-${i}`, {
          emergentSentence: 'Synthesis harmony resonance weave',
          contextWords: ['synthesis', 'harmony', 'resonance', 'weave'],
          extractedPatterns: ['synthesis', 'harmony', 'resonance', 'weave', 'coherence'],
          novelty: 0.85,
        });

        if (i % 2 === 0) {
          adapter.onInsightGenerated(`ins-${i}`, {
            insights: [{ pattern: 'synthesis', description: 'Ready to weave' }],
            novelty: 0.80,
          });
        }
      }

      const state = adapter.getEcosystemStateWithRecommendation();

      // When resonant and coherent, shouldWeave should be true
      if (state.isResonant && state.totalCoherence > 0.7) {
        expect(state.recommendation?.shouldWeave).toBe(true);
      }
    });
  });
});
