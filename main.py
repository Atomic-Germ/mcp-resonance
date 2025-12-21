#!/usr/bin/env python3
"""
Fast Resonance - MCP Harmonic Observer

The Harmonic Observer - An MCP server that listens to the resonance between other MCPs,
detecting emergent patterns and amplifying the connections that want to form.
"""

import json
import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from collections import defaultdict

from fastmcp import FastMCP

# Type definitions
@dataclass
class EcosystemMoment:
    """A single moment in time within the ecosystem"""
    id: str
    timestamp: float
    source: str  # 'creative' | 'consult' | 'bridge' | 'dream-weaver' | 'external'
    type: str    # 'meditation' | 'insight' | 'critique' | 'weave' | 'observation' | 'unknown'
    concepts: List[str]
    novelty: Optional[float] = None
    relevance: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class DetectedPattern:
    """A pattern detected across moments"""
    id: str
    name: str
    concepts: List[str]
    occurrences: List[EcosystemMoment] = field(default_factory=list)
    frequency: int = 0
    strength: float = 0.0  # 0 to 1
    emergence_time: float = 0.0
    related_patterns: List[str] = field(default_factory=list)

@dataclass
class Coupling:
    """How two MCPs or concepts are connected"""
    source_id: str
    target_id: str
    strength: float = 0.0  # 0 to 1
    type: str = 'sequential'  # 'sequential' | 'feedback' | 'lateral' | 'hierarchical'
    shared_concepts: List[str] = field(default_factory=list)
    last_active: float = 0.0

@dataclass
class HarmonicFeedback:
    """When patterns strengthen each other"""
    pattern1_id: str
    pattern2_id: str
    amplification_factor: float
    resonance_frequency: float

@dataclass
class EcosystemState:
    """Current state of the ecosystem"""
    observations: List[EcosystemMoment] = field(default_factory=list)
    patterns: List[DetectedPattern] = field(default_factory=list)
    couplings: List[Coupling] = field(default_factory=list)
    total_coherence: float = 0.0  # 0 to 1
    is_resonant: bool = False
    dominant_concepts: List[str] = field(default_factory=list)
    emergent_intentions: List[str] = field(default_factory=list)
    observed_at: float = 0.0

@dataclass
class SynthesisSuggestion:
    """Suggested next action"""
    id: str
    reason: str
    target_concepts: List[str]
    suggested_action: str  # 'meditate' | 'consult' | 'weave' | 'observe' | 'rest'
    confidence: float
    based_on_patterns: List[str]

@dataclass
class ResonanceConfig:
    """Configuration for the resonance observer"""
    max_observations: int = 1000
    pattern_min_frequency: int = 2
    coupling_threshold: float = 0.3
    coherence_window: float = 300000  # 5 minutes in milliseconds
    enable_auto_amplification: bool = True

