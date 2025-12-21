#!/usr/bin/env python3
"""
Test script for the Fast Resonance MCP server logic
"""
import time
import json
from main import ResonanceEngine, EcosystemMoment

def test_resonance_engine():
    """Test the core resonance engine logic."""
    print("Testing Fast Resonance core logic...")

    # Initialize engine
    engine = ResonanceEngine()

    # Test recording observations
    print("\n--- Recording observations ---")
    obs1 = EcosystemMoment(
        id="test-1",
        timestamp=time.time(),
        source="creative",
        type="meditation",
        concepts=["emergence", "flow", "synthesis"],
        novelty=0.8
    )
    engine.add_observation(obs1)
    print(f"Recorded: {obs1.source} - {obs1.concepts}")

    obs2 = EcosystemMoment(
        id="test-2",
        timestamp=time.time() + 1,
        source="consult",
        type="critique",
        concepts=["flow", "structure", "balance"],
        novelty=0.6
    )
    engine.add_observation(obs2)
    print(f"Recorded: {obs2.source} - {obs2.concepts}")

    obs3 = EcosystemMoment(
        id="test-3",
        timestamp=time.time() + 2,
        source="creative",
        type="insight",
        concepts=["emergence", "balance", "harmony"],
        novelty=0.9
    )
    engine.add_observation(obs3)
    print(f"Recorded: {obs3.source} - {obs3.concepts}")

    # Test pattern detection
    print("\n--- Pattern Detection ---")
    state = engine.get_ecosystem_state()
    print(f"Detected {len(state.patterns)} patterns")
    for pattern in state.patterns:
        print(f"  - {pattern.name}: {pattern.concepts} (strength: {pattern.strength:.2f})")

    # Test coupling analysis
    print("\n--- Coupling Analysis ---")
    print(f"Detected {len(state.couplings)} couplings")
    for coupling in state.couplings:
        print(f"  - {coupling.source_id} -> {coupling.target_id} (strength: {coupling.strength:.2f})")

    # Test coherence and resonance
    print("\n--- Coherence & Resonance ---")
    print(f"Total coherence: {state.total_coherence:.2f}")
    print(f"Is resonant: {state.is_resonant}")
    print(f"Dominant concepts: {state.dominant_concepts}")
    print(f"Emergent intentions: {state.emergent_intentions}")

    # Test synthesis suggestion
    print("\n--- Synthesis Suggestion ---")
    suggestion = engine.suggest_next_synthesis()
    if suggestion:
        print(f"Suggested action: {suggestion.suggested_action}")
        print(f"Reason: {suggestion.reason}")
        print(f"Confidence: {suggestion.confidence:.2f}")
    else:
        print("No suggestion available yet")

    # Test coupling visualization
    print("\n--- Coupling Visualization ---")
    viz = engine.visualize_coupling()
    print(viz)

    print("\nCore logic tests completed successfully!")

if __name__ == "__main__":
    test_resonance_engine()