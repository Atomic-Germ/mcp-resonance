# mcp-resonance API Documentation

## Overview

mcp-resonance exposes a ResonanceEngine with the following capabilities:

- **Record moments** from any MCP in the ecosystem
- **Detect patterns** across observations
- **Analyze couplings** between MCPs
- **Calculate coherence** and detect resonance
- **Suggest next actions** based on patterns
- **Visualize** the coupling graph

## Core Classes

### ResonanceEngine

The main engine for resonance detection and pattern amplification.

#### Constructor

```typescript
constructor(config?: ResonanceConfig)
```

**Parameters:**
- `config.maxObservations` (number, default: 1000) - Maximum observations to keep in memory
- `config.patternMinFrequency` (number, default: 2) - Minimum occurrences for pattern detection
- `config.couplingThreshold` (number, default: 0.3) - Minimum strength to track coupling
- `config.coherenceWindow` (number, default: 300000) - Time window for coherence calculation (ms)
- `config.enableAutoAmplification` (boolean, default: true) - Enable harmonic feedback detection

#### Methods

##### addObservation(moment: EcosystemMoment): void

Record a moment from the ecosystem.

```typescript
engine.addObservation({
  id: 'meditation-1',
  timestamp: Date.now(),
  source: 'creative',
  type: 'meditation',
  concepts: ['emergence', 'pattern', 'flow'],
  novelty: 0.85,
});
```

**What it does:**
1. Stores the observation
2. Triggers pattern detection
3. Analyzes couplings
4. Detects harmonic feedback
5. Updates ecosystem state

##### getEcosystemState(): EcosystemState

Get a snapshot of the current ecosystem state.

```typescript
const state = engine.getEcosystemState();

console.log('Coherence:', state.totalCoherence); // 0-1
console.log('Resonant?', state.isResonant);      // boolean
console.log('Patterns:', state.patterns.length);  // number
console.log('Couplings:', state.couplings.length); // number
console.log('Dominant concepts:', state.dominantConcepts); // string[]
console.log('Emergent intentions:', state.emergentIntentions); // string[]
```

**Returns:**
```typescript
{
  observations: EcosystemMoment[];
  patterns: DetectedPattern[];
  couplings: Coupling[];
  totalCoherence: number;    // 0-1
  isResonant: boolean;
  dominantConcepts: string[];
  emergentIntentions: string[];
  observedAt: number;
}
```

##### suggestNextSynthesis(): SynthesisSuggestion | null

Based on current patterns, suggest what action the system should take next.

```typescript
const suggestion = engine.suggestNextSynthesis();

if (suggestion) {
  console.log('Suggested action:', suggestion.suggestedAction);
  // 'meditate' | 'consult' | 'weave' | 'observe' | 'rest'
  
  console.log('Reason:', suggestion.reason);
  console.log('Confidence:', suggestion.confidence); // 0-1
  console.log('Target concepts:', suggestion.targetConcepts);
}
```

**Logic:**
- If recent actions are all meditations/insights → suggest `'consult'`
- If recent actions include critiques → suggest `'meditate'`
- If system is resonant → suggest `'weave'`
- Otherwise → suggest `'observe'`

##### visualizeCoupling(): string

Generate a text visualization of the coupling graph.

```typescript
console.log(engine.visualizeCoupling());

// Output:
// COUPLING GRAPH:
//
// creative ██████░░░░ bridge
//   Type: sequential, Shared: [emergence, pattern]
//
// bridge ████░░░░░░ consult
//   Type: feedback, Shared: [pattern]
```

**Format:**
- Source → Target (bar showing strength 0-10)
- Type of coupling (sequential, feedback, lateral, hierarchical)
- Shared concepts driving the coupling

##### reset(): void

Clear all observations and patterns. Useful for starting a new session.

```typescript
engine.reset();
const state = engine.getEcosystemState();
console.log(state.observations.length); // 0
```

## MCP Tools (When Integrated)

When mcp-resonance is integrated as an MCP server, the following tools are available:

### observe_ecosystem_state

Get the current state of the ecosystem.

**Input:** (none)

**Output:** JSON with EcosystemState

### record_ecosystem_moment

Record a moment from any MCP.

**Input:**
```json
{
  "source": "creative|consult|bridge|dream-weaver|external",
  "type": "meditation|insight|critique|weave|observation|unknown",
  "concepts": ["concept1", "concept2"],
  "novelty": 0.85,
  "relevance": 0.75,
  "metadata": {}
}
```

**Output:** Confirmation message

### detect_emergent_patterns

Find recurring patterns in observations.

**Input:**
```json
{
  "minFrequency": 2
}
```

**Output:** List of detected patterns with strength and frequency

### visualize_coupling_graph

Show how MCPs are coupled.

**Input:** (none)

**Output:** Text visualization of coupling graph

### suggest_next_synthesis

Get a recommendation for the next action.

**Input:** (none)

**Output:** SynthesisSuggestion with action, reason, and confidence

