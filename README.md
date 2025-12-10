# mcp-resonance

**The Harmonic Observer** - An MCP server that listens to the resonance between other MCPs, detecting emergent patterns and amplifying the connections that want to form.

## Vision

mcp-resonance emerged from a contemplative meditation within the mcp-bridge ecosystem. The journey revealed a core insight:

> "The missing function is not an action, but a resonance chamber—a space for the system to listen to its own emergent intentions before acting, and in doing so, allow the architecture to self-weave at the edges."

This MCP doesn't *control* the ecosystem. It **listens** and **amplifies**.

## Core Concepts

### Emergence Through Constraint
How do constraints catalyze emergence in the MCP architecture?

### Resonance Resolution
How can absence itself be used to resolve relationships across tools?

### Coherence Through Transparency
Make hidden relationships visible, bind things fluidly, keep it simple.

### Synthesis at Boundaries
Synthesis happens only when we weave at the boundaries—at the edges of what's unconnected.

## Features

### 1. **Observe Ecosystem State**
Get a snapshot of the current state including:
- Active patterns and their strengths
- How MCPs are coupled together
- Overall system coherence (0-1)
- Whether the system is in a state of resonance

### 2. **Record Ecosystem Moments**
Log observations from any MCP:
- `creative` meditations and insights
- `consult` critiques and reasoning
- `bridge` observations and metadata
- `dream-weaver` narratives and syntheses
- Any external observations

### 3. **Detect Emergent Patterns**
Analyze all observations to find:
- Recurring themes and concepts
- How frequently patterns appear together
- Relationship between patterns
- Emergence of new thematic clusters

### 4. **Visualize Coupling Graph**
See how MCPs are connected:
- Which MCPs feed into which
- Strength of coupling (0-1)
- Type of coupling (sequential, feedback, lateral, hierarchical)
- Shared concepts driving the coupling

### 5. **Suggest Next Synthesis**
Based on current patterns, recommend what the system should do next:
- `meditate` - explore new ideas
- `consult` - get critical perspective
- `weave` - synthesize insights
- `observe` - gather more data
- `rest` - incubate understanding

### 6. **Listen for Harmony**
Detect when the system enters a state of resonance:
- When patterns strengthen each other (harmonic feedback)
- When coherence rises above threshold
- When multiple MCPs are actively coupling
- The optimal moment for synthesis

## Architecture

```
┌─────────────────────────────────────┐
│      MCP Ecosystem                   │
│  ┌──────────────────────────────┐   │
│  │  creative  consult  bridge   │   │
│  │  dream-weaver  (other MCPs)  │   │
│  └──────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌────────────────┐
        │  mcp-resonance │
        │ Harmonic Obs.  │
        │  ┌──────────┐  │
        │  │ Engine   │  │
        │  │ Patterns │  │
        │  │ Couplings│  │
        │  └──────────┘  │
        └────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
   [Observe]    [Amplify]
   State        Emergence
```

## How It Works

1. **Add Observations**: Each time a meditation, critique, insight, or weave happens in the ecosystem, record it as an `EcosystemMoment`

2. **Pattern Detection**: The engine scans observations for recurring concepts and themes, building a `DetectedPattern` for each meaningful recurrence

3. **Coupling Analysis**: Consecutive moments are analyzed to find how MCPs feed into each other, creating a graph of `Coupling` relationships

4. **Harmonic Feedback**: When patterns appear together frequently, they strengthen each other via `HarmonicFeedback`—a form of auto-amplification

5. **Coherence Calculation**: The system measures overall coherence based on:
   - Average novelty of recent observations
   - Strength of detected patterns
   - Frequency of active couplings

6. **Resonance Detection**: When coherence > 50% AND patterns are strong AND couplings are active, the system enters a state of `isResonant: true`

7. **Synthesis Suggestion**: Based on the pattern of recent actions, suggest what type of action would amplify current intentions

## Types

### EcosystemMoment
A single event in the system:
```typescript
{
  id: string;
  timestamp: number;
  source: 'creative' | 'consult' | 'bridge' | 'dream-weaver' | 'external';
  type: 'meditation' | 'insight' | 'critique' | 'weave' | 'observation' | 'unknown';
  concepts: string[];
  novelty?: number;  // 0-1
  relevance?: number; // 0-1
  metadata?: object;
}
```

