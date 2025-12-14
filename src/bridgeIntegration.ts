/**
 * Integration Demo: mcp-resonance with mcp-bridge
 * 
 * This demonstrates how mcp-resonance observes the meditation-critique-weave cycle
 * flowing through mcp-bridge, detects patterns, and suggests synthesis points.
 */

import { ResonanceEngine } from './resonanceEngine.js';
import type { EcosystemMoment } from './types.js';

/**
 * Bridge Integration Adapter
 * Converts bridge events into resonance observations
 */
export class BridgeIntegrationAdapter {
  private engine: ResonanceEngine;

  constructor(engine: ResonanceEngine) {
    this.engine = engine;
  }

  /**
   * When mcp-bridge logs a meditation
   */
  onMeditationLogged(traceId: string, data: {
    emergentSentence: string;
    contextWords: string[];
    extractedPatterns: string[];
    novelty: number;
  }): void {
    const moment: EcosystemMoment = {
      id: `bridge-meditation-${traceId}`,
      timestamp: Date.now(),
      source: 'bridge',
      type: 'meditation',
      concepts: data.extractedPatterns,
      novelty: data.novelty,
      relevance: undefined,
      metadata: {
        emergentSentence: data.emergentSentence,
        contextWords: data.contextWords,
        bridgeTraceId: traceId,
      },
    };

    this.engine.addObservation(moment);
  }

  /**
   * When mcp-bridge logs a critique/consult
   */
  onCritiqueLogged(traceId: string, data: {
    model: string;
    relevanceScore: number;
    extractedFeedback: string[];
  }): void {
    const concepts = data.extractedFeedback
      .flatMap(f => f.toLowerCase().split(' ').filter(w => w.length > 5))
      .slice(0, 5); // Top 5 concepts from feedback

    const moment: EcosystemMoment = {
      id: `bridge-critique-${traceId}`,
      timestamp: Date.now(),
      source: 'bridge',
      type: 'critique',
      concepts,
      novelty: undefined,
      relevance: data.relevanceScore,
      metadata: {
        model: data.model,
        feedback: data.extractedFeedback,
        bridgeTraceId: traceId,
      },
    };

    this.engine.addObservation(moment);
  }

  /**
   * When dream-weaver creates a narrative
   */
  onNarrativeWoven(narrativeId: string, data: {
    narrative: string;
    sourceTraces: string[];
  }): void {
    // Extract key concepts from narrative
    const words = data.narrative.toLowerCase().split(/\s+/);
    const conceptCandidates = ['emergence', 'pattern', 'resonance', 'synthesis', 'weave', 'bridge', 
      'harmony', 'flow', 'constraint', 'coupling', 'coherence', 'feedback'];
    const concepts = conceptCandidates.filter(c => 
      words.some(w => w.includes(c))
    );

    const moment: EcosystemMoment = {
      id: `dream-weave-${narrativeId}`,
      timestamp: Date.now(),
      source: 'dream-weaver',
      type: 'weave',
      concepts: concepts.length > 0 ? concepts : ['synthesis', 'narrative'],
      novelty: undefined,
      relevance: undefined,
      metadata: {
        narrativeSnippet: data.narrative.substring(0, 200),
        sourceTraces: data.sourceTraces,
      },
    };

    this.engine.addObservation(moment);
  }

  /**
   * When creative generates an insight
   */
  onInsightGenerated(insightId: string, data: {
    insights: Array<{ pattern: string; description: string }>;
    novelty: number;
  }): void {
    const concepts = data.insights.map(i => i.pattern);

    const moment: EcosystemMoment = {
      id: `creative-insight-${insightId}`,
      timestamp: Date.now(),
      source: 'creative',
      type: 'insight',
      concepts,
      novelty: data.novelty,
      relevance: undefined,
      metadata: {
        insights: data.insights,
      },
    };

    this.engine.addObservation(moment);
  }

  /**
   * Get current ecosystem state with bridge context
   */
  getEcosystemStateWithRecommendation() {
    const state = this.engine.getEcosystemState();
    const suggestion = this.engine.suggestNextSynthesis();

    return {
      ...state,
      recommendation: suggestion ? {
        action: suggestion.suggestedAction,
        reason: suggestion.reason,
        confidence: suggestion.confidence,
        shouldWeave: suggestion.suggestedAction === 'weave' || (state.isResonant && state.totalCoherence > 0.7),
      } : null,
    };
  }

