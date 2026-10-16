import { 
  StudentProfile, 
  Topic, 
  Course, 
  Assessment, 
  CodingChallenge, 
  CodeExplanationSubmission,
  CohortStudent 
} from '../types';

export const mockStudent: StudentProfile = {
  id: 'std-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@cs.university.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  cohort: 'Alpha Fall 2026 — CS Track',
  overallMastery: 74,
  streakDays: 14,
  assessmentsCompleted: 18,
  codingChallengesCompleted: 12,
  rank: 8,
  weakTopicsCount: 3,
};

export const mockTopics: Topic[] = [
  {
    id: 'top-1',
    name: 'Dynamic Programming & Memoization',
    category: 'Algorithms',
    proficiencyScore: 42,
    status: 'critical',
    recommendedDifficulty: 'easy',
    questionsAttempted: 24,
    correctAnswers: 10,
    lastAssessed: 'Yesterday at 3:15 PM',
    remedialRecommended: 'Foundational 1D DP & Top-Down Fibonacci recursion patterns',
  },
  {
    id: 'top-2',
    name: 'SQL Complex Joins & Subqueries',
    category: 'Databases',
    proficiencyScore: 48,
    status: 'weak',
    recommendedDifficulty: 'easy',
    questionsAttempted: 18,
    correctAnswers: 9,
    lastAssessed: '2 days ago',
    remedialRecommended: 'Interactive Visual Join breakdown & Inner vs Outer join nuances',
  },
  {
    id: 'top-3',
    name: 'Tree Traversal & BST Balancing',
    category: 'Data Structures',
    proficiencyScore: 56,
    status: 'weak',
    recommendedDifficulty: 'medium',
    questionsAttempted: 30,
    correctAnswers: 17,
    lastAssessed: '3 days ago',
    remedialRecommended: 'In-order traversal depth drills & AVL rotation simulations',
  },
  {
    id: 'top-4',
    name: 'Binary Search & Monotonic Conditions',
    category: 'Algorithms',
    proficiencyScore: 78,
    status: 'improving',
    recommendedDifficulty: 'medium',
    questionsAttempted: 22,
    correctAnswers: 17,
    lastAssessed: '4 days ago',
    remedialRecommended: 'Rotated sorted array boundary search drills',
  },
  {
    id: 'top-5',
    name: 'Hash Tables & Hash Maps',
    category: 'Data Structures',
    proficiencyScore: 92,
    status: 'mastered',
    recommendedDifficulty: 'hard',
    questionsAttempted: 40,
    correctAnswers: 37,
    lastAssessed: '5 days ago',
    remedialRecommended: 'Advanced LRU cache implementation and custom collision algorithms',
  },
  {
    id: 'top-6',
    name: 'Graph Traversal (BFS & DFS)',
    category: 'Algorithms',
    proficiencyScore: 84,
    status: 'mastered',
    recommendedDifficulty: 'hard',
    questionsAttempted: 35,
    correctAnswers: 30,
    lastAssessed: '1 week ago',
    remedialRecommended: 'Dijkstra shortest path and Topological Sort variations',
  },
];

