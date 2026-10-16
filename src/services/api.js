/**
 * Central Typed API Client for AdaptIQ
 * Connects to FastAPI backend and handles authentication, fallback data, and diagnostics.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

let currentRole = localStorage.getItem('adaptiq_role') || 'student';

export const setStoredRole = (role) => {
  currentRole = role;
  localStorage.setItem('adaptiq_role', role);
};

export const getStoredRole = () => currentRole;

export const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer dev-${currentRole}`
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      // Ignore JSON parse errors on raw failures
    }
    const error = new Error(errorDetail);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

export const api = {
  baseUrl: API_BASE_URL,

  // 1. Health Diagnostics
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch (err) {
      return {
        status: 'disconnected',
        service: 'PS-2 Adaptive Learning and Assessment Portal Backend',
        database: { status: 'unreachable', message: err.message }
      };
    }
  },

  // 2. Auth & User Profile
  getCurrentUser: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(res);
    } catch (err) {
      // Fallback profile matching active session role
      return {
        id: `usr_${currentRole}`,
        firebase_uid: `dev_user_${currentRole}`,
        email: `${currentRole}@adaptiq.io`,
        display_name: `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} User`,
        role: currentRole,
        skills: ["Python", "Algorithms", "FastAPI"],
        is_fallback: true
      };
    }
  },

  syncProfile: async (profileData) => {
    const res = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  // 3. Courses
  listCourses: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`);
      const data = await handleResponse(res);
      return { data, isLive: true };
    } catch (err) {
      console.warn("Backend /courses offline; loading curriculum catalogue:", err.message);
      return { data: DEFAULT_COURSES, isLive: false, error: err.message };
    }
  },

  getCourse: async (courseId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      return await handleResponse(res);
    } catch (err) {
      const found = DEFAULT_COURSES.find(c => c.id === courseId);
      if (found) return found;
      throw err;
    }
  },

  createCourse: async (courseData) => {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData)
    });
    return handleResponse(res);
  },

  updateCourse: async (courseId, courseData) => {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData)
    });
    return handleResponse(res);
  },

  // 4. Concepts & Prerequisite Concept Map DAG
  getCourseConcepts: async (courseId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${courseId}/concepts`);
      const data = await handleResponse(res);
      return { data, isLive: true };
    } catch (err) {
      console.warn("Backend /concepts offline; loading course DAG preview:", err.message);
      const demo = DEFAULT_DAGS[courseId] || DEFAULT_DAGS["course-1"];
      return { data: demo, isLive: false, error: err.message };
    }
  },

  addConcept: async (courseId, conceptData) => {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/concepts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(conceptData)
    });
    return handleResponse(res);
  },

  updateConcept: async (conceptId, conceptData) => {
    const res = await fetch(`${API_BASE_URL}/concepts/${conceptId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(conceptData)
    });
    return handleResponse(res);
  },

  deleteConcept: async (conceptId) => {
    const res = await fetch(`${API_BASE_URL}/concepts/${conceptId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // 5. Adaptive Learning Path (Phase 3 Integration)
  getAdaptivePath: async (courseId) => {
    // Contract definition for future adaptive engine endpoint
    return {
      courseId,
      currentMastery: 68,
      recommendedActivity: {
        conceptId: "c-graphs-dfs",
        title: "Graph Traversal & Cycle Detection",
        reason: "Prerequisite for Topological Sort; you scored 45% on DFS recursions last week.",
        type: "practice_challenge",
        estimatedMinutes: 25,
        difficulty: "intermediate"
      },
      progressionTree: [
        { id: "c-arrays", title: "Arrays & Memory Addresses", status: "mastered", score: 95 },
        { id: "c-pointers", title: "Pointers & References", status: "mastered", score: 90 },
        { id: "c-linked-lists", title: "Linked Nodes & Sentinel Lists", status: "mastered", score: 85 },
        { id: "c-stacks", title: "Stacks & Monotonic Queues", status: "in-progress", score: 62 },
        { id: "c-trees-bst", title: "Binary Search Trees", status: "weak", score: 48 },
        { id: "c-graphs-dfs", title: "Graph Traversal & Cycle Detection", status: "recommended", score: null },
        { id: "c-topo-sort", title: "DAG Topological Sort (Kahn's)", status: "locked", score: null }
      ]
    };
  },

  // 6. Assessments & Quizzes
  getAssessments: async (courseId) => {
    return [
      {
        id: "quiz-dsa-1",
        title: "Prerequisite Quiz: Pointers & References",
        courseId,
        questionsCount: 5,
        timeLimitMinutes: 15,
        status: "evaluated",
        score: 90,
        difficulty: "beginner"
      },
      {
        id: "quiz-dsa-2",
        title: "Mid-Term Diagnostic: Trees & Recursive BSTs",
        courseId,
        questionsCount: 6,
        timeLimitMinutes: 20,
        status: "available",
        score: null,
        difficulty: "intermediate"
      },
      {
        id: "quiz-dsa-3",
        title: "Advanced Mastery: DAGs & Topological Sorting",
        courseId,
        questionsCount: 8,
        timeLimitMinutes: 25,
        status: "locked",
        score: null,
        difficulty: "advanced"
      }
    ];
  },

  getAssessmentDetails: async (assessmentId) => {
    return {
      id: assessmentId,
      title: "Mid-Term Diagnostic: Trees & Recursive BSTs",
      timeLimitMinutes: 20,
      questions: [
        {
          id: "q1",
          question: "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          conceptId: "c-trees-bst"
        },
        {
          id: "q2",
          question: "Which tree traversal order visits nodes in ascending key order for a valid BST?",
          options: ["Pre-order (Root-Left-Right)", "In-order (Left-Root-Right)", "Post-order (Left-Right-Root)", "Level-order (BFS)"],
          conceptId: "c-trees-bst"
        },
        {
          id: "q3",
          question: "In 3-color DFS cycle detection on a directed graph, what does visiting a GRAY node indicate?",
          options: [
            "The node has no outgoing edges",
            "A back-edge has been discovered (circular prerequisite cycle detected)",
            "The node has already finished processing all descendants",
            "The node is disconnected from the root"
          ],
          conceptId: "c-graphs-dfs"
        },
        {
          id: "q4",
          question: "What is the in-degree of a foundational prerequisite concept in a DAG?",
          options: ["0 (Zero inbound prerequisites)", "1", "Equal to total nodes - 1", "Infinite"],
          conceptId: "c-topo-sort"
        }
      ]
    };
  },

  // 7. Coding Challenges & Sandbox Execution
  getCodingChallenges: async (courseId) => {
    return [
      {
        id: "code-dag-cycle",
        title: "Detect Cycle in Prerequisite Graph",
        courseId,
        difficulty: "intermediate",
        language: "python",
        concept: "DAG Cycle Detection",
        starterCode: `def has_cycle(num_courses, prerequisites):\n    \"\"\"\n    Determine if all courses can be finished without circular prerequisites.\n    prerequisites: list of [course, prereq]\n    return: bool (True if cycle exists, False if acyclic)\n    \"\"\"\n    # Write your solution here\n    pass\n`,
        description: `There are a total of num_courses you have to take, labeled from 0 to num_courses - 1. You are given an array prerequisites where prerequisites[i] = [a_i, b_i] indicates that you must take course b_i first if you want to take course a_i.\n\nReturn True if a circular prerequisite cycle exists that prevents completing the courses, or False if a valid topological order exists.`,
        constraints: ["1 <= num_courses <= 2000", "0 <= prerequisites.length <= 5000", "All pairs [a, b] are unique"],
        sampleTestCases: [
          { input: "num_courses = 2, prerequisites = [[1, 0]]", expected: "False", explanation: "Course 0 can be taken first, followed by course 1." },
          { input: "num_courses = 2, prerequisites = [[1, 0], [0, 1]]", expected: "True", explanation: "Course 0 requires course 1, and course 1 requires course 0 (Cycle!)." }
        ],
        hiddenTestsCount: 12
      },
      {
        id: "code-bst-validate",
        title: "Validate Binary Search Tree",
        courseId,
        difficulty: "medium",
        language: "python",
        concept: "Tree Traversals",
        starterCode: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef is_valid_bst(root):\n    # Return True if the binary tree satisfies the BST invariant\n    pass\n`,
        description: `Given the root of a binary tree, determine if it is a valid Binary Search Tree (BST).\n\nA valid BST is defined as:\n- The left subtree contains only nodes with keys strictly less than the node's key.\n- The right subtree contains only nodes with keys strictly greater than the node's key.\n- Both left and right subtrees must also be valid BSTs.`,
        constraints: ["Node count in tree is in [1, 10^4]", "-2^31 <= Node.val <= 2^31 - 1"],
        sampleTestCases: [
          { input: "root = [2, 1, 3]", expected: "True" },
          { input: "root = [5, 1, 4, null, null, 3, 6]", expected: "False", explanation: "Root value is 5, but its right child has value 4." }
        ],
        hiddenTestsCount: 15
      }
    ];
  },

  // 8. Evaluator Review Queue & Telemetry
  getEvaluatorQueue: async () => {
    return [
      {
        id: "sub-101",
        studentName: "Alex Rivera",
        studentEmail: "alex.r@student.edu",
        challengeTitle: "Detect Cycle in Prerequisite Graph",
        submittedAt: "10 mins ago",
        status: "pending_review",
        testsPassed: "12 / 12",
        executionTimeMs: 42,
        integritySignals: [
          { type: "paste_frequency", label: "Single Large Paste Event", severity: "medium", detail: "45 lines inserted in 300ms at T+01:24" },
          { type: "tab_switch", label: "2 Window Blur Events", severity: "low", detail: "Switched focus to external window for 14s total" }
        ],
        code: `def has_cycle(num_courses, prerequisites):\n    from collections import defaultdict, deque\n    adj = defaultdict(list)\n    in_degree = [0] * num_courses\n    for u, v in prerequisites:\n        adj[v].append(u)\n        in_degree[u] += 1\n    q = deque([i for i in range(num_courses) if in_degree[i] == 0])\n    visited = 0\n    while q:\n        curr = q.popleft()\n        visited += 1\n        for nbr in adj[curr]:\n            in_degree[nbr] -= 1\n            if in_degree[nbr] == 0:\n                q.append(nbr)\n    return visited != num_courses`
      },
      {
        id: "sub-102",
        studentName: "Priya Sharma",
        studentEmail: "priya.s@student.edu",
        challengeTitle: "Validate Binary Search Tree",
        submittedAt: "35 mins ago",
        status: "verified",
        testsPassed: "15 / 15",
        executionTimeMs: 28,
        integritySignals: [
          { type: "natural_typing", label: "Normal Keystroke Cadence", severity: "info", detail: "Steady cadence across 18 minutes; 0 anomalous pastes" }
        ],
        code: `def is_valid_bst(root):\n    def validate(node, low, high):\n        if not node:\n            return True\n        if not (low < node.val < high):\n            return False\n        return validate(node.left, low, node.val) and validate(node.right, node.val, high)\n    return validate(root, float('-inf'), float('inf'))`
      }
    ];
  }
};

// Fallback Default Courses
const DEFAULT_COURSES = [
  {
    id: "course-1",
    title: "Data Structures & Algorithmic Problem Solving",
    description: "Build robust foundational understanding from memory allocations and pointers to recursive trees, dynamic programming, and DAG cycle detection.",
    tags: ["Algorithms", "Data Structures", "Python"],
    concept_count: 6,
    creator_email: "trainer@adaptiq.io",
    is_published: true
  },
  {
    id: "course-2",
    title: "Enterprise Backend Architecture with FastAPI & MongoDB",
    description: "Design reactive, asynchronous microservice architectures with Motor MongoDB Atlas, Firebase ID token verification, and RBAC authorization.",
    tags: ["FastAPI", "MongoDB Atlas", "Python", "Security"],
    concept_count: 5,
    creator_email: "trainer@adaptiq.io",
    is_published: true
  },
  {
    id: "course-3",
    title: "Adaptive Learning Systems & Integrity Analytics",
    description: "Develop proctored assessment engines, replayable editor event streams, and explainable integrity telemetry for online evaluations.",
    tags: ["EdTech", "Analytics", "Proctoring"],
    concept_count: 4,
    creator_email: "trainer@adaptiq.io",
    is_published: true
  }
];

// Fallback Default DAGs
const DEFAULT_DAGS = {
  "course-1": {
    course_id: "course-1",
    course_title: "Data Structures & Algorithmic Problem Solving",
    total_concepts: 6,
    nodes: [
      {
        id: "c-arrays",
        title: "Memory Addressing & Arrays",
        description: "Contiguous memory layout, cache locality, and pointer indexing.",
        difficulty: "beginner",
        tier_level: 0,
        status: "mastered",
        prerequisites: [],
        learning_objectives: ["Calculate memory offsets", "Contrast stack vs heap allocation"],
        estimated_minutes: 25
      },
      {
        id: "c-pointers",
        title: "Pointers & References",
        description: "Memory dereferencing, reference passing, and sentinel bounds.",
        difficulty: "beginner",
        tier_level: 0,
        status: "mastered",
        prerequisites: [],
        learning_objectives: ["Inspect memory addresses", "Avoid null pointer dereferences"],
        estimated_minutes: 30
      },
      {
        id: "c-linked-lists",
        title: "Linked Nodes & Sentinel Lists",
        description: "Dynamic non-contiguous node chains and O(1) pointer updates.",
        difficulty: "beginner",
        tier_level: 1,
        status: "mastered",
        prerequisites: ["c-arrays", "c-pointers"],
        learning_objectives: ["Implement singly linked lists", "Detect reference cycles"],
        estimated_minutes: 35
      },
      {
        id: "c-stacks",
        title: "Stacks & Monotonic Queues",
        description: "Call-stack recursion semantics and monotonic stack patterns.",
        difficulty: "intermediate",
        tier_level: 2,
        status: "in-progress",
        prerequisites: ["c-linked-lists"],
        learning_objectives: ["Solve next greater element in O(n)", "Simulate call stacks"],
        estimated_minutes: 40
      },
      {
        id: "c-trees-bst",
        title: "Binary Search Trees",
        description: "Hierarchical subtrees, left/right ordering invariants, and recursive traversal.",
        difficulty: "intermediate",
        tier_level: 2,
        status: "weak",
        prerequisites: ["c-linked-lists"],
        learning_objectives: ["Validate BST properties", "Execute recursive DFS traversals"],
        estimated_minutes: 45
      },
      {
        id: "c-graphs-dfs",
        title: "DAG Cycle Detection & Topological Sort",
        description: "Adjacency lists, 3-color DFS cycle validation, and Kahn's topological sort.",
        difficulty: "advanced",
        tier_level: 3,
        status: "locked",
        prerequisites: ["c-stacks", "c-trees-bst"],
        learning_objectives: ["Identify prerequisite cycle back-edges", "Compute dependency tiers"],
        estimated_minutes: 55
      }
    ],
    edges: [
      { source: "c-arrays", target: "c-linked-lists" },
      { source: "c-pointers", target: "c-linked-lists" },
      { source: "c-linked-lists", target: "c-stacks" },
      { source: "c-linked-lists", target: "c-trees-bst" },
      { source: "c-stacks", target: "c-graphs-dfs" },
      { source: "c-trees-bst", target: "c-graphs-dfs" }
    ]
  }
};
