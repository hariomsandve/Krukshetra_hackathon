import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  UserRole, 
  Topic, 
  StudentProfile, 
  QuizResult, 
  CodeExplanationSubmission,
  CohortStudent 
} from '../types';
import { 
  mockStudent, 
  mockTopics, 
  mockSubmissions, 
  mockCohortStudents 
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  student: StudentProfile;
  topics: Topic[];
  submissions: CodeExplanationSubmission[];
  cohortStudents: CohortStudent[];
  quizHistory: QuizResult[];
  adaptiveCycleStep: number; // 1 to 5
  setAdaptiveCycleStep: (step: number) => void;
  addQuizResult: (result: QuizResult) => void;
  submitCodeExplanation: (submission: Omit<CodeExplanationSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  evaluateSubmission: (id: string, rubric: { clarity: number; efficiency: number; edgeCases: number; total: number }, feedback: string) => void;
  updateTopicProficiency: (topicId: string, scoreDelta: number) => void;
  resetDemoData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [student, setStudent] = useState<StudentProfile>(mockStudent);
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [submissions, setSubmissions] = useState<CodeExplanationSubmission[]>(mockSubmissions);
  const [cohortStudents, setCohortStudents] = useState<CohortStudent[]>(mockCohortStudents);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([
    {
      assessmentId: 'asmt-dp-adaptive',
      topicName: 'Dynamic Programming & Memoization',
      score: 42,
      totalQuestions: 5,
      correctCount: 2,
      accuracy: 40,
      difficultyAchieved: 'easy',
      timestamp: 'Yesterday at 3:15 PM',
      adaptiveAdjustment: 'Shifted down from Medium to Easy due to early errors',
    },
    {
      assessmentId: 'asmt-sql-adaptive',
      topicName: 'SQL Complex Joins & Subqueries',
      score: 48,
      totalQuestions: 4,
      correctCount: 2,
      accuracy: 50,
      difficultyAchieved: 'easy',
      timestamp: '2 days ago',
      adaptiveAdjustment: 'Maintained Easy difficulty for baseline strengthening',
    },
  ]);
  const [adaptiveCycleStep, setAdaptiveCycleStep] = useState<number>(2); // currently at Gap Analysis
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addQuizResult = (result: QuizResult) => {
    setQuizHistory(prev => [result, ...prev]);
    // update student stats
    setStudent(prev => ({
      ...prev,
      assessmentsCompleted: prev.assessmentsCompleted + 1,
      overallMastery: Math.min(100, Math.round((prev.overallMastery * 5 + result.score) / 6)),
    }));
    showToast(`Assessment submitted! Score: ${result.score}% (Adaptive Difficulty: ${result.difficultyAchieved})`);
  };

  const updateTopicProficiency = (topicId: string, scoreDelta: number) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const newScore = Math.max(0, Math.min(100, t.proficiencyScore + scoreDelta));
        let newStatus = t.status;
        let newDiff = t.recommendedDifficulty;

        if (newScore >= 80) {
          newStatus = 'mastered';
          newDiff = 'hard';
        } else if (newScore >= 60) {
          newStatus = 'improving';
          newDiff = 'medium';
        } else if (newScore >= 45) {
          newStatus = 'weak';
          newDiff = 'easy';
        } else {
          newStatus = 'critical';
          newDiff = 'easy';
        }

        return {
          ...t,
          proficiencyScore: newScore,
          status: newStatus,
          recommendedDifficulty: newDiff,
          lastAssessed: 'Just now',
        };
      }
      return t;
    }));

    // also update student overall mastery
    setStudent(prev => {
      const remainingWeak = topics.filter(t => t.id === topicId ? (t.proficiencyScore + scoreDelta < 60) : (t.proficiencyScore < 60)).length;
      return {
        ...prev,
        weakTopicsCount: remainingWeak,
        overallMastery: Math.min(100, prev.overallMastery + Math.round(scoreDelta / 3)),
      };
    });
  };

  const submitCodeExplanation = (submissionData: Omit<CodeExplanationSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: CodeExplanationSubmission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      submittedAt: 'Just now',
      status: 'pending',
    };
    setSubmissions(prev => [newSub, ...prev]);
    setStudent(prev => ({
      ...prev,
      codingChallengesCompleted: prev.codingChallengesCompleted + 1,
    }));
    showToast('Code explanation successfully submitted to the Evaluator Queue!');
  };

  const evaluateSubmission = (
    id: string, 
    rubric: { clarity: number; efficiency: number; edgeCases: number; total: number }, 
    feedback: string
  ) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          status: 'evaluated',
          rubricScores: rubric,
          evaluatorFeedback: feedback,
          evaluatorName: 'Marcus Vance (Evaluator)',
          evaluatedAt: 'Just now',
        };
      }
      return sub;
    }));
    showToast(`Submission evaluated! Final Rubric Score: ${rubric.total}/100.`);
  };

  const resetDemoData = () => {
    setStudent(mockStudent);
    setTopics(mockTopics);
    setSubmissions(mockSubmissions);
    setCohortStudents(mockCohortStudents);
    setAdaptiveCycleStep(2);
    showToast('Demo environment reset to baseline state.');
  };

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      student,
      topics,
      submissions,
      cohortStudents,
      quizHistory,
      adaptiveCycleStep,
      setAdaptiveCycleStep,
      addQuizResult,
      submitCodeExplanation,
      evaluateSubmission,
      updateTopicProficiency,
      resetDemoData,
      toastMessage,
      showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