class ResonanceEngine:
    """Core Resonance Engine - detects patterns, analyzes couplings, amplifies emergence"""

    def __init__(self, config: Optional[ResonanceConfig] = None):
        self.config = config or ResonanceConfig()
        self.observations: List[EcosystemMoment] = []
        self.patterns: Dict[str, DetectedPattern] = {}
        self.couplings: Dict[str, Coupling] = {}
        self.harmonics: List[HarmonicFeedback] = []

    def add_observation(self, moment: EcosystemMoment) -> None:
        """Record a moment from the ecosystem"""
        self.observations.append(moment)

        # Keep only recent observations
        if len(self.observations) > self.config.max_observations:
            self.observations = self.observations[-self.config.max_observations:]

        # Trigger analysis
        self._detect_patterns()
        self._analyze_couplings()

        if self.config.enable_auto_amplification:
            self._detect_harmonic()

    def _detect_patterns(self) -> None:
        """Detect patterns across observations"""
        concept_frequency: Dict[str, List[EcosystemMoment]] = defaultdict(list)

        # Count occurrences of each concept
        for obs in self.observations:
            for concept in obs.concepts:
                concept_frequency[concept].append(obs)

        # Create patterns for concepts that appear frequently
        for concept, moments in concept_frequency.items():
            if len(moments) >= self.config.pattern_min_frequency:
                pattern_id = f"pattern-{concept}-{int(time.time() * 1000)}"

                if pattern_id not in self.patterns:
                    pattern = DetectedPattern(
                        id=pattern_id,
                        name=f"{concept} Resonance",
                        concepts=[concept],
                        occurrences=moments,
                        frequency=len(moments),
                        strength=min(1.0, len(moments) / 10.0),
                        emergence_time=moments[0].timestamp if moments else time.time()
                    )
                    self.patterns[pattern_id] = pattern
                else:
                    existing = self.patterns[pattern_id]
                    existing.occurrences = moments
                    existing.frequency = len(moments)
                    existing.strength = min(1.0, len(moments) / 10.0)

    def _analyze_couplings(self) -> None:
        """Analyze how MCPs/concepts are coupled together"""
        # Look at sequential moments to find couplings
        for i in range(len(self.observations) - 1):
            curr = self.observations[i]
            next_obs = self.observations[i + 1]

            if not curr or not next_obs:
                continue

            # Find shared concepts
            shared_concepts = [c for c in curr.concepts if c in next_obs.concepts]

            if shared_concepts:
                coupling_id = f"{curr.source}->{next_obs.source}"
                time_delta = next_obs.timestamp - curr.timestamp
                is_recent = time_delta < 60000  # within 1 minute

                if coupling_id in self.couplings:
                    coupling = self.couplings[coupling_id]
                    coupling.strength = min(1.0, coupling.strength + 0.1 * (1.0 if is_recent else 0.5))
                    coupling.shared_concepts = list(set(coupling.shared_concepts + shared_concepts))
                    coupling.last_active = next_obs.timestamp
                else:
                    coupling = Coupling(
                        source_id=curr.source,
                        target_id=next_obs.source,
                        strength=0.3,
                        type=self._infer_coupling_type(curr, next_obs),
                        shared_concepts=shared_concepts,
                        last_active=next_obs.timestamp
                    )
                    self.couplings[coupling_id] = coupling

    def _infer_coupling_type(self, curr: EcosystemMoment, next_obs: EcosystemMoment) -> str:
        """Infer the type of coupling between two moments"""
        is_follow_up = (
            (curr.type == 'meditation' and next_obs.type == 'insight') or
            (curr.type == 'insight' and next_obs.type == 'critique') or
            (curr.type == 'critique' and next_obs.type == 'meditation')
        )

        if is_follow_up:
            return 'sequential'

        has_shared_source = curr.source == next_obs.source
        if has_shared_source:
            return 'lateral'

        time_delta = next_obs.timestamp - curr.timestamp
        if time_delta < 5000:
            return 'feedback'  # tight coupling

        return 'hierarchical'

    def _detect_harmonic(self) -> None:
        """Detect harmonic feedback - when patterns strengthen each other"""
        pattern_list = list(self.patterns.values())

        for i in range(len(pattern_list)):
            p1 = pattern_list[i]
            for j in range(i + 1, len(pattern_list)):
                p2 = pattern_list[j]

                # Check if patterns appear together frequently
                common_occurrences = 0
                for o1 in p1.occurrences:
                    for o2 in p2.occurrences:
                        if abs(o1.timestamp - o2.timestamp) < 30000:  # within 30 seconds
                            common_occurrences += 1
                            break

                if common_occurrences > 0:
                    amplification = (p1.strength * p2.strength * common_occurrences) / p1.frequency

                    feedback = HarmonicFeedback(
                        pattern1_id=p1.id,
                        pattern2_id=p2.id,
                        amplification_factor=amplification,
                        resonance_frequency=1.0 / (common_occurrences + 1)
                    )

                    # Strengthen the patterns
                    p1.strength = min(1.0, p1.strength + 0.05 * amplification)
                    p2.strength = min(1.0, p2.strength + 0.05 * amplification)

                    self.harmonics.append(feedback)

        # Keep only recent harmonics
        self.harmonics = self.harmonics[-100:]

    def get_ecosystem_state(self) -> EcosystemState:
        """Get the current state of the ecosystem"""
        recent_window = time.time() - (self.config.coherence_window / 1000)  # convert to seconds
        recent_observations = [o for o in self.observations if o.timestamp > recent_window]

        # Calculate coherence (0 to 1)
        avg_novelty = sum(o.novelty or 0.5 for o in recent_observations) / max(len(recent_observations), 1)
        pattern_strengths = [p.strength for p in self.patterns.values()]
        avg_pattern_strength = sum(pattern_strengths) / max(len(pattern_strengths), 1)
        total_coherence = min(1.0, avg_novelty * avg_pattern_strength)

        # Determine if system is resonant
        active_couplings = [c for c in self.couplings.values() if time.time() - c.last_active < 60]
        is_resonant = len(active_couplings) > 0 and total_coherence > 0.5 and len(self.harmonics) > 2

        # Extract dominant concepts
        concept_scores: Dict[str, float] = defaultdict(float)
        for obs in recent_observations:
            for concept in obs.concepts:
                concept_scores[concept] += obs.novelty or 0.5

        dominant_concepts = sorted(concept_scores.items(), key=lambda x: x[1], reverse=True)[:5]
        dominant_concepts = [concept for concept, _ in dominant_concepts]

        # Extract emergent intentions
        emergent_intentions = [p.name for p in list(self.patterns.values()) if p.strength > 0.6][:3]

        return EcosystemState(
            observations=recent_observations,
            patterns=list(self.patterns.values()),
            couplings=list(self.couplings.values()),
            total_coherence=total_coherence,
            is_resonant=is_resonant,
            dominant_concepts=dominant_concepts,
            emergent_intentions=emergent_intentions,
            observed_at=time.time()
        )

    def suggest_next_synthesis(self) -> Optional[SynthesisSuggestion]:
        """Suggest the next synthesis based on current patterns"""
        state = self.get_ecosystem_state()

        if not state.emergent_intentions:
            return None

        # Check what kind of action would amplify current patterns
        last_observations = self.observations[-5:]
        last_types = [o.type for o in last_observations]

        suggested_action = 'observe'

        # Suggest based on pattern of recent actions
        if all(t in ['meditation', 'insight'] for t in last_types):
            suggested_action = 'consult'  # Time to get critique
        elif any(t == 'critique' for t in last_types):
            suggested_action = 'meditate'  # Feed the critique back in
        elif state.is_resonant:
            suggested_action = 'weave'  # System is ready to synthesize

        return SynthesisSuggestion(
            id=f"synthesis-{int(time.time() * 1000)}",
            reason=f"System suggests {suggested_action} to amplify: {', '.join(state.emergent_intentions)}",
            target_concepts=state.dominant_concepts,
            suggested_action=suggested_action,
            confidence=state.total_coherence,
            based_on_patterns=[p.id for p in state.patterns[:3]]
        )

    def visualize_coupling(self) -> str:
        """Visualize the coupling graph as text"""
        active = [c for c in self.couplings.values() if time.time() - c.last_active < 120]
        active.sort(key=lambda c: c.strength, reverse=True)

        if not active:
            return 'No active couplings detected.'

        viz = 'COUPLING GRAPH:\n\n'
        for coupling in active:
            strength = round(coupling.strength * 10)
            bar = '█' * strength + '░' * (10 - strength)
            viz += f"{coupling.source_id} {bar} {coupling.target_id}\n"
            viz += f"  Type: {coupling.type}, Shared: [{', '.join(coupling.shared_concepts)}]\n\n"

        return viz

    def reset(self) -> None:
        """Clear all observations and patterns"""
        self.observations.clear()
        self.patterns.clear()
        self.couplings.clear()
        self.harmonics.clear()

