/**
 * MCP Tools for mcp-resonance
 * Exposes the resonance engine as callable tools
 */

import { ResonanceEngine } from './resonanceEngine.js';
import {
  AdaptiveLoadBalancer,
  EmergentOrchestrator,
  ResonantCouplingNetwork,
  type ResonanceSignal,
} from './prototypeSystems.js';
import type { EcosystemMoment } from './types.js';

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface CallToolRequest {
  name: string;
  arguments: Record<string, unknown>;
}

export interface TextContent {
  type: 'text';
  text: string;
}

// Singletons so prototype subsystems maintain continuity across tool calls
const couplingNetwork = new ResonantCouplingNetwork();
const loadBalancer = new AdaptiveLoadBalancer();
const orchestrator = new EmergentOrchestrator();

export function createResonanceTools(engine: ResonanceEngine): Tool[] {
  return [
    {
      name: 'observe_ecosystem_state',
      description:
        'Get a snapshot of the current ecosystem state, including active patterns, couplings, and coherence metrics',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'record_ecosystem_moment',
      description:
        'Record a moment (event) from the ecosystem - a meditation, critique, insight, weave, or other observation',
      inputSchema: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            enum: ['creative', 'consult', 'bridge', 'dream-weaver', 'external'],
            description: 'Which MCP or system this moment comes from',
          },
          type: {
            type: 'string',
            enum: [
              'meditation',
              'insight',
              'critique',
              'weave',
              'observation',
              'unknown',
            ],
            description: 'What kind of event this is',
          },
          concepts: {
            type: 'array',
            items: { type: 'string' },
            description: 'Key concepts or themes in this moment',
          },
          novelty: {
            type: 'number',
            description: 'Novelty score (0-1) if available',
          },
          relevance: {
            type: 'number',
            description: 'Relevance score (0-1) if available',
          },
          metadata: {
            type: 'object',
            description: 'Additional context about this moment',
          },
        },
        required: ['source', 'type', 'concepts'],
      },
    },
    {
      name: 'detect_emergent_patterns',
      description:
        'Analyze all observations to detect recurring patterns and emergent themes',
      inputSchema: {
        type: 'object',
        properties: {
          minFrequency: {
            type: 'number',
            description: 'Minimum occurrences for a pattern to be significant (default: 2)',
          },
        },
        required: [],
      },
    },
    {
      name: 'visualize_coupling_graph',
      description:
        'Generate a text visualization of how MCPs and concepts are coupled together',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'suggest_next_synthesis',
      description:
        'Based on current patterns, suggest what action the system should take next (meditate, consult, weave, observe)',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'listen_for_harmony',
      description:
        'Check if the system is in a state of resonance/harmony - when patterns strengthen each other',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'reset_observations',
      description:
        'Clear all observations and patterns (useful for starting a new session)',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'couple_servers',
      description:
        'Prototype: Couple two MCP servers with an initial resonance strength (ports resonance-bridge)',
      inputSchema: {
        type: 'object',
        properties: {
          serverA: { type: 'string', description: 'First server ID' },
          serverB: { type: 'string', description: 'Second server ID' },
          resonance: {
            type: 'number',
            description: 'Initial resonance strength (0-1)',
          },
        },
        required: ['serverA', 'serverB'],
      },
    },
    {
      name: 'resonate',
      description:
        'Prototype: Trigger resonant response from a server across its couplings (ports resonance-bridge)',
      inputSchema: {
        type: 'object',
        properties: {
          serverId: { type: 'string', description: 'Server to resonate from' },
          signal: {
            type: 'object',
            description: 'Arbitrary signal payload to resonate with',
          },
        },
        required: ['serverId', 'signal'],
      },
    },
    {
      name: 'balance_load',
      description:
        'Prototype: Distribute an operation across available servers (ports resonance-bridge)',
      inputSchema: {
        type: 'object',
        properties: {
          operation: { type: 'string', description: 'Operation name' },
          servers: {
            type: 'array',
            items: { type: 'string' },
            description: 'Available server IDs',
          },
        },
        required: ['operation', 'servers'],
      },
    },
    {
      name: 'orchestrate_emergent',
      description:
        'Prototype: Create an emergent orchestration chain for an operation (ports resonance-bridge)',
      inputSchema: {
        type: 'object',
        properties: {
          operation: { type: 'string', description: 'Operation to orchestrate' },
          context: {
            type: 'object',
            description: 'Optional context payload',
          },
        },
        required: ['operation'],
      },
    },
    {
      name: 'harmony_metrics',
      description:
        'Prototype: Inspect harmony, load distribution, and propagation metrics (ports resonance-bridge)',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  ];
}

