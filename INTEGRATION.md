# mcp-resonance Integration Guide

## Quick Start: Integrate with mcp-bridge

### What Gets Connected

```
mcp-bridge sessions
    ↓
    ├→ Meditation logged → resonance.onMeditationLogged()
    ├→ Critique logged → resonance.onCritiqueLogged()
    └→ Weave logged → resonance.onNarrativeWoven()
    ↓
resonance.getEcosystemStateWithRecommendation()
    ↓
mcp-bridge suggests next action based on resonance analysis
```

### Installation

```bash
cd mcp-resonance
npm install
npm run build
```

### Using the Integration

#### Option 1: Run the Demo

```bash
npm run build
node dist/index.js --demo
```

This simulates a complete meditation-critique-weave cycle and shows:
- Patterns being detected in real-time
- Coupling analysis between MCPs
- Coherence rising as observations accumulate
- System reaching resonance
- Suggestion to weave when ready

#### Option 2: Import and Use in Bridge

```typescript
import { BridgeIntegrationAdapter } from 'mcp-resonance';
import { ResonanceEngine } from 'mcp-resonance';

// Initialize
const engine = new ResonanceEngine();
const adapter = new BridgeIntegrationAdapter(engine);

// When mcp-bridge logs a meditation
bridge.on('meditation-logged', (traceId, data) => {
  adapter.onMeditationLogged(traceId, {
    emergentSentence: data.emergentSentence,
    contextWords: data.contextWords,
    extractedPatterns: data.insights.extractedPatterns,
    novelty: data.insights.novelty,
  });
});

// When mcp-bridge logs a critique
bridge.on('critique-logged', (traceId, data) => {
  adapter.onCritiqueLogged(traceId, {
    model: data.model,
    relevanceScore: data.relevanceScore,
    extractedFeedback: data.extractedFeedback,
  });
});

// When dream-weaver produces a narrative
dreamWeaver.on('narrative-complete', (narrativeId, data) => {
  adapter.onNarrativeWoven(narrativeId, {
    narrative: data.dream,
    sourceTraces: data.sourceTraces,
  });
});

// Check ecosystem state
const state = adapter.getEcosystemStateWithRecommendation();

if (state.recommendation?.shouldWeave) {
  // Trigger weaving
  dreamWeaver.weave();
}

// Get a human-readable report
console.log(adapter.generateReport());
```

### The Report Output

When you call `adapter.generateReport()`, you get:

```
═══════════════════════════════════════════════════════════
                  🌊 RESONANCE REPORT 🌊
═══════════════════════════════════════════════════════════

⏱️  Observed: 2:45:30 PM
📊 Observations: 12 moments recorded
🎨 Patterns: 5 emergent patterns detected
🔗 Couplings: 3 connections between MCPs

═══════════════════════════════════════════════════════════
                   💫 SYSTEM METRICS 💫
═══════════════════════════════════════════════════════════

Coherence: ███████████████░░░░ 75.3%
Status: ✨ RESONANT ✨

🎯 Dominant Concepts:
   • emergence
   • pattern
   • synthesis

🔍 Top Patterns:
   • emergence Resonance ██████████ (95%)
   • pattern Harmony ████████ (82%)
   • synthesis Intention █████ (63%)

🌉 Active Couplings:
   creative ██████████ bridge
     Type: sequential, Shared: [emergence, pattern]

   bridge ████████ consult
     Type: feedback, Shared: [pattern, feedback]

═══════════════════════════════════════════════════════════
                   🎯 RECOMMENDATION 🎯
═══════════════════════════════════════════════════════════

Action: WEAVE
Confidence: 85%
Reason: System suggests weave to amplify: emergence Resonance, pattern Harmony

✨ SYSTEM IS READY FOR SYNTHESIS ✨
The patterns have aligned. This is an optimal moment to weave.

═══════════════════════════════════════════════════════════
```

## Integration Points

### BridgeIntegrationAdapter Methods

#### onMeditationLogged(traceId, data)
Called when mcp-bridge logs a meditation trace.

**Input:**
```typescript
{
  emergentSentence: string;
  contextWords: string[];
  extractedPatterns: string[];
  novelty: number;
}
```

#### onCritiqueLogged(traceId, data)
Called when mcp-bridge logs a critique/consult trace.

**Input:**
```typescript
{
  model: string;
  relevanceScore: number;
  extractedFeedback: string[];
}
```