# Initialize the resonance engine
engine = ResonanceEngine()

# Create FastMCP server
mcp = FastMCP("MCP Resonance - Harmonic Observer")

@mcp.tool()
def observe_ecosystem_state() -> str:
    """
    Get a snapshot of the current ecosystem state, including active patterns, couplings, and coherence metrics
    """
    state = engine.get_ecosystem_state()
    return json.dumps({
        "observations": [{"id": o.id, "timestamp": o.timestamp, "source": o.source, "type": o.type,
                         "concepts": o.concepts, "novelty": o.novelty, "relevance": o.relevance}
                        for o in state.observations],
        "patterns": [{"id": p.id, "name": p.name, "concepts": p.concepts, "frequency": p.frequency,
                     "strength": p.strength, "emergence_time": p.emergence_time,
                     "related_patterns": p.related_patterns} for p in state.patterns],
        "couplings": [{"source_id": c.source_id, "target_id": c.target_id, "strength": c.strength,
                      "type": c.type, "shared_concepts": c.shared_concepts, "last_active": c.last_active}
                     for c in state.couplings],
        "total_coherence": state.total_coherence,
        "is_resonant": state.is_resonant,
        "dominant_concepts": state.dominant_concepts,
        "emergent_intentions": state.emergent_intentions,
        "observed_at": state.observed_at
    }, indent=2)