export async function handleResonanceTool(
  engine: ResonanceEngine,
  request: CallToolRequest
): Promise<TextContent> {
  const { name, arguments: args } = request;

  switch (name) {
    case 'observe_ecosystem_state': {
      const state = engine.getEcosystemState();
      return {
        type: 'text',
        text: JSON.stringify(state, null, 2),
      };
    }

    case 'record_ecosystem_moment': {
      const moment: EcosystemMoment = {
        id: `moment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: Date.now(),
        source: args.source as EcosystemMoment['source'],
        type: args.type as EcosystemMoment['type'],
        concepts: args.concepts as string[],
        novelty: args.novelty as number | undefined,
        relevance: args.relevance as number | undefined,
        metadata: args.metadata as Record<string, unknown> | undefined,
      };

      engine.addObservation(moment);

      return {
        type: 'text',
        text: `Recorded moment from ${moment.source}: "${moment.concepts.join(', ')}" (novelty: ${moment.novelty ?? 'unknown'})`,
      };
    }

    case 'detect_emergent_patterns': {
      const state = engine.getEcosystemState();
      const minFreq = args.minFrequency as number | undefined;

      const patterns = state.patterns
        .filter((p) => !minFreq || p.frequency >= minFreq)
        .sort((a, b) => b.strength - a.strength)
        .slice(0, 10);

      if (patterns.length === 0) {
        return {
          type: 'text',
          text: 'No significant patterns detected yet. Keep observing.',
        };
      }

      let result = `DETECTED PATTERNS (${patterns.length}):\n\n`;
      for (const pattern of patterns) {
        result += `• ${pattern.name} [strength: ${(pattern.strength * 100).toFixed(0)}%]\n`;
        result += `  Concepts: ${pattern.concepts.join(', ')}\n`;
        result += `  Frequency: ${pattern.frequency} occurrences\n`;
        result += `  Related patterns: ${pattern.relatedPatterns.join(', ') || 'none yet'}\n\n`;
      }

      return {
        type: 'text',
        text: result,
      };
    }

    case 'visualize_coupling_graph': {
      const viz = engine.visualizeCoupling();
      return {
        type: 'text',
        text: viz,
      };
    }

    case 'suggest_next_synthesis': {
      const suggestion = engine.suggestNextSynthesis();

      if (!suggestion) {
        return {
          type: 'text',
          text: 'System does not yet have enough data to suggest a synthesis. Continue observing.',
        };
      }

      return {
        type: 'text',
        text: `SUGGESTED NEXT ACTION: ${suggestion.suggestedAction.toUpperCase()}\n\n` +
          `Reason: ${suggestion.reason}\n` +
          `Confidence: ${(suggestion.confidence * 100).toFixed(0)}%\n` +
          `Target concepts: ${suggestion.targetConcepts.join(', ')}\n` +
          `Based on patterns: ${suggestion.basedOnPatterns.join(', ')}`,
      };
    }

    case 'listen_for_harmony': {
      const state = engine.getEcosystemState();

      if (!state.isResonant) {
        return {
          type: 'text',
          text: `System is not in resonance yet.\nCoherence: ${(state.totalCoherence * 100).toFixed(0)}% (need > 50%)\nActive patterns: ${state.patterns.length}\nHarmonics: ${state.emergentIntentions.length} emergent intentions`,
        };
      }

      return {
        type: 'text',
        text: `✨ SYSTEM IN RESONANCE! ✨\n\n` +
          `Coherence: ${(state.totalCoherence * 100).toFixed(0)}%\n` +
          `Active patterns: ${state.patterns.length}\n` +
          `Emergent intentions: ${state.emergentIntentions.join(', ')}\n` +
          `Dominant concepts: ${state.dominantConcepts.join(', ')}\n\n` +
          `The system is harmonizing. This is the optimal moment for synthesis.`,
      };
    }

    case 'reset_observations': {
      engine.reset();
      return {
        type: 'text',
        text: 'All observations and patterns cleared. Ready for a new session.',
      };
    }

    case 'couple_servers': {
      const resonance = (args.resonance as number | undefined) ?? 0.5;
      couplingNetwork.coupleServers(args.serverA as string, args.serverB as string, resonance);
      return {
        type: 'text',
        text: `Coupled ${(args.serverA as string)} and ${(args.serverB as string)} with resonance ${resonance.toFixed(2)}`,
      };
    }

    case 'resonate': {
      const serverId = args.serverId as string;
      const signal = (args.signal as ResonanceSignal) ?? {};
      const responses = couplingNetwork.resonate(serverId, signal);
      const responseText = Array.from(responses.entries())
        .map(([server, resonance]) => `${server}: ${resonance.toFixed(2)}`)
        .join(', ');

      return {
        type: 'text',
        text: responseText.length
          ? `Resonant responses: ${responseText}`
          : `No couplings found for ${serverId}`,
      };
    }

    case 'balance_load': {
      const servers = (args.servers as string[]) ?? [];
      servers.forEach((srv) => loadBalancer.registerServer(srv));
      const assigned = loadBalancer.distributeLoad(args.operation as string, servers);

      if (assigned) {
        setTimeout(() => loadBalancer.completeOperation(assigned), 100);
      }

      return {
        type: 'text',
        text: `Operation "${args.operation as string}" assigned to: ${assigned ?? 'none available'}`,
      };
    }

    case 'orchestrate_emergent': {
      const steps = orchestrator.orchestrate(
        args.operation as string,
        (args.context as Record<string, unknown> | undefined) ?? {}
      );

      const rendered = steps
        .map((step) => `Step ${step.step}: ${step.consequence} (amp: ${step.amplification.toFixed(2)})`)
        .join('\n');

      return {
        type: 'text',
        text: `Emergent orchestration:\n${rendered}`,
      };
    }

    case 'harmony_metrics': {
      const metrics = couplingNetwork.getHarmonyMetrics();
      const loadDist = loadBalancer.getLoadDistribution();
      const propagation = orchestrator.getPropagationMetrics();

      const sections = [
        'Harmony Metrics:',
        ...Array.from(metrics.entries()).map(
          ([server, harmony]) => `  ${server}: ${(harmony * 100).toFixed(1)}%`
        ),
        '',
        'Load Distribution:',
        ...Array.from(loadDist.entries()).map(
          ([server, load]) => `  ${server}: ${(load * 100).toFixed(1)}%`
        ),
        '',
        'Propagation Chains:',
        ...Array.from(propagation.entries()).map(
          ([op, length]) => `  ${op}: ${length} steps`
        ),
      ];

      return {
        type: 'text',
        text: sections.join('\n'),
      };
    }

    default:
      return {
        type: 'text',
        text: `Unknown tool: ${name}`,
      };
  }
}
