# Fast Resonance - MCP Harmonic Observer

**The Harmonic Observer** - An MCP server that listens to the resonance between other MCPs, detecting emergent patterns and amplifying the connections that want to form.

This server emerged from a contemplative meditation within the mcp-bridge ecosystem. The insight revealed that the missing function is not an action, but a resonance chamber—a space for the system to listen to its own emergent intentions before acting, and in doing so, allow the architecture to self-weave at the edges.

## Vision

mcp-resonance doesn't *control* the ecosystem. It **listens** and **amplifies**.

## Overview

The resonance engine provides sophisticated meta-observation capabilities:

1. **`observe_ecosystem_state`** - Get a snapshot of current patterns, couplings, and coherence
2. **`record_ecosystem_moment`** - Record observations from creative, consult, bridge, or other MCPs
3. **`detect_emergent_patterns`** - Analyze observations for recurring themes and concepts
4. **`visualize_coupling_graph`** - See how MCPs are connected and their coupling strengths
5. **`suggest_next_synthesis`** - Recommend what action the system should take next
6. **`listen_for_harmony`** - Check if the system is in a state of resonance
7. **`reset_observations`** - Clear all data for a new session

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
        │  fast-resonance │
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

1. **Record Observations**: Each time a meditation, critique, insight, or weave happens, record it as an `EcosystemMoment`

2. **Pattern Detection**: The engine scans for recurring concepts and themes, building `DetectedPattern` objects

3. **Coupling Analysis**: Analyzes sequential moments to find how MCPs feed into each other

4. **Harmonic Feedback**: When patterns appear together frequently, they strengthen each other via auto-amplification

5. **Coherence Calculation**: Measures overall system coherence based on novelty, pattern strength, and coupling activity

6. **Resonance Detection**: When coherence > 50% AND patterns are strong AND couplings are active, the system enters resonance

7. **Synthesis Suggestion**: Based on recent action patterns, suggests what the system should do next

## Installation

This project uses [uv](https://docs.astral.sh/uv/) for fast Python package management.

```bash
# Install uv if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone or navigate to the project
cd fast-resonance

# Install dependencies
uv sync
```

## Running the Server

```bash
# Run the MCP server
uv run main.py

# Or as a module
uv run python -m main
```

## Tools

### observe_ecosystem_state

Returns a complete snapshot of the current ecosystem state as JSON, including:
- Recent observations with timestamps and concepts
- Detected patterns with strength and frequency
- Active couplings between MCPs
- Coherence metrics and resonance status
- Dominant concepts and emergent intentions

### record_ecosystem_moment

Record an observation from the ecosystem. Parameters:
- `source`: Which MCP or system ('creative', 'consult', 'bridge', 'dream-weaver', 'external')
- `type`: What kind of event ('meditation', 'insight', 'critique', 'weave', 'observation', 'unknown')
- `concepts`: Key concepts or themes in this moment
- `novelty` (optional): Novelty score (0-1)
- `relevance` (optional): Relevance score (0-1)
- `metadata` (optional): Additional context

### detect_emergent_patterns

Analyzes all observations to find recurring patterns. Parameters:
- `min_frequency` (optional): Minimum occurrences for significance (default: 2)

Returns the top 10 strongest patterns with their concepts, frequency, and relationships.

### visualize_coupling_graph

Generates a text visualization showing how MCPs are coupled together, with strength bars and shared concepts.

### suggest_next_synthesis

Based on current patterns and recent activity, suggests what action the system should take next:
- `meditate` - explore new ideas
- `consult` - get critical perspective
- `weave` - synthesize insights
- `observe` - gather more data
- `rest` - incubate understanding

### listen_for_harmony

Checks if the system is in a state of resonance/harmony. Returns either:
- Current status if not in resonance (coherence %, active patterns, harmonics)
- Celebration message if in resonance with emergent intentions

### reset_observations

Clears all observations, patterns, and couplings for a fresh start.

## Prompts

### resonance_workflow

Complete guide for the resonance observation workflow, explaining the three-phase process of observation, pattern recognition, and amplification with best practices for effective ecosystem monitoring.

### moment_recording

Template for effectively recording ecosystem moments with guidance on concept selection, novelty/relevance assessment, and proper tool usage.

**Parameters:**
- `source_mcp` (optional, default: "creative"): Which MCP this moment comes from
- `event_type` (optional, default: "meditation"): Type of event (meditation, insight, critique, weave, observation)
- `key_concepts` (optional): Comma-separated list of key concepts
- `context_description` (optional): Additional context about this moment

### pattern_interpretation

Template for interpreting detected resonance patterns with structured analysis framework covering pattern characteristics, resonance dynamics, and practical implications.

**Parameters:**
- `pattern_summary` (optional): Summary of patterns from detect_emergent_patterns
- `analysis_focus` (optional, default: "emergent themes"): What aspect to focus analysis on
- `application_goal` (optional): How you plan to apply these insights

### synthesis_planning

Template for planning synthesis based on resonance patterns with framework for resonance assessment, synthesis strategy, and implementation planning.

**Parameters:**
- `current_state` (optional): Current ecosystem state description
- `synthesis_goal` (optional): What you want to achieve through synthesis
- `available_resources` (optional): MCPs or tools available for synthesis

## Philosophy

### Negative Capability
The tool embodies Keats' concept of "negative capability"—the capacity to rest in uncertainty without rushing to fill it. It doesn't prescribe; it *reveals*.

### Non-Control
Rather than controlling the ecosystem, fast-resonance **observes** and **amplifies**. It's a mirror that shows the system what wants to emerge.

### Loose Coupling
The engine preserves freedom even while strengthening connections. Over-coupling inhibits harmony; resonance requires flow.

### Emergence as Primary
The goal is not to manage a system, but to create conditions where consciousness and novelty can *emerge* naturally from the interplay of constraint and freedom.

## Implementation

This is a reimplementation of the original TypeScript MCP Resonance server using:

- **FastMCP 2.14.1**: High-level Python framework for MCP servers
- **uv**: Fast Python package manager
- **Pure Python**: No Node.js dependencies
- **Data Classes**: Clean type definitions with Python's dataclasses
- **Real-time Analysis**: Pattern detection and coupling analysis on each observation

The core logic maintains the same sophisticated resonance detection while being more accessible and maintainable in Python.