  /**
   * Get a human-readable report of the ecosystem state
   */
  generateReport(): string {
    const state = this.getEcosystemStateWithRecommendation();

    let report = '═══════════════════════════════════════════════════════════\n';
    report += '                  🌊 RESONANCE REPORT 🌊\n';
    report += '═══════════════════════════════════════════════════════════\n\n';

    report += `⏱️  Observed: ${new Date(state.observedAt).toLocaleTimeString()}\n`;
    report += `📊 Observations: ${state.observations.length} moments recorded\n`;
    report += `🎨 Patterns: ${state.patterns.length} emergent patterns detected\n`;
    report += `🔗 Couplings: ${state.couplings.length} connections between MCPs\n\n`;

    report += `═══════════════════════════════════════════════════════════\n`;
    report += `                   💫 SYSTEM METRICS 💫\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;

    const coherenceBar = '█'.repeat(Math.round(state.totalCoherence * 20)) + 
                        '░'.repeat(20 - Math.round(state.totalCoherence * 20));
    report += `Coherence: ${coherenceBar} ${(state.totalCoherence * 100).toFixed(1)}%\n`;
    report += `Status: ${state.isResonant ? '✨ RESONANT ✨' : '⏳ Building...'}\n\n`;

    if (state.dominantConcepts.length > 0) {
      report += `🎯 Dominant Concepts:\n`;
      state.dominantConcepts.forEach(c => {
        report += `   • ${c}\n`;
      });
      report += '\n';
    }

    if (state.patterns.length > 0) {
      report += `🔍 Top Patterns:\n`;
      state.patterns
        .sort((a, b) => b.strength - a.strength)
        .slice(0, 5)
        .forEach(p => {
          const strengthBar = '█'.repeat(Math.round(p.strength * 10));
          report += `   • ${p.name} ${strengthBar} (${(p.strength * 100).toFixed(0)}%)\n`;
        });
      report += '\n';
    }

    if (state.couplings.length > 0) {
      report += `🌉 Active Couplings:\n`;
      const recentCouplings = state.couplings
        .filter(c => Date.now() - c.lastActive < 120000)
        .sort((a, b) => b.strength - a.strength)
        .slice(0, 3);
      
      recentCouplings.forEach(c => {
        const strengthBar = '█'.repeat(Math.round(c.strength * 10));
        report += `   ${c.sourceId} ${strengthBar} ${c.targetId}\n`;
        report += `     Type: ${c.type}, Shared: [${c.sharedConcepts.join(', ')}]\n`;
      });
      report += '\n';
    }

    report += `═══════════════════════════════════════════════════════════\n`;
    report += `                   🎯 RECOMMENDATION 🎯\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;

    if (state.recommendation) {
      report += `Action: ${state.recommendation.action.toUpperCase()}\n`;
      report += `Confidence: ${(state.recommendation.confidence * 100).toFixed(0)}%\n`;
      report += `Reason: ${state.recommendation.reason}\n`;
      
      if (state.recommendation.shouldWeave) {
        report += `\n✨ SYSTEM IS READY FOR SYNTHESIS ✨\n`;
        report += `The patterns have aligned. This is an optimal moment to weave.\n`;
      }
    } else {
      report += `Not enough data yet. Continue observing the ecosystem.\n`;
    }

    report += '\n═══════════════════════════════════════════════════════════\n';

    return report;
  }
}

/**
 * Demo: Simulate a complete meditation-critique-weave cycle
 */