export const mockCourses: Course[] = [
  {
    id: 'crs-1',
    title: 'Advanced Data Structures & Algorithms',
    description: 'Master core computational thinking, asymptotic complexity, graph modeling, and dynamic programming.',
    instructor: 'Dr. Sarah Chen',
    level: 'Advanced',
    totalModules: 12,
    completedModules: 9,
    progressPercent: 75,
    enrolledStudentsCount: 142,
    category: 'Computer Science',
    tags: ['Algorithms', 'Trees', 'DP', 'Complexity'],
    thumbnailGradient: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'crs-2',
    title: 'Full-Stack Web Engineering with React & Node',
    description: 'Build robust, responsive web applications with state synchronization, RESTful patterns, and clean architecture.',
    instructor: 'Prof. David Thorne',
    level: 'Intermediate',
    totalModules: 10,
    completedModules: 8,
    progressPercent: 80,
    enrolledStudentsCount: 210,
    category: 'Software Engineering',
    tags: ['React', 'TypeScript', 'Node.js', 'APIs'],
    thumbnailGradient: 'from-indigo-600 to-purple-700',
  },
  {
    id: 'crs-3',
    title: 'Modern Database Systems & Query Optimization',
    description: 'Relational query planning, indexing strategies, ACID guarantees, and distributed storage foundations.',
    instructor: 'Elena Rostova',
    level: 'Intermediate',
    totalModules: 8,
    completedModules: 3,
    progressPercent: 38,
    enrolledStudentsCount: 98,
    category: 'Data Engineering',
    tags: ['PostgreSQL', 'Indexes', 'Joins', 'Transactions'],
    thumbnailGradient: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'crs-4',
    title: 'Distributed System Design & Scalability',
    description: 'Deconstruct microservices, caching layers, load balancers, message queues, and high availability guarantees.',
    instructor: 'Marcus Vance',
    level: 'Advanced',
    totalModules: 14,
    completedModules: 4,
    progressPercent: 28,
    enrolledStudentsCount: 85,
    category: 'Architecture',
    tags: ['System Design', 'Redis', 'Kafka', 'Scalability'],
    thumbnailGradient: 'from-amber-500 to-orange-600',
  },
];

