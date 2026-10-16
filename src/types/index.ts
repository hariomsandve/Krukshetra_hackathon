export type UserRole = 'student' | 'trainer' | 'evaluator';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type TopicStatus = 'mastered' | 'improving' | 'weak' | 'critical';

export interface Topic {
  id: string;
  name: string;
  category: string;
  proficiencyScore: number; // 0 - 100
  status: TopicStatus;
  recommendedDifficulty: DifficultyLevel;
  questionsAttempted: number;
  correctAnswers: number;
  lastAssessed: string;
  remedialRecommended: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalModules: number;
  completedModules: number;
  progressPercent: number;
  enrolledStudentsCount: number;
  category: string;
  tags: string[];
  thumbnailGradient: string;
}

export interface AssessmentQuestion {
  id: string;
  topicId: string;
  topicName: string;
  difficulty: DifficultyLevel;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

export interface Assessment {
  id: string;
  title: string;
  topicId: string;
  topicName: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  questionsCount: number;
  isAdaptive: boolean;
  questions: AssessmentQuestion[];
}

export interface QuizResult {
  assessmentId: string;
  topicName: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  difficultyAchieved: DifficultyLevel;
  timestamp: string;
  adaptiveAdjustment: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
  isSecret?: boolean;
}

export interface CodingChallenge {
  id: string;
  title: string;
  topic: string;
  difficulty: DifficultyLevel;
  timeLimitMinutes: number;
  description: string;
  problemStatement: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: string;
  testCases: TestCase[];
  hints: string[];
}

export interface RubricScores {
  clarity: number; // 0 - 30
  efficiency: number; // 0 - 35
  edgeCases: number; // 0 - 35
  total: number; // 0 - 100
}

export interface CodeExplanationSubmission {
  id: string;
  studentId: string;
  studentName: string;
  challengeId: string;
  challengeTitle: string;
  language: string;
  submittedCode: string;
  approachExplanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  edgeCasesConsidered: string;
  submittedAt: string;
  status: 'pending' | 'evaluated';
  rubricScores?: RubricScores;
  evaluatorFeedback?: string;
  evaluatorName?: string;
  evaluatedAt?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  cohort: string;
  overallMastery: number;
  streakDays: number;
  assessmentsCompleted: number;
  codingChallengesCompleted: number;
  rank: number;
  weakTopicsCount: number;
}

export interface CohortStudent {
  id: string;
  name: string;
  avatar: string;
  email: string;
  masteryScore: number;
  status: 'On Track' | 'Needs Attention' | 'At Risk';
  weakTopics: string[];
  assessmentsDone: number;
  lastActive: string;
}