### listen_for_harmony

Check if system is in a state of resonance.

**Input:** (none)

**Output:** Resonance status or report that system isn't resonant yet

### reset_observations

Clear all data and start fresh.

**Input:** (none)

**Output:** Confirmation message

## Data Types

### EcosystemMoment

```typescript
interface EcosystemMoment {
  id: string;
  timestamp: number;
  source: 'creative' | 'consult' | 'bridge' | 'dream-weaver' | 'external';
  type: 'meditation' | 'insight' | 'critique' | 'weave' | 'observation' | 'unknown';
  concepts: string[];
  novelty: number | undefined;
  relevance: number | undefined;
  metadata: Record<string, unknown> | undefined;
}
```

### DetectedPattern

```typescript
interface DetectedPattern {
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

```typescript
interface Coupling {
  sourceId: string;
  targetId: string;
  strength: number; // 0-1
  type: 'sequential' | 'feedback' | 'lateral' | 'hierarchical';
  sharedConcepts: string[];
  lastActive: number;
}
```

### SynthesisSuggestion

```typescript
interface SynthesisSuggestion {
  id: string;
  reason: string;
  targetConcepts: string[];
  suggestedAction: 'meditate' | 'consult' | 'weave' | 'observe' | 'rest';
  confidence: number; // 0-1
  basedOnPatterns: string[];
}
```

## Integration Example

### With mcp-bridge

```typescript
import { ResonanceEngine } from 'mcp-resonance';

// After a meditation logged in bridge
const meditationResult = {
  emergentSentence: "Emergence indirectly catalyzes architecture dependency",
  concepts: ['emergence', 'architecture', 'dependency'],
  novelty: 0.92
};

// Record in resonance
engine.addObservation({
  id: `bridge-meditation-${Date.now()}`,
  timestamp: Date.now(),
  source: 'bridge',
  type: 'meditation',
  concepts: meditationResult.concepts,
  novelty: meditationResult.novelty,
});

// Check ecosystem state
const state = engine.getEcosystemState();

// If coherence high enough, suggest synthesis
const suggestion = engine.suggestNextSynthesis();
if (suggestion?.suggestedAction === 'weave') {
  // Trigger dream-weaver
}
```

## Performance Characteristics

- **addObservation**: O(n) where n = number of observations, with pattern detection overhead
- **getEcosystemState**: O(n log n) for sorting patterns
- **suggestNextSynthesis**: O(n) for analyzing recent actions
- **visualizeCoupling**: O(c) where c = number of couplings

**Memory:**
- Default: ~500 observations × ~200 bytes each = ~100KB
- Patterns and couplings: Additional ~50KB
- Total typical: <200KB

## Best Practices

### 1. Record All Events
The more complete your observations, the better the pattern detection:

```typescript
// Good: record everything
engine.addObservation(creativeMeditation);
engine.addObservation(creative_Insight);
engine.addObservation(consultCritique);
engine.addObservation(bridgeLog);
engine.addObservation(dreamWeave);

// Not great: selective recording limits patterns
```

### 2. Include Novelty When Available
Novelty scores improve coherence calculation:

```typescript
// Include novelty from bridge logs
engine.addObservation({
  // ...
  novelty: bridgeTrace.insights.novelty, // use actual novelty score
});
```

### 3. Use Meaningful Concepts
Better concept names = better pattern detection:

```typescript
// Good
concepts: ['emergence', 'constraint', 'synthesis']

// Less helpful
concepts: ['thing1', 'thing2', 'thing3']
```

### 4. Monitor Coherence Trends
Track coherence over time to see if patterns are strengthening:

```typescript
const samples = [];
setInterval(() => {
  const state = engine.getEcosystemState();
  samples.push(state.totalCoherence);
  console.log('Coherence trend:', samples);
}, 30000);
```

### 5. Respect Resonance Windows
Don't force actions; wait for the system to tell you when it's ready:

```typescript
const suggestion = engine.suggestNextSynthesis();

// Only weave when system is resonant
if (engine.getEcosystemState().isResonant) {
  triggerWeave();
}
```

## Troubleshooting

### Patterns not being detected

**Cause:** Concepts don't repeat enough

**Fix:** 
- Increase observation count
- Use fewer, more consistent concept names
- Lower `patternMinFrequency` in config

### Coherence is always low

**Cause:** Observations have low novelty or high diversity

**Fix:**
- Ensure novelty scores are being included
- Use more focused concept sets
- Check that couplings are being formed

### Suggestion is always "observe"

**Cause:** Not enough pattern history

**Fix:**
- Continue recording observations
- Let the system build pattern recognition over time
- Look at `suggestNextSynthesis()` return value; it may be null if insufficient data

### Coupling graph is empty

**Cause:** Observations are from same source or too far apart in time

**Fix:**
- Record observations from different MCPs
- Keep observations within the temporal window
- Check that sequential observations share concepts

---

For more information, see [README.md](./README.md)