export const mockAssessments: Assessment[] = [
  {
    id: 'asmt-dp-adaptive',
    title: 'Adaptive Diagnostic: Dynamic Programming Foundations',
    topicId: 'top-1',
    topicName: 'Dynamic Programming & Memoization',
    difficulty: 'easy',
    estimatedMinutes: 15,
    questionsCount: 5,
    isAdaptive: true,
    questions: [
      {
        id: 'q-dp-1',
        topicId: 'top-1',
        topicName: 'Dynamic Programming',
        difficulty: 'easy',
        question: 'What are the two core prerequisites required for a problem to be solvable via Dynamic Programming?',
        options: [
          'Optimal substructure and overlapping subproblems',
          'Greedy choice property and divide-and-conquer base case',
          'Linear memory layout and hash collision resistance',
          'Constant time lookup and deterministic transition rules',
        ],
        correctAnswer: 0,
        explanation: 'Dynamic Programming relies primarily on optimal substructure (an optimal solution to the problem contains optimal solutions to subproblems) and overlapping subproblems (the same subproblems are solved repeatedly).',
        hint: 'Think about why recursion without caching recalculates the exact same states.',
      },
      {
        id: 'q-dp-2',
        topicId: 'top-1',
        topicName: 'Dynamic Programming',
        difficulty: 'easy',
        question: 'In top-down memoization, what is the primary role of the cache data structure (such as a dictionary or array)?',
        options: [
          'To permanently store code compilation artifacts',
          'To store the return value of subproblem inputs to avoid duplicate recursive calls',
          'To convert the recursive stack into an asynchronous event loop',
          'To automatically sort inputs before applying binary reduction',
        ],
        correctAnswer: 1,
        explanation: 'The memo cache stores computed results keyed by the function parameters, converting an exponential O(2^n) recursion into polynomial or linear O(n) execution.',
        hint: 'What happens the second time fibonacci(5) is invoked in a recursion tree?',
      },
      {
        id: 'q-dp-3',
        topicId: 'top-1',
        topicName: 'Dynamic Programming',
        difficulty: 'medium',
        question: 'Consider the Climbing Stairs problem (each step can be 1 or 2 stairs). Which recurrence relation defines the number of ways to reach step n?',
        codeSnippet: `// Step count recurrence
dp[n] = ?`,
        options: [
          'dp[n] = dp[n - 1] * dp[n - 2]',
          'dp[n] = dp[n - 1] + dp[n - 2]',
          'dp[n] = 2 * dp[n - 1] - 1',
          'dp[n] = max(dp[n - 1], dp[n - 2]) + 1',
        ],
        correctAnswer: 1,
        explanation: 'To reach step n, you must have come from either step (n-1) with a 1-step leap, or step (n-2) with a 2-step leap. Thus ways(n) = ways(n-1) + ways(n-2), identical to the Fibonacci sequence.',
        hint: 'Where could you stand immediately before taking your final jump to step n?',
      },
      {
        id: 'q-dp-4',
        topicId: 'top-1',
        topicName: 'Dynamic Programming',
        difficulty: 'medium',
        question: 'In the 0/1 Knapsack problem with items of weight w[i] and value v[i], if capacity C is smaller than w[i], what is the state transition?',
        codeSnippet: `if (capacity < weights[i]) {
  dp[i][capacity] = /* what goes here? */
}`,
        options: [
          'dp[i][capacity] = 0;',
          'dp[i][capacity] = dp[i - 1][capacity];',
          'dp[i][capacity] = dp[i][capacity - weights[i]] + values[i];',
          'dp[i][capacity] = dp[i - 1][capacity - 1];',
        ],
        correctAnswer: 1,
        explanation: 'If the current item i weighs more than the remaining capacity, you cannot include it. Therefore, the maximum value remains whatever was achievable using the previous (i-1) items with the same capacity.',
        hint: 'Can you pack an item if you have less weight allowance than the item weighs?',
      },
      {
        id: 'q-dp-5',
        topicId: 'top-1',
        topicName: 'Dynamic Programming',
        difficulty: 'hard',
        question: 'What is the space-optimized memory complexity for calculating the Longest Common Subsequence (LCS) of two strings of lengths M and N?',
        options: [
          'O(M * N) space is strictly necessary to reconstruct states',
          'O(min(M, N)) space by maintaining only two rows/columns of the DP table',
          'O(1) auxiliary space using pointer duality',
          'O(log(M + N)) space with divide-and-conquer hashing',
        ],
        correctAnswer: 1,
        explanation: 'Because cell dp[i][j] only relies on the current row and the immediately preceding row (dp[i-1][j], dp[i][j-1], dp[i-1][j-1]), we can alternate between 2 rows of size min(M, N), reducing auxiliary memory to O(min(M, N)).',
        hint: 'Look at the row indices referenced in the standard LCS transition matrix.',
      },
    ],
  },
  {
    id: 'asmt-sql-adaptive',
    title: 'Adaptive Diagnostic: Relational Joins & Set Operators',
    topicId: 'top-2',
    topicName: 'SQL Complex Joins & Subqueries',
    difficulty: 'easy',
    estimatedMinutes: 12,
    questionsCount: 4,
    isAdaptive: true,
    questions: [
      {
        id: 'q-sql-1',
        topicId: 'top-2',
        topicName: 'SQL & Databases',
        difficulty: 'easy',
        question: 'Which join type returns ALL records from the left table, and matching records from the right table (filling NULLs when no match exists)?',
        options: [
          'INNER JOIN',
          'LEFT OUTER JOIN',
          'CROSS JOIN',
          'NATURAL SEMI JOIN',
        ],
        correctAnswer: 1,
        explanation: 'LEFT JOIN (or LEFT OUTER JOIN) preserves all rows from the left table regardless of whether the join predicate satisfies rows in the right table.',
        hint: 'Focus on preserving the table written on the left side of the keyword.',
      },
      {
        id: 'q-sql-2',
        topicId: 'top-2',
        topicName: 'SQL & Databases',
        difficulty: 'medium',
        question: 'What is the logical execution order of clauses in a standard SQL query containing WHERE, HAVING, GROUP BY, and SELECT?',
        options: [
          'SELECT -> WHERE -> GROUP BY -> HAVING',
          'WHERE -> GROUP BY -> HAVING -> SELECT',
          'GROUP BY -> WHERE -> SELECT -> HAVING',
          'HAVING -> WHERE -> GROUP BY -> SELECT',
        ],
        correctAnswer: 1,
        explanation: 'SQL executes from row filtering (FROM/WHERE) first, then aggregation grouping (GROUP BY), aggregate filtering (HAVING), followed by projection (SELECT), and finally ordering/limits.',
        hint: 'Can you filter individual rows before they get bundled into groups?',
      },
      {
        id: 'q-sql-3',
        topicId: 'top-2',
        topicName: 'SQL & Databases',
        difficulty: 'medium',
        question: 'How does an EXISTS correlated subquery differ performance-wise from an IN (subquery) when checking large datasets?',
        options: [
          'EXISTS short-circuits upon encountering the first matching record without scanning all rows',
          'IN is always faster because the query optimizer stores everything in CPU registers',
          'There is zero mathematical or execution engine difference in all relational systems',
          'EXISTS requires an explicit index on table comments',
        ],
        correctAnswer: 0,
        explanation: 'EXISTS evaluates to true the instant any match is located, stopping further scanning for that outer row. IN may evaluate the full list of candidates unless heavily transformed by the optimizer.',
        hint: 'What does boolean short-circuit evaluation mean?',
      },
      {
        id: 'q-sql-4',
        topicId: 'top-2',
        topicName: 'SQL & Databases',
        difficulty: 'hard',
        question: 'When using window functions, what is the key behavioral difference between RANK() and DENSE_RANK() in case of ties?',
        options: [
          'RANK() skips following rank numbers after ties (e.g., 1, 2, 2, 4), while DENSE_RANK() does not skip (1, 2, 2, 3)',
          'DENSE_RANK() only works on integer primary keys',
          'RANK() resets row counts after each 100 rows',
          'DENSE_RANK() calculates standard deviation instead of positional order',
        ],
        correctAnswer: 0,
        explanation: 'RANK leaves gaps for tied values (e.g., two competitors tied for 2nd means the next rank is 4th). DENSE_RANK assigns consecutive numbers without gaps.',
        hint: 'Think of how medals are awarded in sports competitions when two players tie for silver.',
      },
    ],
  },
];

