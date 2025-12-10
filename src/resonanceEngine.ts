/**
 * Core Resonance Engine
 * Detects patterns, analyzes couplings, and amplifies emergent intentions
 */

import {
  EcosystemMoment,
  DetectedPattern,
  Coupling,
  EcosystemState,
  SynthesisSuggestion,
  ResonanceConfig,
  HarmonicFeedback,
} from './types.js';

export class ResonanceEngine {
  private observations: EcosystemMoment[] = [];
  private patterns: Map<string, DetectedPattern> = new Map();
  private couplings: Map<string, Coupling> = new Map();
  private config: Required<ResonanceConfig>;
  private harmonics: HarmonicFeedback[] = [];

  constructor(config: ResonanceConfig = {}) {
    this.config = {
      maxObservations: config.maxObservations ?? 1000,
      patternMinFrequency: config.patternMinFrequency ?? 2,
      couplingThreshold: config.couplingThreshold ?? 0.3,
      coherenceWindow: config.coherenceWindow ?? 300000, // 5 minutes
      enableAutoAmplification: config.enableAutoAmplification ?? true,
    };
  }

  /**
   * Record a moment from the ecosystem
   */
  addObservation(moment: EcosystemMoment): void {
    this.observations.push(moment);

    // Keep only recent observations
    if (this.observations.length > this.config.maxObservations) {
      this.observations = this.observations.slice(-this.config.maxObservations);
    }

    // Trigger pattern detection
    this.detectPatterns();

    // Trigger coupling analysis
    this.analyzeCouplings();

    // Check for harmonic feedback
    if (this.config.enableAutoAmplification) {
      this.detectHarmonic();
    }
  }

  /**
   * Detect patterns across observations
   * A pattern is a recurring set of concepts or temporal sequences
   */
  private detectPatterns(): void {
    const conceptFrequency = new Map<string, EcosystemMoment[]>();

    // Count occurrences of each concept
    for (const obs of this.observations) {
      for (const concept of obs.concepts) {
        if (!conceptFrequency.has(concept)) {
          conceptFrequency.set(concept, []);
        }
        conceptFrequency.get(concept)!.push(obs);
      }
    }

    // Create patterns for concepts that appear frequently
    for (const [concept, moments] of conceptFrequency.entries()) {
      if (moments.length >= this.config.patternMinFrequency) {
        const patternId = `pattern-${concept}-${Date.now()}`;

        if (!this.patterns.has(patternId)) {
          const pattern: DetectedPattern = {
            id: patternId,
            name: `${concept} Resonance`,
            concepts: [concept],
            occurrences: moments,
            frequency: moments.length,
            strength: Math.min(1, moments.length / 10),
            emergenceTime: moments[0]?.timestamp ?? Date.now(),
            relatedPatterns: [],
          };

          this.patterns.set(patternId, pattern);
        } else {
          const existing = this.patterns.get(patternId)!;
          existing.occurrences = moments;
          existing.frequency = moments.length;
          existing.strength = Math.min(1, moments.length / 10);
        }
      }
    }
  }

  /**
   * Analyze how MCPs/concepts are coupled together
   */
  private analyzeCouplings(): void {
    // Look at sequential moments to find couplings
    for (let i = 0; i < this.observations.length - 1; i++) {
      const curr = this.observations[i];
      const next = this.observations[i + 1];

      if (!curr || !next) continue;

      // Find shared concepts
      const sharedConcepts = curr.concepts.filter((c) =>
        next.concepts.includes(c)
      );

      if (sharedConcepts.length > 0) {
        const couplingId = `${curr.source}->${next.source}`;
        const timeDelta = next.timestamp - curr.timestamp;
        const isRecent = timeDelta < 60000; // within 1 minute

        if (this.couplings.has(couplingId)) {
          const coupling = this.couplings.get(couplingId)!;
          coupling.strength = Math.min(
            1,
            coupling.strength + 0.1 * (isRecent ? 1 : 0.5)
          );
          coupling.sharedConcepts = Array.from(
            new Set([...coupling.sharedConcepts, ...sharedConcepts])
          );
          coupling.lastActive = next.timestamp;
        } else {
          const coupling: Coupling = {
            sourceId: curr.source,
            targetId: next.source,
            strength: 0.3,
            type: this.inferCouplingType(curr, next),
            sharedConcepts,
            lastActive: next.timestamp,
          };
          this.couplings.set(couplingId, coupling);
        }
      }
    }
  }

  /**
   * Infer the type of coupling between two moments
   */
  private inferCouplingType(
    curr: EcosystemMoment,
    next: EcosystemMoment
  ): Coupling['type'] {
    const isFollowUp =
      (curr.type === 'meditation' && next.type === 'insight') ||
      (curr.type === 'insight' && next.type === 'critique') ||
      (curr.type === 'critique' && next.type === 'meditation');

    if (isFollowUp) return 'sequential';

    const hasSharedSource = curr.source === next.source;
    if (hasSharedSource) return 'lateral';

    const timeDelta = next.timestamp - curr.timestamp;
    if (timeDelta < 5000) return 'feedback'; // tight coupling

    return 'hierarchical';
  }

