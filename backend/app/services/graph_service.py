from typing import Dict, List, Optional, Set, Tuple
from app.models.course import ConceptGraphEdge, ConceptGraphNode, DifficultyLevel


class GraphCycleError(ValueError):
    """Raised when a proposed prerequisite relationship introduces a cycle."""
    def __init__(self, cycle_path: List[str]):
        self.cycle_path = cycle_path
        path_str = " -> ".join(cycle_path)
        super().__init__(f"Circular prerequisite relationship detected: {path_str}")


def detect_cycle_in_graph(adj_list: Dict[str, List[str]]) -> Optional[List[str]]:
    """Detects if a directed graph contains a cycle using 3-color DFS.

    Returns the cycle path as a list of IDs if found, or None if acyclic (DAG).
    adj_list maps node -> list of its prerequisites (upstream dependencies)
    OR node -> list of nodes that depend on it.
    Here: concept -> list of its prerequisite_concept_ids (i.e. to do C, must first do P).
    """
    # 0 = unvisited (white), 1 = visiting/in recursion stack (gray), 2 = visited (black)
    visited: Dict[str, int] = {node: 0 for node in adj_list}
    parent: Dict[str, Optional[str]] = {node: None for node in adj_list}

    def dfs(curr: str, stack_path: List[str]) -> Optional[List[str]]:
        visited[curr] = 1
        stack_path.append(curr)

        for neighbor in adj_list.get(curr, []):
            if neighbor not in visited:
                continue

            if visited[neighbor] == 1:
                # Cycle found! Extract cycle path from neighbor back to curr
                cycle_start_idx = stack_path.index(neighbor)
                cycle_path = stack_path[cycle_start_idx:] + [neighbor]
                return cycle_path

            if visited[neighbor] == 0:
                parent[neighbor] = curr
                found_cycle = dfs(neighbor, stack_path)
                if found_cycle:
                    return found_cycle

        visited[curr] = 2
        stack_path.pop()
        return None

    for node in adj_list:
        if visited[node] == 0:
            cycle = dfs(node, [])
            if cycle:
                return cycle

    return None


def validate_dag(
    existing_concepts: List[dict],
    concept_id_under_test: Optional[str],
    proposed_prereqs: List[str]
) -> None:
    """Validates that adding or updating a concept with proposed_prereqs will not

    introduce a circular dependency.
    """
    # Self-prerequisite check
    if concept_id_under_test and concept_id_under_test in proposed_prereqs:
        raise GraphCycleError([concept_id_under_test, concept_id_under_test])

    # Build adjacency list: node -> prerequisites
    adj_list: Dict[str, List[str]] = {}
    for c in existing_concepts:
        cid = str(c["_id"])
        if cid == concept_id_under_test:
            adj_list[cid] = proposed_prereqs
        else:
            adj_list[cid] = [str(p) for p in c.get("prerequisite_concept_ids", [])]

    # If new concept not in existing_concepts yet
    test_id = concept_id_under_test or "__NEW_CONCEPT__"
    if test_id not in adj_list:
        adj_list[test_id] = proposed_prereqs

    cycle = detect_cycle_in_graph(adj_list)
    if cycle:
        raise GraphCycleError(cycle)


def build_concept_dag_layout(
    concepts: List[dict]
) -> Tuple[List[ConceptGraphNode], List[ConceptGraphEdge]]:
    """Computes topological depth tiers (tier_level) and directed edges for React visualization.

    tier_level 0 = foundational concepts (zero prerequisites).
    tier_level k = max(prerequisite tiers) + 1.
    """
    concept_map = {str(c["_id"]): c for c in concepts}
    tier_levels: Dict[str, int] = {}

    def get_tier(cid: str, visited_in_path: Set[str]) -> int:
        if cid in tier_levels:
            return tier_levels[cid]
        if cid not in concept_map:
            return 0
        if cid in visited_in_path:
            return 0  # Fallback guard against cycle in data

        visited_in_path.add(cid)
        c = concept_map[cid]
        prereqs = [str(p) for p in c.get("prerequisite_concept_ids", []) if str(p) in concept_map]

        if not prereqs:
            level = 0
        else:
            level = max(get_tier(p, visited_in_path) for p in prereqs) + 1

        visited_in_path.remove(cid)
        tier_levels[cid] = level
        return level

    for cid in concept_map:
        get_tier(cid, set())

    nodes: List[ConceptGraphNode] = []
    edges: List[ConceptGraphEdge] = []

    for c in concepts:
        cid = str(c["_id"])
        prereqs = [str(p) for p in c.get("prerequisite_concept_ids", []) if str(p) in concept_map]

        diff_str = c.get("difficulty", "beginner")
        diff_enum = DifficultyLevel(diff_str) if diff_str in [d.value for d in DifficultyLevel] else DifficultyLevel.BEGINNER

        nodes.append(
            ConceptGraphNode(
                id=cid,
                title=c.get("title", ""),
                description=c.get("description", ""),
                difficulty=diff_enum,
                tier_level=tier_levels.get(cid, 0),
                prerequisites=prereqs,
                learning_objectives=c.get("learning_objectives", []),
                estimated_minutes=c.get("estimated_minutes", 30)
            )
        )

        for p in prereqs:
            edges.append(ConceptGraphEdge(source=p, target=cid))

    # Sort nodes by tier_level, then order_index
    nodes.sort(key=lambda n: (n.tier_level, concept_map.get(n.id, {}).get("order_index", 0)))

    return nodes, edges