#### onNarrativeWoven(narrativeId, data)
Called when dream-weaver completes a narrative.

**Input:**
```typescript
{
  narrative: string;
  sourceTraces: string[];
}
```

#### onInsightGenerated(insightId, data)
Called when creative generates an insight.

**Input:**
```typescript
{
  insights: Array<{ pattern: string; description: string }>;
  novelty: number;
}
```

### Getting Results

#### getEcosystemStateWithRecommendation()
Returns the full state with recommendation:

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
  recommendation: {
    action: 'meditate' | 'consult' | 'weave' | 'observe' | 'rest';
    reason: string;
    confidence: number;        // 0-1
    shouldWeave: boolean;      // true when system is ready for synthesis
  } | null;
}
```

#### generateReport()
Returns a formatted string report:

```typescript
const report = adapter.generateReport();
console.log(report);
```

## Data Flow Example

Here's a complete example flow:

```typescript
import { BridgeIntegrationAdapter, ResonanceEngine } from 'mcp-resonance';

const engine = new ResonanceEngine();
const adapter = new BridgeIntegrationAdapter(engine);

// Step 1: Meditation happens
adapter.onMeditationLogged('med-001', {
  emergentSentence: "Pattern resonance weaves coupling and convergence",
  contextWords: ['pattern', 'resonance', 'weave'],
  extractedPatterns: ['pattern', 'resonance', 'coupling'],
  novelty: 0.92,
});

// Step 2: Insight extracted
adapter.onInsightGenerated('ins-001', {
  insights: [
    { pattern: 'pattern', description: 'Recurring theme' },
    { pattern: 'resonance', description: 'Harmonic coupling' }
  ],
  novelty: 0.88,
});

// Step 3: Critique applied
adapter.onCritiqueLogged('crit-001', {
  model: 'deepseek-v3.1',
  relevanceScore: 0.95,
  extractedFeedback: ['Patterns are strengthening', 'System approaching harmony']
});

// Step 4: Check state
const state = adapter.getEcosystemStateWithRecommendation();
console.log(`Coherence: ${(state.totalCoherence * 100).toFixed(1)}%`);
console.log(`Resonant: ${state.isResonant}`);
console.log(`Next action: ${state.recommendation?.action}`);

// Step 5: If ready, trigger weave
if (state.recommendation?.shouldWeave) {
  // Call dream-weaver to synthesize
  const narrative = await dreamWeaver.weave([
    med001, ins001, crit001
  ]);
  
  // Log the narrative
  adapter.onNarrativeWoven('weave-001', {
    narrative: narrative,
    sourceTraces: ['med-001', 'ins-001', 'crit-001']
  });
}

// Step 6: Get final report
console.log(adapter.generateReport());
```

## Testing the Integration

The demo includes a simulated complete cycle. To run it:

```bash
npm run build
node dist/index.js --demo
```

This will:
1. Create 3 meditations
2. Log insights
3. Log critiques
4. Check coherence mid-cycle
5. Continue to synthesis
6. Demonstrate the weaving point

Watch the coherence rise as patterns accumulate and coupling strengthens.

## Metrics Explained

### Coherence (0-1)
Measure of system unity:
- 0.0 = Completely fragmented
- 0.5 = Moderate coherence (threshold for synthesis consideration)
- 1.0 = Perfect harmony

Calculated from:
- Average novelty of recent observations
- Strength of detected patterns
- Activity of couplings

### Resonance (true/false)
System is in harmonic state when:
- Coherence > 50%
- Multiple patterns are strong (>0.6)
- Couplings are actively reinforcing

### Pattern Strength (0-1)
Confidence in a pattern:
- 0.3 = Just detected
- 0.6 = Recurring theme
- 1.0 = Dominant pattern

### Coupling Strength (0-1)
Confidence in a connection:
- 0.3 = New coupling
- 0.6 = Strong connection
- 1.0 = Very tight coupling (warning: risk of over-constraint)

## Next Steps

1. **Wire into bridge** - Add event listeners for meditation/critique/weave logs
2. **Monitor in real sessions** - Watch patterns emerge from actual meditation cycles
3. **Fine-tune thresholds** - Adjust pattern detection sensitivity based on real data
4. **Add persistence** - Store observation history for session continuity
5. **Visualize live** - Add real-time dashboard showing coherence and patterns

---

For complete API documentation, see [API.md](./API.md)
For philosophy and design, see [BRIDGE_JOURNEY.md](./BRIDGE_JOURNEY.md)