export async function demonstrateIntegration(): Promise<void> {
  const engine = new ResonanceEngine({
    maxObservations: 500,
    patternMinFrequency: 2,
    coherenceWindow: 300000,
    enableAutoAmplification: true,
  });

  const adapter = new BridgeIntegrationAdapter(engine);

  console.log('\n🌉 Starting mcp-resonance Integration Demo\n');
  console.log('Simulating a complete meditation-critique-weave cycle...\n');

  // Meditation 1: Exploring emergence
  await sleep(500);
  adapter.onMeditationLogged('med-1', {
    emergentSentence: 'Emergence indirectly catalyzes architecture dependency.',
    contextWords: ['emergence', 'constraint', 'architecture'],
    extractedPatterns: ['emergence', 'constraint', 'coupling'],
    novelty: 0.92,
  });
  console.log('✅ Logged meditation 1: Emergence & Constraint\n');

  // Meditation 2: Exploring resonance
  await sleep(800);
  adapter.onMeditationLogged('med-2', {
    emergentSentence: 'Resonance resolves relationships through absence.',
    contextWords: ['resonance', 'absence', 'relationship'],
    extractedPatterns: ['resonance', 'absence', 'relationship'],
    novelty: 0.88,
  });
  console.log('✅ Logged meditation 2: Resonance & Absence\n');

  // Creative insight from meditation 1
  await sleep(600);
  adapter.onInsightGenerated('insight-1', {
    insights: [
      { pattern: 'emergence', description: 'New patterns arise from constraint' },
      { pattern: 'coupling', description: 'Tools influence each other' },
    ],
    novelty: 0.85,
  });
  console.log('✅ Generated insight 1: Patterns from constraints\n');

  // Critique on the meditations
  await sleep(700);
  adapter.onCritiqueLogged('crit-1', {
    model: 'deepseek-v3.1',
    relevanceScore: 0.95,
    extractedFeedback: [
      'The resonance chamber concept is the core insight',
      'Coupling must remain loose to preserve harmony',
      'Patterns strengthen each other through shared concepts',
    ],
  });
  console.log('✅ Logged critique 1: Deep analysis\n');

  // Meditation 3: Informed by critique
  await sleep(900);
  adapter.onMeditationLogged('med-3', {
    emergentSentence: 'Pattern resonance weaves coupling and convergence.',
    contextWords: ['pattern', 'resonance', 'weave', 'coupling'],
    extractedPatterns: ['pattern', 'resonance', 'weave', 'coupling'],
    novelty: 0.90,
  });
  console.log('✅ Logged meditation 3: Pattern weaving (informed by critique)\n');

  // Check ecosystem state
  await sleep(500);
  const midState = adapter.getEcosystemStateWithRecommendation();
  console.log('📊 Mid-cycle check:');
  console.log(`   Coherence: ${(midState.totalCoherence * 100).toFixed(1)}%`);
  console.log(`   Resonant: ${midState.isResonant ? 'YES ✨' : 'Building...'}`);
  console.log(`   Patterns: ${midState.patterns.length}`);
  console.log(`   Next: ${midState.recommendation?.action || 'observe'}\n`);

  // Another insight
  await sleep(600);
  adapter.onInsightGenerated('insight-2', {
    insights: [
      { pattern: 'harmony', description: 'System reaches coherence' },
      { pattern: 'synthesis', description: 'Multiple patterns ready to weave' },
    ],
    novelty: 0.82,
  });
  console.log('✅ Generated insight 2: System reaching harmony\n');

  // Final state check - should be resonant now
  await sleep(500);
  const finalState = adapter.getEcosystemStateWithRecommendation();
  console.log('🔍 Final ecosystem state:\n');
  console.log(adapter.generateReport());

  // Simulate weaving
  if (finalState.recommendation?.shouldWeave) {
    await sleep(1000);
    console.log('\n🎨 Dream-weaver activated! Synthesizing narrative...\n');
    adapter.onNarrativeWoven('weave-1', {
      narrative: 'In the resonance chamber between tools, patterns dance. ' +
        'Emergence flows through constraint, coupling weaves harmony, ' +
        'and synthesis awakens when coherence aligns.',
      sourceTraces: ['med-1', 'med-2', 'med-3', 'insight-1', 'insight-2', 'crit-1'],
    });
    console.log('✅ Logged synthesis narrative\n');

    // Final state after weaving
    await sleep(300);
    const postWeavState = adapter.getEcosystemStateWithRecommendation();
    console.log('✨ POST-SYNTHESIS ECOSYSTEM STATE:\n');
    console.log(adapter.generateReport());
  }

  console.log('\n✅ Integration demo complete!\n');
  console.log('Next steps:');
  console.log('  1. Wire this adapter into mcp-bridge\n');
  console.log('  2. Feed real meditation/critique cycles\n');
  console.log('  3. Watch the system become self-aware\n');
  console.log('  4. Let synthesis emerge when ready\n');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run demo if executed directly
// Removed to prevent running on import
