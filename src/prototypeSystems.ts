/**
 * Prototype systems ported from resonance-bridge
 * These provide coupling, load balancing, and emergent orchestration primitives
 * while keeping the stable resonance engine unchanged.
 */

export type ResonanceSignal = Record<string, unknown>;

export class ResonantCouplingNetwork {
  private couplings: Map<string, Map<string, number>> = new Map();
  private harmonyMetrics: Map<string, number> = new Map();

  registerServer(serverId: string): void {
    if (!this.couplings.has(serverId)) {
      this.couplings.set(serverId, new Map());
      this.harmonyMetrics.set(serverId, 1);
    }
  }

  coupleServers(serverA: string, serverB: string, initialResonance = 0.5): void {
    this.registerServer(serverA);
    this.registerServer(serverB);

    this.couplings.get(serverA)!.set(serverB, this.clamp(initialResonance));
    this.couplings.get(serverB)!.set(serverA, this.clamp(initialResonance));
  }

  resonate(serverId: string, signal: ResonanceSignal): Map<string, number> {
    const responses = new Map<string, number>();
    const couplings = this.couplings.get(serverId);

    if (!couplings) return responses;

    for (const [coupledServer, strength] of couplings) {
      const response = this.calculateResonance(signal, strength);
      responses.set(coupledServer, response);
      this.updateHarmony(coupledServer, response);
    }

    return responses;
  }

  getHarmonyMetrics(): Map<string, number> {
    return new Map(this.harmonyMetrics);
  }

  adaptInterface<T extends Record<string, unknown>>(serverId: string, baseInterface: T): T & {
    resonance_boost: 'high' | 'medium' | 'low';
    adaptive_capabilities: boolean;
  } {
    const harmony = this.harmonyMetrics.get(serverId) ?? 1;
    return {
      ...baseInterface,
      resonance_boost: harmony > 0.7 ? 'high' : harmony > 0.4 ? 'medium' : 'low',
      adaptive_capabilities: harmony > 0.6,
    };
  }

  private calculateResonance(signal: ResonanceSignal, couplingStrength: number): number {
    const signalComplexity = JSON.stringify(signal ?? {}).length;
    const baseResonance = Math.sin(signalComplexity * 0.01) * couplingStrength;
    return this.clamp(baseResonance + 0.5);
  }

  private updateHarmony(serverId: string, resonance: number): void {
    const currentHarmony = this.harmonyMetrics.get(serverId) ?? 1;
    const newHarmony = currentHarmony * 0.8 + resonance * 0.2;
    this.harmonyMetrics.set(serverId, this.clamp(newHarmony));
  }

  private clamp(value: number): number {
    if (Number.isNaN(value)) return 0;
    return Math.max(0, Math.min(1, value));
  }
}

export class AdaptiveLoadBalancer {
  private serverLoads: Map<string, number> = new Map();
  private serverCapacities: Map<string, number> = new Map();

  registerServer(serverId: string, capacity = 10): void {
    this.serverLoads.set(serverId, this.serverLoads.get(serverId) ?? 0);
    this.serverCapacities.set(serverId, Math.max(1, capacity));
  }

  distributeLoad(operation: string, servers: string[]): string | null {
    let bestServer: string | null = null;
    let bestScore = Infinity;

    for (const server of servers) {
      const load = this.serverLoads.get(server) ?? 0;
      const capacity = this.serverCapacities.get(server) ?? 1;
      const utilization = load / capacity;

      if (utilization < bestScore && utilization < 0.8) {
        bestScore = utilization;
        bestServer = server;
      }
    }

    if (bestServer) {
      this.serverLoads.set(bestServer, (this.serverLoads.get(bestServer) ?? 0) + 1);
    }

    return bestServer;
  }

  completeOperation(serverId: string): void {
    const currentLoad = this.serverLoads.get(serverId) ?? 0;
    this.serverLoads.set(serverId, Math.max(0, currentLoad - 1));
  }

  getLoadDistribution(): Map<string, number> {
    const distribution = new Map<string, number>();
    for (const [server, load] of this.serverLoads) {
      const capacity = this.serverCapacities.get(server) ?? 1;
      distribution.set(server, load / capacity);
    }
    return distribution;
  }
}

export interface OrchestrationStep {
  step: number;
  operation: string;
  consequence: string;
  amplification: number;
}

export class EmergentOrchestrator {
  private propagationChains: Map<string, string[]> = new Map();

  orchestrate(operation: string, _context: Record<string, unknown> | undefined): OrchestrationStep[] {
    const chain = this.propagationChains.get(operation) ?? [];
    const results: OrchestrationStep[] = [];

    for (let i = 0; i < Math.min(chain.length + 1, 3); i++) {
      results.push({
        step: i,
        operation,
        consequence: `consequential_effect_${i}`,
        amplification: Math.pow(1.2, i),
      });
    }

    this.propagationChains.set(operation, [...chain, operation]);
    return results;
  }

  getPropagationMetrics(): Map<string, number> {
    const metrics = new Map<string, number>();
    for (const [operation, chain] of this.propagationChains) {
      metrics.set(operation, chain.length);
    }
    return metrics;
  }
}