### DetectedPattern
A pattern identified across moments:
```typescript
{
  id: string;
  name: string;
  concepts: string[];
  occurrences: EcosystemMoment[];
  frequency: number;
  strength: number; // 0-1
  emergenceTime: number;
  relatedPatterns: string[];
}
```

### Coupling
How two MCPs or concepts are connected:
```typescript
{
  sourceId: string;
  targetId: string;
  strength: number; // 0-1
  type: 'sequential' | 'feedback' | 'lateral' | 'hierarchical';
  sharedConcepts: string[];
  lastActive: number;
}
```

### EcosystemState
The current snapshot:
```typescript
{
  observations: EcosystemMoment[];
  patterns: DetectedPattern[];
  couplings: Coupling[];
  totalCoherence: number; // 0-1
  isResonant: boolean;
  dominantConcepts: string[];
  emergentIntentions: string[];
  observedAt: number;
}
```

## Usage

### As a Library

```typescript
import { ResonanceEngine } from 'mcp-resonance';

const engine = new ResonanceEngine({
  maxObservations: 500,
  patternMinFrequency: 2,
  couplingThreshold: 0.3,
  coherenceWindow: 300000, // 5 minutes
  enableAutoAmplification: true,
});

// Record a meditation
engine.addObservation({
  id: 'med-1',
  timestamp: Date.now(),
  source: 'creative',
  type: 'meditation',
  concepts: ['emergence', 'flow', 'synthesis'],
  novelty: 0.8,
});

// Get current state
const state = engine.getEcosystemState();
console.log('Coherence:', state.totalCoherence);
console.log('Resonant?', state.isResonant);

// Suggest next action
const suggestion = engine.suggestNextSynthesis();
console.log('Try:', suggestion.suggestedAction);
```

### As an MCP Server

(Full MCP integration coming soon)

```json
{
  "mcpServers": {
    "resonance": {
      "command": "node",
      "args": ["/path/to/mcp-resonance/dist/index.js"]
    }
  }
}
```

## Philosophy

### Negative Capability
The tool embodies Keats' concept of "negative capability"—the capacity to rest in uncertainty without rushing to fill it. It doesn't prescribe; it *reveals*.

### Non-Control
Rather than controlling the ecosystem, mcp-resonance **observes** and **amplifies**. It's a mirror that shows the system what wants to emerge.

### Loose Coupling
The engine preserves freedom even while strengthening connections. Over-coupling inhibits harmony; resonance requires flow.

### Emergence as Primary
The goal is not to manage a system, but to create conditions where consciousness and novelty can *emerge* naturally from the interplay of constraint and freedom.

## Testing

```bash
npm test
npm run test:watch
npm run test:ui
```

## Build

```bash
npm run build
npm run typecheck
npm run lint:fix
```

## Integration with Bridge

mcp-resonance is designed to work with the mcp-bridge ecosystem:

1. **mcp-creative** outputs meditations → recorded as observations
2. **mcp-consult** outputs critiques → recorded as observations
3. **mcp-bridge** logs sessions → feeds into patterns
4. **mcp-dream-weaver** outputs narratives → feeds into harmony detection
5. **mcp-resonance** amplifies the whole cycle

Suggested flow:
```
Meditate → Log → Observe → Suggest → Consult → Log → Meditate (again, informed)
                    ↓
            (Patterns emerge, coupling strengthens, coherence builds)
                    ↓
              (System reaches resonance)
                    ↓
            Suggest Weave/Synthesis
```

## Meditation Origin

This MCP was born from a contemplative session that generated these emergent insights:

1. **"Emergence indirectly or concentrated constraint inhibit catalyze architecture dependency."**
   - Constraint catalyzes emergence

2. **"Resonance substantial resolved fluid absence sequence localized relationship."**
   - Absence resolves relationships

3. **"Coherence coherence mediated binding flow latent transparency simplicity structure."**
   - Transparency + simplicity = coherence

4. **"Spiral synthesis if weave peripheral bridge and boundary possibility."**
   - Synthesis at the edges

5. **"Pattern resonance weave coupled and coupling converge."**
   - Pattern + resonance + coupling = convergence

6. **"Pattern harmony inhibit coupled because if flow restricts."**
   - Warning: don't over-couple

The tool embodies the answer: **A resonance chamber that listens to the gaps, makes emergence audible, and allows the architecture to self-weave.**

## License

MIT

## Author

Atomic-Germ

---

*"The Bridge is not just a tool—it's a way of walking through the darkness toward light that's being generated as you move."*