export const mockCodingChallenges: CodingChallenge[] = [
  {
    id: 'ch-1',
    title: 'Climbing Stairs: Minimum Cost & Path Optimization',
    topic: 'Dynamic Programming',
    difficulty: 'easy',
    timeLimitMinutes: 25,
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. Given step costs, compute the minimum cost to reach the top floor.',
    problemStatement: `You are given an integer array cost where cost[i] is the cost of the i-th step on a staircase. Once you pay the cost, you can either climb one or two steps.
You can either start from index 0, or index 1.
Return the minimum cost to reach the top of the floor (index cost.length).`,
    examples: [
      {
        input: 'cost = [10, 15, 20]',
        output: '15',
        explanation: 'Start at index 1, pay 15, then climb two steps to reach the top floor directly.',
      },
      {
        input: 'cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]',
        output: '6',
        explanation: 'Cheapest path: Start on cost[0], step over 100s to pay: 1 + 1 + 1 + 1 + 1 + 1 = 6.',
      },
    ],
    starterCode: `function minCostClimbingStairs(cost: number[]): number {
  const n = cost.length;
  // TODO: Implement your optimal O(n) dynamic programming solution here
  // Base case consideration: you can start at index 0 or index 1
  
  let prev2 = cost[0];
  let prev1 = cost[1];
  
  for (let i = 2; i < n; i++) {
    const current = cost[i] + Math.min(prev1, prev2);
    prev2 = prev1;
    prev1 = current;
  }
  
  return Math.min(prev1, prev2);
}`,
    testCases: [
      {
        id: 'tc-1',
        input: '[10, 15, 20]',
        expectedOutput: '15',
        description: 'Simple 3-step staircase',
      },
      {
        id: 'tc-2',
        input: '[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]',
        expectedOutput: '6',
        description: 'Alternating high penalties',
      },
      {
        id: 'tc-3',
        input: '[0, 0, 0, 1]',
        expectedOutput: '0',
        description: 'Free stairs with end toll',
      },
      {
        id: 'tc-4',
        input: '[2, 5]',
        expectedOutput: '2',
        description: 'Minimal two-step ladder',
        isSecret: true,
      },
    ],
    hints: [
      'Notice that the cost to reach step i depends exclusively on step (i-1) and step (i-2).',
      'You only need to track the last two step costs, meaning O(1) space is achievable!',
    ],
  },
  {
    id: 'ch-2',
    title: 'Search in Rotated Sorted Array',
    topic: 'Algorithms',
    difficulty: 'medium',
    timeLimitMinutes: 30,
    description: 'Find target value in an ascending sorted array that has been rotated at an unknown pivot index in O(log n) time.',
    problemStatement: `Given an integer array nums sorted in ascending order (with distinct values) and rotated at some pivot unknown to you beforehand, search for target. If found, return its index; otherwise return -1.
You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
        explanation: '0 is located at index 4.',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
        explanation: '3 is not present in the array.',
      },
    ],
    starterCode: `function searchRotated(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    // Check which half is sorted
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}`,
    testCases: [
      {
        id: 'tc-201',
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        expectedOutput: '4',
        description: 'Standard rotated array with target in right half',
      },
      {
        id: 'tc-202',
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        expectedOutput: '-1',
        description: 'Target missing in array',
      },
      {
        id: 'tc-203',
        input: 'nums = [1], target = 0',
        expectedOutput: '-1',
        description: 'Single element array mismatch',
      },
    ],
    hints: [
      'In any rotated sorted array, at least one half (left..mid or mid..right) is guaranteed to be strictly sorted.',
      'Check if target lies inside the boundaries of the sorted half!',
    ],
  },
];

export const mockSubmissions: CodeExplanationSubmission[] = [
  {
    id: 'sub-301',
    studentId: 'std-101',
    studentName: 'Alex Rivera',
    challengeId: 'ch-1',
    challengeTitle: 'Climbing Stairs: Minimum Cost & Path Optimization',
    language: 'TypeScript',
    submittedCode: `function minCostClimbingStairs(cost: number[]): number {
  const n = cost.length;
  let prev2 = cost[0];
  let prev1 = cost[1];
  
  for (let i = 2; i < n; i++) {
    const current = cost[i] + Math.min(prev1, prev2);
    prev2 = prev1;
    prev1 = current;
  }
  
  return Math.min(prev1, prev2);
}`,
    approachExplanation: 'I utilized a bottom-up dynamic programming approach with sliding state variables. Instead of allocating an O(n) array, I recognized that computing min cost to reach step i only requires the accumulated values of step (i-1) and step (i-2). By keeping prev1 and prev2 in CPU registers and rotating them across the iteration, auxiliary memory is optimized to O(1) while runtime remains strictly linear O(n).',
    timeComplexity: 'O(n) — single linear pass through the cost array from index 2 to n.',
    spaceComplexity: 'O(1) — constant space; only two scalar numeric variables maintained.',
    edgeCasesConsidered: 'Handled minimal constraint case where n = 2 directly via final Math.min comparison without loop trigger. Handled cases where costs are 0.',
    submittedAt: 'Today at 2:18 PM',
    status: 'evaluated',
    rubricScores: {
      clarity: 28, // / 30
      efficiency: 34, // / 35
      edgeCases: 32, // / 35
      total: 94,
    },
    evaluatorFeedback: 'Exceptional structural explanation. The rationale for avoiding an explicit dp[] buffer is clearly articulated. Mathematical breakdown of the recurrence relation is sound.',
    evaluatorName: 'Dr. Sarah Chen (Senior Trainer)',
    evaluatedAt: 'Today at 3:45 PM',
  },
  {
    id: 'sub-302',
    studentId: 'std-102',
    studentName: 'Devon Miles',
    challengeId: 'ch-2',
    challengeTitle: 'Search in Rotated Sorted Array',
    language: 'TypeScript',
    submittedCode: `function searchRotated(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
    approachExplanation: 'Modified binary search dividing the search space by identifying which partition preserves monotonicity. Once determined whether the left or right segment is sorted, we perform boundary checks against target to shrink the window logarithmically.',
    timeComplexity: 'O(log n) because the search space is halved every iteration.',
    spaceComplexity: 'O(1) auxiliary memory.',
    edgeCasesConsidered: 'Tested with target at array extremities and single-element inputs.',
    submittedAt: 'Today at 4:10 PM',
    status: 'pending',
  },
  {
    id: 'sub-303',
    studentId: 'std-103',
    studentName: 'Priya Sharma',
    challengeId: 'ch-1',
    challengeTitle: 'Climbing Stairs: Minimum Cost & Path Optimization',
    language: 'TypeScript',
    submittedCode: `function minCostClimbingStairs(cost: number[]): number {
  const dp: number[] = new Array(cost.length + 1).fill(0);
  for (let i = 2; i <= cost.length; i++) {
    dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
  }
  return dp[cost.length];
}`,
    approachExplanation: 'Created an array dp where dp[i] represents min cost to reach step i. Solved iteratively from step 2 up to the top floor.',
    timeComplexity: 'O(n) loop.',
    spaceComplexity: 'O(n) auxiliary array for dynamic programming table.',
    edgeCasesConsidered: 'Only checked positive cost values.',
    submittedAt: 'Yesterday at 5:30 PM',
    status: 'evaluated',
    rubricScores: {
      clarity: 25,
      efficiency: 26,
      edgeCases: 24,
      total: 75,
    },
    evaluatorFeedback: 'Good working solution. Consider demonstrating space optimization from O(n) to O(1) by retaining only two previous state values.',
    evaluatorName: 'Marcus Vance (Evaluator)',
    evaluatedAt: 'Yesterday at 7:15 PM',
  },
];

export const mockCohortStudents: CohortStudent[] = [
  {
    id: 'std-101',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    email: 'alex.rivera@cs.university.edu',
    masteryScore: 74,
    status: 'On Track',
    weakTopics: ['Dynamic Programming', 'SQL Joins'],
    assessmentsDone: 18,
    lastActive: '12 mins ago',
  },
  {
    id: 'std-102',
    name: 'Devon Miles',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    email: 'devon.miles@cs.university.edu',
    masteryScore: 62,
    status: 'Needs Attention',
    weakTopics: ['Tree Traversal', 'Dynamic Programming', 'Graphs'],
    assessmentsDone: 11,
    lastActive: '3 hours ago',
  },
  {
    id: 'std-103',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    email: 'priya.s@cs.university.edu',
    masteryScore: 89,
    status: 'On Track',
    weakTopics: ['Distributed Systems'],
    assessmentsDone: 24,
    lastActive: 'Just now',
  },
  {
    id: 'std-104',
    name: 'Liam Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    email: 'liam.chen@cs.university.edu',
    masteryScore: 48,
    status: 'At Risk',
    weakTopics: ['Algorithms', 'Recursion', 'Time Complexity'],
    assessmentsDone: 6,
    lastActive: '2 days ago',
  },
  {
    id: 'std-105',
    name: 'Sophia Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    email: 'sophia.patel@cs.university.edu',
    masteryScore: 81,
    status: 'On Track',
    weakTopics: ['SQL Subqueries'],
    assessmentsDone: 20,
    lastActive: '1 hour ago',
  },
];

export const mockPersonalizedRecommendations = [
  {
    id: 'rec-1',
    topicId: 'top-1',
    title: 'Adaptive Remedial Drill: 1D Dynamic Programming',
    type: 'Practice',
    difficulty: 'Easy',
    estimatedMinutes: 10,
    reason: 'Detected 42% accuracy in recent DP assessment. Recommended simpler scaffolded subproblems.',
    impact: '+18% Projected Mastery',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'rec-2',
    topicId: 'top-2',
    title: 'Visual SQL Workbench: Multi-Table Joins & Filtering',
    type: 'Interactive Lesson',
    difficulty: 'Easy',
    estimatedMinutes: 15,
    reason: 'Identified confusion in LEFT OUTER vs INNER join NULL evaluations.',
    impact: '+14% Projected Mastery',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'rec-3',
    topicId: 'top-5',
    title: 'Advanced Mastery Challenge: LRU Cache Design in O(1)',
    type: 'Challenge',
    difficulty: 'Hard',
    estimatedMinutes: 25,
    reason: 'Achieved 92% mastery on Hash Maps. System unlocks advanced algorithmic puzzles.',
    impact: 'Elite Badge Qualification',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];
