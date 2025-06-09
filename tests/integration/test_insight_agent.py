from src.config import TEAM_MEMBERS
from src.graph import build_graph


def test_insight_agent_registered():
    """Ensure the insight analyst is registered in the workflow graph."""
    assert "insight_analyst" in TEAM_MEMBERS
    graph = build_graph()
    assert "insight_analyst" in graph.get_graph().nodes