  /**
   * Detect harmonic feedback - when patterns strengthen each other
   */
  private detectHarmonic(): void {
    const patternArray = Array.from(this.patterns.values());

    for (let i = 0; i < patternArray.length; i++) {
      const p1 = patternArray[i];
      if (!p1) continue;

      for (let j = i + 1; j < patternArray.length; j++) {
        const p2 = patternArray[j];
        if (!p2) continue;

        // Check if patterns appear together frequently
        const commonOccurrences = p1.occurrences.filter((o1) =>
          p2.occurrences.some(
            (o2) => Math.abs(o1.timestamp - o2.timestamp) < 30000
          )
        ).length;

        if (commonOccurrences > 0) {
          const amplification =
            (p1.strength * p2.strength * commonOccurrences) / p1.frequency;

          const feedback: HarmonicFeedback = {
            pattern1Id: p1.id,
            pattern2Id: p2.id,
            amplificationFactor: amplification,
            resonanceFrequency: 1 / (commonOccurrences + 1), // how often they appear together
          };

          // Strengthen the patterns
          p1.strength = Math.min(1, p1.strength + 0.05 * amplification);
          p2.strength = Math.min(1, p2.strength + 0.05 * amplification);

          this.harmonics.push(feedback);
        }
      }
    }

    // Keep only recent harmonics
    this.harmonics = this.harmonics.slice(-100);
  }

  /**
   * Get the current state of the ecosystem
   */
  getEcosystemState(): EcosystemState {
    const recentWindow = Date.now() - this.config.coherenceWindow;
    const recentObservations = this.observations.filter(
      (o) => o.timestamp > recentWindow
    );

    // Calculate coherence (0 to 1)
    const avgNovelty =
      recentObservations.reduce((sum, o) => sum + (o.novelty ?? 0.5), 0) /
      (recentObservations.length || 1);
    const totalCoherence = Math.min(
      1,
      avgNovelty *
        (Array.from(this.patterns.values()).reduce(
          (sum, p) => sum + p.strength,
          0
        ) /
          (this.patterns.size || 1))
    );

    // Determine if system is resonant
    const activeCouplings = Array.from(this.couplings.values()).filter(
      (c) => Date.now() - c.lastActive < 60000
    );
    const isResonant =
      activeCouplings.length > 0 && totalCoherence > 0.5 && this.harmonics.length > 2;

    // Extract dominant concepts
    const conceptScores = new Map<string, number>();
    for (const obs of recentObservations) {
      for (const concept of obs.concepts) {
        conceptScores.set(
          concept,
          (conceptScores.get(concept) ?? 0) + (obs.novelty ?? 0.5)
        );
      }
    }
    const dominantConcepts = Array.from(conceptScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([concept]) => concept);

    // Extract emergent intentions
    const emergentIntentions = Array.from(this.patterns.values())
      .filter((p) => p.strength > 0.6)
      .slice(0, 3)
      .map((p) => p.name);

    return {
      observations: recentObservations,
      patterns: Array.from(this.patterns.values()),
      couplings: Array.from(this.couplings.values()),
      totalCoherence,
      isResonant,
      dominantConcepts,
      emergentIntentions,
      observedAt: Date.now(),
    };
  }

  /**
   * Suggest the next synthesis based on current patterns
   */
  suggestNextSynthesis(): SynthesisSuggestion | null {
    const state = this.getEcosystemState();

    if (state.emergentIntentions.length === 0) {
      return null;
    }

    // Check what kind of action would amplify current patterns
    const lastObservations = this.observations.slice(-5);
    const lastTypes = lastObservations.map((o) => o.type);

    let suggestedAction: SynthesisSuggestion['suggestedAction'] = 'observe';

    // Suggest based on pattern of recent actions
    if (lastTypes.every((t) => t === 'meditation' || t === 'insight')) {
      suggestedAction = 'consult'; // Time to get critique
    } else if (lastTypes.some((t) => t === 'critique')) {
      suggestedAction = 'meditate'; // Feed the critique back in
    } else if (state.isResonant) {
      suggestedAction = 'weave'; // System is ready to synthesize
    }

    return {
      id: `synthesis-${Date.now()}`,
      reason: `System suggests ${suggestedAction} to amplify: ${state.emergentIntentions.join(', ')}`,
      targetConcepts: state.dominantConcepts,
      suggestedAction,
      confidence: state.totalCoherence,
      basedOnPatterns: state.patterns.slice(0, 3).map((p) => p.id),
    };
  }

  /**
   * Visualize the coupling graph as a simple text representation
   */
  visualizeCoupling(): string {
    const active = Array.from(this.couplings.values())
      .filter((c) => Date.now() - c.lastActive < 120000)
      .sort((a, b) => b.strength - a.strength);

    if (active.length === 0) {
      return 'No active couplings detected.';
    }

    let viz = 'COUPLING GRAPH:\n\n';
    for (const coupling of active) {
      const strength = Math.round(coupling.strength * 10);
      const bar = '█'.repeat(strength) + '░'.repeat(10 - strength);
      viz += `${coupling.sourceId} ${bar} ${coupling.targetId}\n`;
      viz += `  Type: ${coupling.type}, Shared: [${coupling.sharedConcepts.join(', ')}]\n\n`;
    }

    return viz;
  }

  /**
   * Clear all observations and patterns
   */
  reset(): void {
    this.observations = [];
    this.patterns.clear();
    this.couplings.clear();
    this.harmonics = [];
  }
}