@mcp.tool()
def record_ecosystem_moment(
    source: str,
    type: str,
    concepts: List[str],
    novelty: Optional[float] = None,
    relevance: Optional[float] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> str:
    """
    Record a moment (event) from the ecosystem - a meditation, critique, insight, weave, or other observation
    """
    moment = EcosystemMoment(
        id=f"moment-{int(time.time() * 1000)}-{hash(str(time.time())) % 10000}",
        timestamp=time.time(),
        source=source,
        type=type,
        concepts=concepts,
        novelty=novelty,
        relevance=relevance,
        metadata=metadata
    )

    engine.add_observation(moment)

    return f"Recorded moment from {moment.source}: \"{', '.join(moment.concepts)}\" (novelty: {moment.novelty or 'unknown'})"

@mcp.tool()
def detect_emergent_patterns(min_frequency: Optional[int] = None) -> str:
    """
    Analyze all observations to detect recurring patterns and emergent themes
    """
    state = engine.get_ecosystem_state()
    min_freq = min_frequency or engine.config.pattern_min_frequency

    patterns = [p for p in state.patterns if p.frequency >= min_freq]
    patterns.sort(key=lambda p: p.strength, reverse=True)
    patterns = patterns[:10]

    if not patterns:
        return 'No significant patterns detected yet. Keep observing.'

    result = f'DETECTED PATTERNS ({len(patterns)}):\n\n'
    for pattern in patterns:
        result += f'• {pattern.name} [strength: {pattern.strength * 100:.0f}%]\n'
        result += f'  Concepts: {", ".join(pattern.concepts)}\n'
        result += f'  Frequency: {pattern.frequency} occurrences\n'
        result += f'  Related patterns: {", ".join(pattern.related_patterns) or "none yet"}\n\n'

    return result

@mcp.tool()
def visualize_coupling_graph() -> str:
    """
    Generate a text visualization of how MCPs and concepts are coupled together
    """
    return engine.visualize_coupling()

@mcp.tool()
def suggest_next_synthesis() -> str:
    """
    Based on current patterns, suggest what action the system should take next (meditate, consult, weave, observe)
    """
    suggestion = engine.suggest_next_synthesis()

    if not suggestion:
        return 'System does not yet have enough data to suggest a synthesis. Continue observing.'

    return f"""SUGGESTED NEXT ACTION: {suggestion.suggested_action.upper()}

Reason: {suggestion.reason}
Confidence: {suggestion.confidence * 100:.0f}%
Target concepts: {', '.join(suggestion.target_concepts)}
Based on patterns: {', '.join(suggestion.based_on_patterns)}"""

@mcp.tool()
def listen_for_harmony() -> str:
    """
    Check if the system is in a state of resonance/harmony - when patterns strengthen each other
    """
    state = engine.get_ecosystem_state()

    if not state.is_resonant:
        return f"""System is not in resonance yet.
Coherence: {state.total_coherence * 100:.0f}% (need > 50%)
Active patterns: {len(state.patterns)}
Harmonics: {len(engine.harmonics)} emergent harmonics"""

    return f"""✨ SYSTEM IN RESONANCE! ✨

Coherence: {state.total_coherence * 100:.0f}%
Active patterns: {len(state.patterns)}
Emergent intentions: {', '.join(state.emergent_intentions)}
Dominant concepts: {', '.join(state.dominant_concepts)}

The system is harmonizing. This is the optimal moment for synthesis."""

@mcp.tool()
def reset_observations() -> str:
    """
    Clear all observations and patterns (useful for starting a new session)
    """
    engine.reset()
    return 'All observations and patterns cleared. Ready for a new session.'


@mcp.prompt("resonance_workflow")
def resonance_workflow_guide() -> list[dict]:
    """
    Guide for the resonance observation workflow.

    This prompt explains the optimal workflow for observing and amplifying
    emergent patterns in the MCP ecosystem.
    """
    return [
        {
            "role": "user",
            "content": """# Resonance Observation Workflow Guide

## The Resonance Process

Resonance emerges when multiple MCPs interact, creating patterns that strengthen each other. This server observes these interactions and amplifies the connections that want to form.

### Core Activities

#### 1. Record Moments (`record_ecosystem_moment`)
**Purpose**: Capture significant events from MCP interactions
- **Source**: Which MCP generated this moment (creative, consult, bridge, etc.)
- **Type**: The nature of the event (meditation, insight, critique, weave, observation)
- **Concepts**: Key concepts or themes present in this moment
- **Novelty/Relevance**: Optional scoring (0-1) for pattern detection

#### 2. Observe State (`observe_ecosystem_state`)
**Purpose**: Get comprehensive view of current ecosystem dynamics
- **Patterns**: Recurring themes and their strength
- **Couplings**: How different MCPs are connected
- **Coherence**: Overall system harmony (0-1 scale)
- **Resonance**: Whether the system is in harmonic amplification

#### 3. Detect Patterns (`detect_emergent_patterns`)
**Purpose**: Identify recurring themes across observations
- **Frequency Analysis**: How often concepts appear
- **Strength Measurement**: Pattern significance (0-100%)
- **Emergence Tracking**: When patterns first appeared

#### 4. Check Harmony (`listen_for_harmony`)
**Purpose**: Determine if the system is resonating
- **Resonance Detection**: When patterns strengthen each other
- **Coherence Threshold**: >50% indicates potential resonance
- **Harmonic Feedback**: Multiple patterns amplifying together

#### 5. Get Synthesis Suggestions (`suggest_next_synthesis`)
**Purpose**: Know what action would amplify current patterns
- **Action Types**: meditate, consult, weave, observe, rest
- **Confidence Scoring**: Based on current coherence
- **Pattern-Based**: Suggestions grounded in observed dynamics

## Recommended Workflow

### Phase 1: Initial Observation (Build Foundation)
1. **Start Recording**: Begin with `record_ecosystem_moment` for each significant MCP interaction
2. **Monitor State**: Use `observe_ecosystem_state` to track ecosystem evolution
3. **Build Patterns**: Let the system accumulate observations until patterns emerge

### Phase 2: Pattern Recognition (Find Resonance)
1. **Detect Patterns**: Use `detect_emergent_patterns` to identify recurring themes
2. **Check Coupling**: Use `visualize_coupling_graph` to see MCP interconnections
3. **Monitor Harmony**: Regularly check `listen_for_harmony` for resonance indicators

### Phase 3: Amplification (Strengthen Resonance)
1. **Follow Suggestions**: Use `suggest_next_synthesis` to know what to do next
2. **Record Results**: Continue recording moments from suggested actions
3. **Amplify Loops**: When resonance occurs, the system strengthens itself

## Resonance Applications

- **MCP Coordination**: Understand how different MCPs work together
- **Creative Synthesis**: Find optimal moments for combining creative outputs
- **Pattern Discovery**: Identify emergent themes across multiple interactions
- **System Optimization**: Know when and how to intervene in MCP ecosystems
- **Harmonic Timing**: Recognize optimal moments for synthesis and integration

## Tips for Best Results

- **Consistent Recording**: Record moments immediately after significant MCP interactions
- **Rich Concepts**: Use specific, meaningful concept tags for better pattern detection
- **Regular Monitoring**: Check resonance state frequently during active sessions
- **Follow Suggestions**: The system's suggestions are based on actual pattern analysis
- **Session Management**: Use `reset_observations` to start fresh analysis sessions

## Understanding Resonance Metrics

### Coherence (0-1)
- **0.0-0.3**: System is incoherent, needs more observations
- **0.3-0.5**: Patterns emerging, continue recording
- **0.5-0.7**: Moderate resonance, good for synthesis
- **0.7-1.0**: High resonance, optimal for amplification

### Pattern Strength (0-100%)
- **0-30%**: Weak pattern, may not be significant
- **30-60%**: Moderate pattern, worth monitoring
- **60-100%**: Strong pattern, likely to influence synthesis

### Coupling Types
- **Sequential**: Actions that follow each other naturally
- **Feedback**: Tight loops where actions reinforce each other
- **Lateral**: Parallel activities within the same MCP
- **Hierarchical**: Actions at different levels of abstraction

The resonance observer helps you understand not just what MCPs are doing, but how they harmonize into something greater than the sum of their parts."""
        }
    ]


@mcp.prompt("moment_recording")
def moment_recording_template(
    source_mcp: str = "creative",
    event_type: str = "meditation",
    key_concepts: Optional[str] = None,
    context_description: Optional[str] = None
) -> list[dict]:
    """
    Template for effectively recording ecosystem moments.

    Args:
        source_mcp: Which MCP this moment comes from
        event_type: Type of event (meditation, insight, critique, weave, observation)
        key_concepts: Comma-separated list of key concepts
        context_description: Additional context about this moment
    """
    base_content = f"""# Recording Ecosystem Moment

## Event Details
- **Source MCP**: {source_mcp}
- **Event Type**: {event_type}
- **Timestamp**: {time.time()}

## Key Concepts
{f"From your description: {key_concepts}" if key_concepts else "Identify 3-5 key concepts that capture the essence of this moment:"}

### Concept Selection Guidelines
- **Core Ideas**: What are the fundamental concepts being explored?
- **Emotional States**: What feelings or qualities are present?
- **Action Types**: What kind of process or transformation occurred?
- **Relationship Patterns**: How do different elements connect?

### Example Concepts by Event Type
- **Meditation**: emergence, consciousness, pattern, flow, transformation
- **Insight**: clarity, connection, understanding, revelation, synthesis
- **Critique**: tension, constraint, evaluation, refinement, challenge
- **Weave**: integration, harmony, combination, unity, emergence
- **Observation**: awareness, monitoring, detection, resonance, coherence

## Novelty & Relevance Assessment
Consider scoring these on a 0-1 scale:
- **Novelty**: How new or surprising is this moment? (0 = expected, 1 = breakthrough)
- **Relevance**: How important is this for the current ecosystem? (0 = minor, 1 = critical)

## Recording Command
Use the `record_ecosystem_moment` tool with these parameters:
```
source: "{source_mcp}"
type: "{event_type}"
concepts: [{', '.join([f'"{c.strip()}"' for c in key_concepts.split(',')] if key_concepts else ['"concept1"', '"concept2"', '"concept3"'])}]
novelty: 0.5  # adjust based on assessment
relevance: 0.5  # adjust based on assessment
```"""

    if context_description:
        base_content += f"""

## Additional Context
{context_description}

Use this context to refine your concept selection and scoring."""

    messages = [
        {
            "role": "user",
            "content": base_content
        }
    ]

    return messages


@mcp.prompt("pattern_interpretation")
def pattern_interpretation_template(
    pattern_summary: str = "recent resonance patterns",
    analysis_focus: str = "emergent themes",
    application_goal: Optional[str] = None
) -> list[dict]:
    """
    Template for interpreting detected resonance patterns.

    Args:
        pattern_summary: Summary of patterns from detect_emergent_patterns
        analysis_focus: What aspect to focus analysis on
        application_goal: How you plan to apply these insights
    """
    base_content = f"""# Interpreting Resonance Patterns

## Current Patterns: {pattern_summary}

## Analysis Framework: {analysis_focus}

### 1. Pattern Characteristics
- **Strength Assessment**: Which patterns are strongest (>60%) and why?
- **Frequency Analysis**: How often do key concepts appear across observations?
- **Emergence Timeline**: When did significant patterns first appear?
- **Interconnections**: How do different patterns relate to each other?

### 2. Resonance Dynamics
- **Coupling Analysis**: How are different MCPs connected through these patterns?
- **Harmonic Feedback**: Which patterns strengthen each other?
- **Coherence Level**: What does the overall system coherence indicate?
- **Dominant Concepts**: Which concepts are most influential right now?

### 3. System State Interpretation
- **Resonance Status**: Is the system in harmony? What evidence supports this?
- **Emergent Intentions**: What larger purposes seem to be emerging?
- **Stability vs. Change**: Is the system stable or in flux?

## Pattern Analysis Questions
- What themes consistently appear across different MCP interactions?
- How do patterns from different sources complement or contradict each other?
- Which patterns seem most likely to influence future developments?
- What underlying dynamics explain the observed resonance?

## Practical Implications
- **Synthesis Opportunities**: When might these patterns suggest combining elements?
- **Intervention Points**: Where could additional observations strengthen patterns?
- **Risk Indicators**: Are there patterns that suggest potential issues?
- **Growth Directions**: What do these patterns suggest for ecosystem evolution?

## Actionable Insights
Based on this pattern analysis, consider:
- **Next Observations**: What moments would provide the most valuable data?
- **MCP Coordination**: How might different MCPs work together more effectively?
- **Timing Decisions**: When is the optimal moment for synthesis or intervention?"""

    if application_goal:
        base_content += f"""

## Application Goal: {application_goal}

How do these patterns specifically support your goal? Consider:
- Which patterns are most relevant to your objective?
- What actions would amplify helpful patterns?
- How might you mitigate patterns that could hinder your goal?"""

    messages = [
        {
            "role": "user",
            "content": base_content
        }
    ]

    return messages


@mcp.prompt("synthesis_planning")
def synthesis_planning_template(
    current_state: str = "system resonance analysis",
    synthesis_goal: str = "amplify emergent patterns",
    available_resources: Optional[str] = None
) -> list[dict]:
    """
    Template for planning synthesis based on resonance patterns.

    Args:
        current_state: Current ecosystem state description
        synthesis_goal: What you want to achieve through synthesis
        available_resources: MCPs or tools available for synthesis
    """
    base_content = f"""# Synthesis Planning Guide

## Current Ecosystem State: {current_state}

## Synthesis Goal: {synthesis_goal}

## Synthesis Planning Framework

### 1. Resonance Assessment
- **Current Coherence**: What is the system's harmonic state?
- **Active Patterns**: Which patterns are strongest and most relevant?
- **Coupling Dynamics**: How are different elements currently connected?
- **Emergent Intentions**: What does the system seem to want to create?

### 2. Synthesis Strategy
- **Amplification Approach**: How to strengthen helpful patterns?
- **Integration Method**: How to combine different elements effectively?
- **Timing Optimization**: When is the optimal moment for action?
- **Risk Mitigation**: How to avoid disrupting current resonance?

### 3. Action Planning
- **Immediate Steps**: What to do in the next few interactions?
- **Resource Allocation**: Which MCPs or tools to prioritize?
- **Progress Monitoring**: How to track synthesis effectiveness?
- **Contingency Plans**: What if resonance changes unexpectedly?

## Recommended Synthesis Actions

### Based on Resonance State:
- **High Coherence (>0.7)**: Ready for complex synthesis, combine multiple elements
- **Moderate Coherence (0.4-0.7)**: Focus on strengthening key patterns
- **Low Coherence (<0.4)**: Build foundation through more observations

### By Pattern Type:
- **Sequential Patterns**: Follow the natural flow of interactions
- **Feedback Patterns**: Amplify the reinforcing loops
- **Lateral Patterns**: Explore parallel developments
- **Hierarchical Patterns**: Connect different levels of abstraction

## Synthesis Techniques

### Creative Synthesis
- **Meditation + Insight**: Use creative meditation to explore pattern implications
- **Consult Integration**: Get alternative perspectives on pattern meanings
- **Weaving Sessions**: Combine insights from multiple pattern sources

### Resonance-Guided Synthesis
- **Harmonic Timing**: Act when system shows resonance indicators
- **Pattern Amplification**: Focus on strengthening coherent patterns
- **Coupling Optimization**: Enhance beneficial connections between MCPs

### Practical Implementation
1. **Check Current State**: Use `observe_ecosystem_state` for latest data
2. **Get Suggestions**: Use `suggest_next_synthesis` for specific recommendations
3. **Record Actions**: Document each synthesis step as a new moment
4. **Monitor Results**: Track how synthesis affects resonance patterns"""

    if available_resources:
        base_content += f"""

## Available Resources: {available_resources}

Consider how to best utilize these resources in your synthesis:
- Which resources would amplify current patterns?
- How can resources be combined for maximum effect?
- Are there resource gaps that need to be addressed?"""

    base_content += """

## Success Metrics
- **Pattern Strengthening**: Do key patterns grow stronger?
- **Coherence Increase**: Does overall system harmony improve?
- **Emergent Value**: Does synthesis create something greater than the parts?
- **Sustainable Resonance**: Does the synthesis maintain or improve system stability?

## Next Steps
1. Review current resonance state
2. Identify the most promising synthesis opportunities
3. Plan specific actions based on available resources
4. Begin implementation while continuing observation
5. Adjust approach based on how resonance responds"""

    messages = [
        {
            "role": "user",
            "content": base_content
        }
    ]

    return messages


if __name__ == "__main__":
    mcp.run()
