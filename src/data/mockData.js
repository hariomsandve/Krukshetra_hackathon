/**
 * Mentos AI Learning Companion - Prototype Mock Dataset
 * Contains comprehensive mock data for all learning suite features.
 */

export const mockData = {
  meta: {
    product: "Mentos",
    datasetVersion: "1.0.0",
    generatedAt: "2026-10-17",
    purpose: "Frontend prototype mock data only",
    notice: "All learner identities, scores, conversations, submissions, and analytics in this file are fictional sample data."
  },
  currentUser: {
    id: "user_parth_demo",
    displayName: "Alex Morgan",
    email: "alex.morgan@example.test",
    avatarUrl: null,
    role: "student",
    cohort: "Computer Science - Year 3",
    preferences: {
      theme: "dark-plum",
      language: "English",
      preferredExplanationStyle: "step-by-step",
      voiceInputEnabled: true,
      emailNotifications: false
    }
  },
  navigation: [
    { id: "new-chat", label: "New Chat", icon: "plus" },
    { id: "chat-history", label: "Chat History", icon: "messages-square" },
    { id: "dashboard", label: "Learning Dashboard", icon: "layout-dashboard" },
    { id: "concept-maps", label: "Concept Maps", icon: "network" },
    { id: "assessments", label: "Practice & Assessments", icon: "clipboard-check" },
    { id: "coding", label: "Coding Workspace", icon: "code-2" },
    { id: "code-viva", label: "AI Code Viva", icon: "mic" },
    { id: "progress", label: "Progress & Analytics", icon: "chart-no-axes-combined" },
    { id: "library", label: "Learning Library", icon: "book-open" },
    { id: "voice-tutor", label: "Voice Tutor", icon: "audio-lines" }
  ],
  subjects: [
    {
      id: "sub-java",
      title: "Java Programming",
      slug: "java-programming",
      description: "Core Java from syntax to collections and concurrency.",
      icon: "coffee",
      color: "violet",
      level: "beginner-to-intermediate",
      topicCount: 8,
      progressPercent: 62
    },
    {
      id: "sub-dsa",
      title: "Data Structures & Algorithms",
      slug: "data-structures-algorithms",
      description: "Build problem-solving skills through data structures and algorithms.",
      icon: "network",
      color: "purple",
      level: "beginner-to-advanced",
      topicCount: 10,
      progressPercent: 48
    },
    {
      id: "sub-dbms",
      title: "DBMS & SQL",
      slug: "dbms-sql",
      description: "Relational databases, SQL queries, normalization, and transactions.",
      icon: "database",
      color: "blue",
      level: "beginner-to-intermediate",
      topicCount: 6,
      progressPercent: 35
    },
    {
      id: "sub-os",
      title: "Operating Systems",
      slug: "operating-systems",
      description: "Processes, threads, scheduling, memory, and synchronization.",
      icon: "cpu",
      color: "green",
      level: "intermediate",
      topicCount: 6,
      progressPercent: 24
    },
    {
      id: "sub-cn",
      title: "Computer Networks",
      slug: "computer-networks",
      description: "Networking fundamentals, protocols, routing, and security.",
      icon: "globe",
      color: "orange",
      level: "intermediate",
      topicCount: 5,
      progressPercent: 18
    },
    {
      id: "sub-web",
      title: "Web Development",
      slug: "web-development",
      description: "HTTP, APIs, frontend fundamentals, and backend architecture.",
      icon: "code",
      color: "pink",
      level: "beginner-to-intermediate",
      topicCount: 6,
      progressPercent: 56
    },
    {
      id: "sub-ai",
      title: "AI & Machine Learning",
      slug: "ai-machine-learning",
      description: "AI foundations, machine learning workflows, and evaluation.",
      icon: "brain-circuit",
      color: "indigo",
      level: "introductory",
      topicCount: 5,
      progressPercent: 12
    },
    {
      id: "sub-cloud",
      title: "Cloud & DevOps",
      slug: "cloud-devops",
      description: "Cloud concepts, containers, CI/CD, and deployment.",
      icon: "cloud",
      color: "cyan",
      level: "introductory",
      topicCount: 5,
      progressPercent: 20
    }
  ],
  topics: [
    {
      id: "topic-java-basics",
      subjectId: "sub-java",
      title: "Java Fundamentals",
      description: "Variables, data types, operators, control flow, and methods.",
      difficulty: "beginner",
      tags: ["java", "syntax", "fundamentals"],
      estimatedMinutes: 90,
      prerequisiteIds: [],
      masteryPercent: 88,
      status: "mastered"
    },
    {
      id: "topic-oop",
      subjectId: "sub-java",
      title: "Object-Oriented Programming",
      description: "Classes, objects, encapsulation, inheritance, abstraction, and polymorphism.",
      difficulty: "beginner",
      tags: ["java", "oop", "classes"],
      estimatedMinutes: 150,
      prerequisiteIds: ["topic-java-basics"],
      masteryPercent: 74,
      status: "in-progress"
    },
    {
      id: "topic-collections",
      subjectId: "sub-java",
      title: "Java Collections Framework",
      description: "List, Set, Map, iterators, generics, and choosing appropriate collections.",
      difficulty: "intermediate",
      tags: ["java", "collections", "hashmap"],
      estimatedMinutes: 180,
      prerequisiteIds: ["topic-oop", "topic-arrays"],
      masteryPercent: 51,
      status: "needs-practice"
    },
    {
      id: "topic-arrays",
      subjectId: "sub-dsa",
      title: "Arrays & Strings",
      description: "Indexing, traversal, searching, two pointers, and common array patterns.",
      difficulty: "beginner",
      tags: ["dsa", "arrays", "strings"],
      estimatedMinutes: 120,
      prerequisiteIds: ["topic-java-basics"],
      masteryPercent: 81,
      status: "in-progress"
    },
    {
      id: "topic-complexity",
      subjectId: "sub-dsa",
      title: "Time & Space Complexity",
      description: "Analyze algorithm efficiency using Big O notation.",
      difficulty: "beginner",
      tags: ["dsa", "big-o", "analysis"],
      estimatedMinutes: 75,
      prerequisiteIds: ["topic-java-basics"],
      masteryPercent: 68,
      status: "in-progress"
    },
    {
      id: "topic-linked-list",
      subjectId: "sub-dsa",
      title: "Linked Lists",
      description: "Nodes, pointers/references, traversal, insertion, deletion, and reversal.",
      difficulty: "beginner",
      tags: ["dsa", "linked-list", "pointers"],
      estimatedMinutes: 140,
      prerequisiteIds: ["topic-arrays", "topic-complexity"],
      masteryPercent: 42,
      status: "needs-practice"
    },
    {
      id: "topic-stack-queue",
      subjectId: "sub-dsa",
      title: "Stacks & Queues",
      description: "LIFO/FIFO structures, implementations, and practical applications.",
      difficulty: "beginner",
      tags: ["dsa", "stack", "queue"],
      estimatedMinutes: 120,
      prerequisiteIds: ["topic-linked-list"],
      masteryPercent: 28,
      status: "locked"
    },
    {
      id: "topic-hashmap",
      subjectId: "sub-dsa",
      title: "Hash Maps & Hashing",
      description: "Hash functions, collisions, load factor, and map-based problem solving.",
      difficulty: "intermediate",
      tags: ["dsa", "hashmap", "hashing"],
      estimatedMinutes: 160,
      prerequisiteIds: ["topic-arrays", "topic-complexity"],
      masteryPercent: 35,
      status: "needs-practice"
    },
    {
      id: "topic-recursion",
      subjectId: "sub-dsa",
      title: "Recursion",
      description: "Base cases, recursive calls, call stack, and tracing recursive algorithms.",
      difficulty: "intermediate",
      tags: ["dsa", "recursion"],
      estimatedMinutes: 135,
      prerequisiteIds: ["topic-java-basics", "topic-complexity"],
      masteryPercent: 31,
      status: "needs-practice"
    },
    {
      id: "topic-trees",
      subjectId: "sub-dsa",
      title: "Trees & Binary Search Trees",
      description: "Tree terminology, traversals, BST operations, and recursion patterns.",
      difficulty: "intermediate",
      tags: ["dsa", "trees", "bst"],
      estimatedMinutes: 210,
      prerequisiteIds: ["topic-recursion", "topic-stack-queue"],
      masteryPercent: 0,
      status: "locked"
    },
    {
      id: "topic-db-sql",
      subjectId: "sub-dbms",
      title: "SQL Fundamentals",
      description: "SELECT, filtering, joins, grouping, and aggregate functions.",
      difficulty: "beginner",
      tags: ["sql", "dbms", "queries"],
      estimatedMinutes: 150,
      prerequisiteIds: [],
      masteryPercent: 45,
      status: "in-progress"
    },
    {
      id: "topic-normalization",
      subjectId: "sub-dbms",
      title: "Database Normalization",
      description: "Functional dependencies and 1NF, 2NF, and 3NF.",
      difficulty: "intermediate",
      tags: ["dbms", "normalization"],
      estimatedMinutes: 100,
      prerequisiteIds: ["topic-db-sql"],
      masteryPercent: 0,
      status: "locked"
    },
    {
      id: "topic-processes",
      subjectId: "sub-os",
      title: "Processes & Threads",
      description: "Process lifecycle, thread models, context switching, and concurrency basics.",
      difficulty: "intermediate",
      tags: ["os", "process", "thread"],
      estimatedMinutes: 120,
      prerequisiteIds: [],
      masteryPercent: 25,
      status: "in-progress"
    },
    {
      id: "topic-http",
      subjectId: "sub-web",
      title: "HTTP & REST APIs",
      description: "HTTP methods, status codes, headers, REST conventions, and JSON APIs.",
      difficulty: "beginner",
      tags: ["web", "http", "rest", "api"],
      estimatedMinutes: 120,
      prerequisiteIds: [],
      masteryPercent: 79,
      status: "in-progress"
    },
    {
      id: "topic-spring",
      subjectId: "sub-web",
      title: "Spring Boot Fundamentals",
      description: "Controllers, services, repositories, dependency injection, and configuration.",
      difficulty: "intermediate",
      tags: ["java", "spring-boot", "backend"],
      estimatedMinutes: 240,
      prerequisiteIds: ["topic-oop", "topic-http"],
      masteryPercent: 52,
      status: "in-progress"
    },
    {
      id: "topic-git",
      subjectId: "sub-cloud",
      title: "Git & GitHub Workflow",
      description: "Commits, branches, pull requests, merges, and resolving conflicts.",
      difficulty: "beginner",
      tags: ["git", "github", "devops"],
      estimatedMinutes: 90,
      prerequisiteIds: [],
      masteryPercent: 66,
      status: "in-progress"
    }
  ],
  concepts: [
    {
      id: "concept-java-basics",
      topicId: "topic-java-basics",
      title: "Java Fundamentals",
      x: 120,
      y: 90,
      tier_level: 0,
      masteryPercent: 88,
      status: "mastered",
      prerequisiteIds: [],
      prerequisites: [],
      difficulty: "beginner",
      estimated_minutes: 90,
      description: "Understand Java syntax and basic program structure."
    },
    {
      id: "concept-arrays",
      topicId: "topic-arrays",
      title: "Arrays",
      x: 320,
      y: 180,
      tier_level: 1,
      masteryPercent: 81,
      status: "in-progress",
      prerequisiteIds: ["concept-java-basics"],
      prerequisites: ["concept-java-basics"],
      difficulty: "beginner",
      estimated_minutes: 120,
      description: "Store and access indexed sequences of values."
    },
    {
      id: "concept-complexity",
      topicId: "topic-complexity",
      title: "Big O",
      x: 320,
      y: 40,
      tier_level: 1,
      masteryPercent: 68,
      status: "in-progress",
      prerequisiteIds: ["concept-java-basics"],
      prerequisites: ["concept-java-basics"],
      difficulty: "beginner",
      estimated_minutes: 75,
      description: "Estimate how runtime or memory grows with input size."
    },
    {
      id: "concept-linked-list",
      topicId: "topic-linked-list",
      title: "Linked Lists",
      x: 540,
      y: 180,
      tier_level: 2,
      masteryPercent: 42,
      status: "needs-practice",
      prerequisiteIds: ["concept-arrays", "concept-complexity"],
      prerequisites: ["concept-arrays", "concept-complexity"],
      difficulty: "beginner",
      estimated_minutes: 140,
      description: "Connect nodes through references rather than contiguous indexing."
    },
    {
      id: "concept-hashmap",
      topicId: "topic-hashmap",
      title: "Hash Maps",
      x: 540,
      y: 40,
      tier_level: 2,
      masteryPercent: 35,
      status: "needs-practice",
      prerequisiteIds: ["concept-arrays", "concept-complexity"],
      prerequisites: ["concept-arrays", "concept-complexity"],
      difficulty: "intermediate",
      estimated_minutes: 160,
      description: "Use keys and hashing to support efficient lookup."
    },
    {
      id: "concept-stack",
      topicId: "topic-stack-queue",
      title: "Stacks & Queues",
      x: 760,
      y: 180,
      tier_level: 3,
      masteryPercent: 28,
      status: "locked",
      prerequisiteIds: ["concept-linked-list"],
      prerequisites: ["concept-linked-list"],
      difficulty: "beginner",
      estimated_minutes: 120,
      description: "Model LIFO and FIFO access patterns."
    },
    {
      id: "concept-recursion",
      topicId: "topic-recursion",
      title: "Recursion",
      x: 540,
      y: 320,
      tier_level: 2,
      masteryPercent: 31,
      status: "needs-practice",
      prerequisiteIds: ["concept-complexity"],
      prerequisites: ["concept-complexity"],
      difficulty: "intermediate",
      estimated_minutes: 135,
      description: "Solve a problem by reducing it to smaller instances."
    },
    {
      id: "concept-trees",
      topicId: "topic-trees",
      title: "Trees",
      x: 780,
      y: 320,
      tier_level: 4,
      masteryPercent: 0,
      status: "locked",
      prerequisiteIds: ["concept-recursion", "concept-stack"],
      prerequisites: ["concept-recursion", "concept-stack"],
      difficulty: "intermediate",
      estimated_minutes: 210,
      description: "Represent hierarchical data and traverse node relationships."
    }
  ],
  conceptEdges: [
    { source: "concept-java-basics", target: "concept-arrays" },
    { source: "concept-java-basics", target: "concept-complexity" },
    { source: "concept-arrays", target: "concept-linked-list" },
    { source: "concept-complexity", target: "concept-linked-list" },
    { source: "concept-arrays", target: "concept-hashmap" },
    { source: "concept-complexity", target: "concept-hashmap" },
    { source: "concept-linked-list", target: "concept-stack" },
    { source: "concept-complexity", target: "concept-recursion" },
    { source: "concept-recursion", target: "concept-trees" },
    { source: "concept-stack", target: "concept-trees" }
  ],
  learningResources: [
    {
      id: "res-java-01",
      title: "Java Language Basics",
      type: "article",
      subjectId: "sub-java",
      topicId: "topic-java-basics",
      description: "A curated introduction to Java syntax, variables, and control flow.",
      sourceName: "DevDocs / Java learning notes",
      sourceUrl: "https://dev.java/learn/",
      license: "Check source terms before redistribution",
      durationMinutes: 25,
      tags: ["java", "beginner"],
      isBookmarked: true,
      isVerified: true
    },
    {
      id: "res-dsa-01",
      title: "Arrays: Core Patterns",
      type: "lesson",
      subjectId: "sub-dsa",
      topicId: "topic-arrays",
      description: "Practice traversal, two pointers, and prefix-sum thinking.",
      sourceName: "Mentos sample lesson",
      sourceUrl: null,
      license: "Mentos demo content",
      durationMinutes: 20,
      tags: ["arrays", "patterns"],
      isBookmarked: true,
      isVerified: false
    },
    {
      id: "res-ll-01",
      title: "Linked List Visual Guide",
      type: "video",
      subjectId: "sub-dsa",
      topicId: "topic-linked-list",
      description: "Visualize nodes, references, insertion, deletion, and reversal.",
      sourceName: "Mentos sample resource",
      sourceUrl: null,
      license: "Demo metadata; replace with a reviewed resource",
      durationMinutes: 18,
      tags: ["linked-list", "visual"],
      isBookmarked: false,
      isVerified: false
    },
    {
      id: "res-sql-01",
      title: "SQL Tutorial",
      type: "documentation",
      subjectId: "sub-dbms",
      topicId: "topic-db-sql",
      description: "Reference material for SQL syntax and queries.",
      sourceName: "SQLBolt",
      sourceUrl: "https://sqlbolt.com/",
      license: "Refer to source terms",
      durationMinutes: 45,
      tags: ["sql", "practice"],
      isBookmarked: false,
      isVerified: true
    },
    {
      id: "res-spring-01",
      title: "Spring Boot Guides",
      type: "documentation",
      subjectId: "sub-web",
      topicId: "topic-spring",
      description: "Guides for building Spring applications.",
      sourceName: "Spring",
      sourceUrl: "https://spring.io/guides",
      license: "Refer to source terms",
      durationMinutes: 40,
      tags: ["spring", "backend"],
      isBookmarked: true,
      isVerified: true
    },
    {
      id: "res-git-01",
      title: "Git Documentation",
      type: "documentation",
      subjectId: "sub-cloud",
      topicId: "topic-git",
      description: "Official reference for Git concepts and commands.",
      sourceName: "Git SCM",
      sourceUrl: "https://git-scm.com/doc",
      license: "Refer to source terms",
      durationMinutes: 35,
      tags: ["git", "tools"],
      isBookmarked: false,
      isVerified: true
    }
  ],
  practiceQuestions: [
    {
      id: "q-arr-001",
      topicId: "topic-arrays",
      type: "multiple-choice",
      difficulty: "easy",
      question: "What is the index of the first element in a Java array?",
      options: [
        { id: "a", text: "-1" },
        { id: "b", text: "0" },
        { id: "c", text: "1" },
        { id: "d", text: "Depends on array size" }
      ],
      correctOptionId: "b",
      explanation: "Java arrays use zero-based indexing.",
      tags: ["indexing", "java"],
      estimatedMinutes: 1
    },
    {
      id: "q-arr-002",
      topicId: "topic-arrays",
      type: "multiple-choice",
      difficulty: "medium",
      question: "What is the time complexity of accessing arr[i] when the index is valid?",
      options: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(n log n)" }
      ],
      correctOptionId: "a",
      explanation: "Array elements can be accessed directly by index in constant time.",
      tags: ["complexity", "arrays"],
      estimatedMinutes: 2
    },
    {
      id: "q-ll-001",
      topicId: "topic-linked-list",
      type: "multiple-choice",
      difficulty: "easy",
      question: "In a singly linked list, what does each node usually store besides its value?",
      options: [
        { id: "a", text: "A reference to the next node" },
        { id: "b", text: "The entire list" },
        { id: "c", text: "Its array index" },
        { id: "d", text: "A copy of every later node" }
      ],
      correctOptionId: "a",
      explanation: "A singly linked list node stores a value and a reference to the next node.",
      tags: ["nodes", "references"],
      estimatedMinutes: 2
    },
    {
      id: "q-ll-002",
      topicId: "topic-linked-list",
      type: "multiple-choice",
      difficulty: "medium",
      question: "What is the time complexity of finding a value in an unsorted singly linked list?",
      options: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(n log n)" }
      ],
      correctOptionId: "c",
      explanation: "In the worst case, each node must be visited.",
      tags: ["search", "complexity"],
      estimatedMinutes: 2
    },
    {
      id: "q-hash-001",
      topicId: "topic-hashmap",
      type: "multiple-choice",
      difficulty: "medium",
      question: "What is a hash collision?",
      options: [
        { id: "a", text: "Two keys map to the same hash bucket" },
        { id: "b", text: "A key has no value" },
        { id: "c", text: "A map is sorted automatically" },
        { id: "d", text: "A key is always duplicated" }
      ],
      correctOptionId: "a",
      explanation: "Different keys can map to the same bucket, requiring a collision-handling strategy.",
      tags: ["hashing", "collision"],
      estimatedMinutes: 2
    },
    {
      id: "q-java-001",
      topicId: "topic-oop",
      type: "multiple-choice",
      difficulty: "easy",
      question: "Which OOP principle bundles data and the methods that operate on it while controlling access?",
      options: [
        { id: "a", text: "Encapsulation" },
        { id: "b", text: "Recursion" },
        { id: "c", text: "Compilation" },
        { id: "d", text: "Normalization" }
      ],
      correctOptionId: "a",
      explanation: "Encapsulation groups state and behavior and controls access to internal details.",
      tags: ["oop", "encapsulation"],
      estimatedMinutes: 2
    },
    {
      id: "q-sql-001",
      topicId: "topic-db-sql",
      type: "multiple-choice",
      difficulty: "easy",
      question: "Which SQL clause filters rows before grouping?",
      options: [
        { id: "a", text: "ORDER BY" },
        { id: "b", text: "WHERE" },
        { id: "c", text: "HAVING" },
        { id: "d", text: "LIMIT" }
      ],
      correctOptionId: "b",
      explanation: "WHERE filters individual rows before GROUP BY; HAVING filters groups.",
      tags: ["sql", "filtering"],
      estimatedMinutes: 2
    },
    {
      id: "q-http-001",
      topicId: "topic-http",
      type: "multiple-choice",
      difficulty: "easy",
      question: "Which HTTP method is conventionally used to retrieve a resource?",
      options: [
        { id: "a", text: "POST" },
        { id: "b", text: "PATCH" },
        { id: "c", text: "GET" },
        { id: "d", text: "DELETE" }
      ],
      correctOptionId: "c",
      explanation: "GET requests representation of a resource and should not be used for state-changing actions.",
      tags: ["http", "methods"],
      estimatedMinutes: 1
    }
  ],
  codingAssessments: [
    {
      id: "assessment-two-sum",
      title: "Two Sum",
      topicId: "topic-arrays",
      difficulty: "easy",
      languageOptions: ["java", "python", "javascript"],
      durationMinutes: 30,
      totalPoints: 100,
      description: "Return the indices of two distinct elements whose values add up to the target.",
      starterCode: {
        java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int need = target - nums[i];\n            if (seen.containsKey(need)) return new int[]{seen.get(need), i};\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}",
        python: "class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, num in enumerate(nums):\n            need = target - num\n            if need in seen:\n                return [seen[need], i]\n            seen[num] = i\n        return []",
        javascript: "function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}"
      },
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
      ],
      constraints: [
        "Exactly one valid answer exists.",
        "Do not use the same element twice."
      ],
      testCases: [
        { id: "tc-1", visibility: "sample", input: "[2,7,11,15], 9", expectedOutput: "[0,1]", points: 30 },
        { id: "tc-2", visibility: "hidden", input: "[3,2,4], 6", expectedOutput: "[1,2]", points: 30 },
        { id: "tc-3", visibility: "hidden", input: "[3,3], 6", expectedOutput: "[0,1]", points: 40 }
      ]
    },
    {
      id: "assessment-reverse-list",
      title: "Reverse a Linked List",
      topicId: "topic-linked-list",
      difficulty: "easy",
      languageOptions: ["java", "python"],
      durationMinutes: 35,
      totalPoints: 100,
      description: "Reverse a singly linked list and return the new head.",
      starterCode: {
        java: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}",
        python: "class Solution:\n    def reverseList(self, head):\n        prev = None\n        curr = head\n        while curr:\n            next_node = curr.next\n            curr.next = prev\n            prev = curr\n            curr = next_node\n        return prev"
      },
      examples: [
        { input: "1 -> 2 -> 3 -> null", output: "3 -> 2 -> 1 -> null" },
        { input: "null", output: "null" }
      ],
      constraints: ["The list may be empty.", "Aim for O(n) time complexity."],
      testCases: [
        { id: "tc-4", visibility: "sample", input: "[1,2,3]", expectedOutput: "[3,2,1]", points: 50 },
        { id: "tc-5", visibility: "hidden", input: "[]", expectedOutput: "[]", points: 50 }
      ]
    }
  ],
  dashboard: {
    summary: {
      overallMasteryPercent: 58,
      conceptsMastered: 14,
      conceptsNeedingPractice: 6,
      assessmentsCompleted: 12,
      currentStreakDays: 4,
      studyTimeMinutesThisWeek: 315
    },
    masteryTrend: [
      { date: "2026-10-11", masteryPercent: 49 },
      { date: "2026-10-12", masteryPercent: 51 },
      { date: "2026-10-13", masteryPercent: 53 },
      { date: "2026-10-14", masteryPercent: 55 },
      { date: "2026-10-15", masteryPercent: 56 },
      { date: "2026-10-16", masteryPercent: 58 }
    ],
    weeklyActivity: [
      { day: "Mon", minutes: 35 },
      { day: "Tue", minutes: 50 },
      { day: "Wed", minutes: 20 },
      { day: "Thu", minutes: 65 },
      { day: "Fri", minutes: 45 },
      { day: "Sat", minutes: 80 },
      { day: "Sun", minutes: 20 }
    ],
    recommendedNextSteps: [
      {
        id: "rec-1",
        topicId: "topic-linked-list",
        title: "Practice Linked Lists",
        reason: "Your current sample mastery is 42%, and linked lists are a prerequisite for stacks and queues.",
        estimatedMinutes: 25,
        action: "practice",
        priority: "high"
      },
      {
        id: "rec-2",
        topicId: "topic-hashmap",
        title: "Review Hash Maps",
        reason: "Revisit collision handling and average-case lookup complexity before harder problems.",
        estimatedMinutes: 20,
        action: "learn",
        priority: "high"
      },
      {
        id: "rec-3",
        topicId: "topic-spring",
        title: "Continue Spring Boot Fundamentals",
        reason: "Build on your HTTP and OOP foundations with a small controller-service exercise.",
        estimatedMinutes: 30,
        action: "continue",
        priority: "medium"
      }
    ],
    recentActivity: [
      {
        id: "activity-1",
        type: "assessment",
        title: "Completed Two Sum",
        timestamp: "2026-10-16T18:20:00+05:30",
        detail: "80% score"
      },
      {
        id: "activity-2",
        type: "learning",
        title: "Reviewed Java Collections",
        timestamp: "2026-10-16T16:05:00+05:30",
        detail: "12 minutes"
      },
      {
        id: "activity-3",
        type: "chat",
        title: "Asked about Big O notation",
        timestamp: "2026-10-15T20:45:00+05:30",
        detail: "Saved explanation"
      }
    ]
  },
  chat: {
    suggestions: [
      {
        id: "suggestion-1",
        label: "Explain a difficult concept",
        prompt: "Explain linked lists step by step with a simple Java example."
      },
      {
        id: "suggestion-2",
        label: "Help me debug code",
        prompt: "Help me debug this code. Explain the root cause before suggesting a fix."
      },
      {
        id: "suggestion-3",
        label: "Create a study plan",
        prompt: "Create a 7-day DSA study plan based on my weak concepts."
      },
      {
        id: "suggestion-4",
        label: "Quiz me on a topic",
        prompt: "Quiz me on Java collections with one question at a time."
      }
    ],
    conversations: [
      {
        id: "chat-001",
        title: "Understanding Linked Lists",
        createdAt: "2026-10-16T19:10:00+05:30",
        updatedAt: "2026-10-16T19:22:00+05:30",
        pinned: true,
        messages: [
          {
            id: "msg-001",
            role: "user",
            content: "Explain linked lists in Java with a simple example.",
            createdAt: "2026-10-16T19:10:00+05:30"
          },
          {
            "id": "msg-002",
            role: "assistant",
            content: "A linked list stores values in nodes. Each node holds a value and a reference to the next node. Unlike an array, its nodes do not need to sit next to each other in memory.\n\n```java\nclass Node {\n    int value;\n    Node next;\n    Node(int value) { this.value = value; }\n}\n```\n\nThe key idea is to follow references from the head node to reach later nodes.",
            createdAt: "2026-10-16T19:10:15+05:30"
          },
          {
            id: "msg-003",
            role: "user",
            content: "Why is searching O(n)?",
            createdAt: "2026-10-16T19:20:00+05:30"
          },
          {
            id: "msg-004",
            role: "assistant",
            content: "Because in the worst case you must visit each node once. If there are n nodes, the number of checks grows proportionally to n, so the time complexity is O(n).",
            createdAt: "2026-10-16T19:20:10+05:30"
          }
        ]
      },
      {
        id: "chat-002",
        title: "Spring Boot Controller vs Service",
        createdAt: "2026-10-15T12:30:00+05:30",
        updatedAt: "2026-10-15T12:40:00+05:30",
        pinned: false,
        messages: [
          {
            id: "msg-005",
            role: "user",
            content: "What is the difference between a controller and a service?",
            createdAt: "2026-10-15T12:30:00+05:30"
          },
          {
            id: "msg-006",
            role: "assistant",
            content: "A controller handles HTTP requests and responses. A service contains application/business logic. Keeping them separate makes the code easier to test and maintain.",
            createdAt: "2026-10-15T12:30:10+05:30"
          }
        ]
      },
      {
        id: "chat-003",
        title: "Big O Complexity Revision",
        createdAt: "2026-10-13T09:00:00+05:30",
        updatedAt: "2026-10-13T09:08:00+05:30",
        pinned: false,
        messages: [
          {
            id: "msg-007",
            role: "user",
            content: "Give me a quick revision of Big O.",
            createdAt: "2026-10-13T09:00:00+05:30"
          },
          {
            id: "msg-008",
            role: "assistant",
            content: "O(1) is constant, O(log n) grows logarithmically, O(n) grows linearly, and O(n log n) is common in efficient comparison sorting. Analyze how work scales as input size increases.",
            createdAt: "2026-10-13T09:00:10+05:30"
          }
        ]
      }
    ]
  },
  voiceTutor: {
    defaultLanguage: "English",
    supportedLanguages: ["English", "Hindi", "Hinglish"],
    initialStatus: "offline",
    transcript: [
      {
        id: "voice-001",
        speaker: "user",
        text: "Can you explain hash maps in simple Hinglish?",
        timestamp: "00:00:04"
      },
      {
        id: "voice-002",
        speaker: "assistant",
        text: "Bilkul. HashMap key-value pairs store karta hai. Average case mein lookup ka time O(1) hota hai, lekin collisions aur implementation details matter karte hain.",
        timestamp: "00:00:07"
      }
    ],
    quickActions: [
      { id: "voice-action-1", label: "Explain concept", prompt: "Explain the selected concept step by step." },
      { id: "voice-action-2", label: "Help with question", prompt: "Help me reason through the current question without immediately giving the answer." },
      { id: "voice-action-3", label: "Summarize progress", prompt: "Summarize my progress using available real progress data." },
      { id: "voice-action-4", label: "Explain in Hinglish", prompt: "Explain the selected topic in simple Hinglish." }
    ]
  },
  codeViva: {
    id: "viva-001",
    submissionId: "submission-001",
    status: "ready-for-demo",
    questions: [
      {
        id: "viva-q1",
        question: "Explain how your solution finds the complement of the current number.",
        category: "logic",
        expectedTopics: ["target minus current value", "lookup in map"],
        maxPoints: 5
      },
      {
        id: "viva-q2",
        question: "What is the average time complexity of this solution, and why?",
        category: "complexity",
        expectedTopics: ["average O(n) total time", "hash map lookup"],
        maxPoints: 5
      },
      {
        id: "viva-q3",
        question: "What edge cases would you test?",
        category: "testing",
        expectedTopics: ["duplicate values", "negative values", "minimum input size"],
        maxPoints: 5
      }
    ],
    sampleResponses: [
      {
        questionId: "viva-q1",
        response: "We subtract the current number from the target and check whether that value is already in the map."
      },
      {
        questionId: "viva-q2",
        response: "On average the map lookup is constant time, and we process each element once, so total time is O(n)."
      }
    ],
    sampleFeedback: {
      strengths: ["Explains the complement lookup correctly"],
      improvements: ["Discuss worst-case hash map behavior", "Mention edge cases explicitly"],
      score: 12,
      maxScore: 15,
      notice: "Illustrative mock feedback, not a real AI evaluation."
    }
  },
  analytics: {
    topicPerformance: [
      { topicId: "topic-arrays", topicTitle: "Arrays & Strings", accuracyPercent: 82, attempts: 11, masteryPercent: 81 },
      { topicId: "topic-linked-list", topicTitle: "Linked Lists", accuracyPercent: 48, attempts: 7, masteryPercent: 42 },
      { topicId: "topic-hashmap", topicTitle: "Hash Maps & Hashing", accuracyPercent: 44, attempts: 5, masteryPercent: 35 },
      { topicId: "topic-oop", topicTitle: "Object-Oriented Programming", accuracyPercent: 76, attempts: 9, masteryPercent: 74 },
      { topicId: "topic-db-sql", topicTitle: "SQL Fundamentals", accuracyPercent: 60, attempts: 5, masteryPercent: 45 }
    ],
    commonMistakes: [
      {
        id: "mistake-1",
        topicId: "topic-linked-list",
        title: "Losing the next-node reference",
        occurrences: 4,
        recommendation: "Save current.next before changing links."
      },
      {
        id: "mistake-2",
        topicId: "topic-hashmap",
        title: "Ignoring duplicate values",
        occurrences: 3,
        recommendation: "Check whether the complement has already been seen."
      },
      {
        id: "mistake-3",
        topicId: "topic-complexity",
        title: "Confusing nested loops with sequential loops",
        occurrences: 2,
        recommendation: "Analyze whether loop work multiplies or adds."
      }
    ],
    weeklyGoals: {
      targetMinutes: 360,
      completedMinutes: 315,
      targetAssessments: 4,
      completedAssessments: 3
    }
  },
  library: {
    filters: ["All", "Explanations", "Notes", "Resources", "Code Snippets", "Bookmarks"],
    items: [
      {
        id: "lib-001",
        type: "explanation",
        title: "Linked List vs Array",
        description: "Comparison of access, insertion, memory layout, and complexity.",
        topicId: "topic-linked-list",
        savedAt: "2026-10-16T19:25:00+05:30",
        tags: ["dsa", "revision"],
        isBookmarked: true
      },
      {
        id: "lib-002",
        type: "code-snippet",
        title: "Two Sum HashMap Pattern",
        description: "Java implementation of the complement lookup pattern.",
        topicId: "topic-arrays",
        savedAt: "2026-10-16T17:30:00+05:30",
        tags: ["java", "hashmap"],
        isBookmarked: true
      },
      {
        id: "lib-003",
        type: "resource",
        title: "Spring Boot Guides",
        description: "Official Spring guides for backend development.",
        topicId: "topic-spring",
        savedAt: "2026-10-15T14:00:00+05:30",
        tags: ["spring", "backend"],
        isBookmarked: false
      },
      {
        id: "lib-004",
        type: "note",
        title: "Big O Quick Revision",
        description: "Personal revision notes for common time complexities.",
        topicId: "topic-complexity",
        savedAt: "2026-10-13T09:10:00+05:30",
        tags: ["complexity", "revision"],
        isBookmarked: true
      }
    ]
  },
  searchIndex: [
    {
      id: "search-001",
      entityType: "topic",
      entityId: "topic-linked-list",
      title: "Linked Lists",
      subtitle: "Data Structures & Algorithms",
      keywords: ["linked list", "nodes", "references", "insertion", "deletion", "reversal"],
      route: "concept-map"
    },
    {
      id: "search-002",
      entityType: "topic",
      entityId: "topic-hashmap",
      title: "Hash Maps & Hashing",
      subtitle: "Data Structures & Algorithms",
      keywords: ["hashmap", "hash map", "hashing", "collision", "lookup"],
      route: "concept-map"
    },
    {
      id: "search-003",
      entityType: "topic",
      entityId: "topic-spring",
      title: "Spring Boot Fundamentals",
      subtitle: "Web Development",
      keywords: ["spring", "spring boot", "controller", "service", "repository", "dependency injection"],
      route: "courses"
    },
    {
      id: "search-004",
      entityType: "resource",
      entityId: "res-sql-01",
      title: "SQL Tutorial",
      subtitle: "Learning Resource",
      keywords: ["sql", "select", "where", "join", "database"],
      route: "courses"
    },
    {
      id: "search-005",
      entityType: "assessment",
      entityId: "assessment-two-sum",
      title: "Two Sum",
      subtitle: "Coding Assessment · Easy",
      keywords: ["two sum", "array", "hashmap", "coding", "java"],
      route: "coding-workspace"
    }
  ]
};
