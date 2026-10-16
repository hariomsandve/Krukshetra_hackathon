import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export const AssessmentRunner = ({ onFinishAssessment, onNavigate }) => {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const availableQuizzes = [
    {
      id: "quiz-dsa-1",
      title: "Prerequisite Quiz: Pointers & References",
      questionsCount: 4,
      timeLimitMinutes: 15,
      status: "available",
      difficulty: "beginner",
      description: "Assess understanding of memory addresses, pointer dereferencing, and sentinel pointers."
    },
    {
      id: "quiz-dsa-2",
      title: "Mid-Term Diagnostic: Trees & Recursive BSTs",
      questionsCount: 4,
      timeLimitMinutes: 20,
      status: "available",
      difficulty: "intermediate",
      description: "Diagnostic assessment measuring left/right BST invariants and recursive tree traversal bounds."
    },
    {
      id: "quiz-dsa-3",
      title: "Advanced Mastery: DAGs & Topological Sorting",
      questionsCount: 4,
      timeLimitMinutes: 25,
      status: "locked",
      difficulty: "advanced",
      description: "Prerequisite-locked: Unlocks after completing BST and DAG cycle detection challenges."
    }
  ];

  const sampleQuestions = [
    {
      id: "q1",
      question: "What is the worst-case time complexity of searching in a completely unbalanced Binary Search Tree (skewed tree)?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctIdx: 2
    },
    {
      id: "q2",
      question: "Which tree traversal order visits nodes in strictly ascending key order for any valid BST?",
      options: ["Pre-order (Root-Left-Right)", "In-order (Left-Root-Right)", "Post-order (Left-Right-Root)", "Level-order (BFS)"],
      correctIdx: 1
    },
    {
      id: "q3",
      question: "In 3-color DFS cycle detection on a directed graph, what does encountering a GRAY node indicate?",
      options: [
        "The node has zero outbound prerequisites",
        "A back-edge has been discovered (circular prerequisite cycle detected)",
        "The node has already finished processing all descendants",
        "The node is disconnected from the root"
      ],
      correctIdx: 1
    },
    {
      id: "q4",
      question: "What is the in-degree of a foundational prerequisite concept in a DAG?",
      options: ["0 (Zero inbound prerequisites)", "1", "Equal to total concepts in course", "Infinite"],
      correctIdx: 0
    }
  ];

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
  };

  const handleSelectOption = (optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIdx
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    sampleQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIdx) {
        correctCount += 1;
      }
    });
    const percentage = Math.round((correctCount / sampleQuestions.length) * 100);
    setScoreResult({
      total: sampleQuestions.length,
      correct: correctCount,
      percentage
    });
    setIsSubmitted(true);
  };

  // Render Quiz Taking View
  if (activeQuiz) {
    const q = sampleQuestions[currentQuestionIdx];
    const isAnswered = selectedAnswers[currentQuestionIdx] !== undefined;
    const allAnswered = Object.keys(selectedAnswers).length === sampleQuestions.length;

    return (
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Quiz Nav Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', padding: '4px 8px', marginBottom: '4px' }}
            >
              ← Back to Assessments
            </button>
            <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>{activeQuiz.title}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.04)', fontSize: '0.75rem' }}>
            <Clock size={14} color="#818cf8" />
            <span>Time Left: 18:45</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: 'var(--bg-surface-elevated)', borderRadius: '2px', marginBottom: '24px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${((currentQuestionIdx + 1) / sampleQuestions.length) * 100}%`,
              background: 'var(--accent-primary)',
              transition: 'width 0.2s ease'
            }}
          />
        </div>

        {/* Results Screen */}
        {isSubmitted && scoreResult ? (
          <div className="surface-card" style={{ padding: '32px', textAlign: 'center' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '8px' }}>
              Assessment Evaluated
            </h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: scoreResult.percentage >= 75 ? '#34d399' : '#fbbf24', marginBottom: '8px' }}>
              {scoreResult.percentage}%
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              You answered {scoreResult.correct} of {scoreResult.total} questions correctly. Mastery signals have been forwarded to the adaptive engine.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => {
                  setActiveQuiz(null);
                  if (onFinishAssessment) onFinishAssessment(scoreResult);
                }}
                className="btn btn-secondary"
              >
                Back to Assessments
              </button>
              <button
                onClick={() => onNavigate('coding-workspace')}
                className="btn btn-primary"
              >
                Continue to Coding Challenge
              </button>
            </div>
          </div>
        ) : (
          /* Question Card */
          <div className="surface-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Question {currentQuestionIdx + 1} of {sampleQuestions.length}</span>
              <span>Single Choice</span>
            </div>

            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '24px', lineHeight: 1.4 }}>
              {q.question}
            </h3>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {q.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      outline: 'none'
                    }}
                  >
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                        background: isSelected ? 'var(--accent-primary)' : 'transparent',
                        color: isSelected ? '#fff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        flexShrink: 0
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                className="btn btn-secondary"
                style={{ padding: '7px 16px' }}
              >
                <ArrowLeft size={14} /> Previous
              </button>

              {currentQuestionIdx < sampleQuestions.length - 1 ? (
                <button
                  disabled={!isAnswered}
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  className="btn btn-primary"
                  style={{ padding: '7px 18px' }}
                >
                  Next Question <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  disabled={!allAnswered}
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  style={{ padding: '7px 20px', background: '#10b981' }}
                >
                  Submit Assessment
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quiz Listing View
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
          Diagnostic Assessments & Quizzes
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Evaluate your understanding across prerequisite concepts. Results automatically update your concept mastery graph.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {availableQuizzes.map((quiz) => {
          const isLocked = quiz.status === 'locked';

          return (
            <div
              key={quiz.id}
              className="surface-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isLocked ? 0.6 : 1
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className={`badge badge-${quiz.difficulty}`}>
                    {quiz.difficulty}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {quiz.timeLimitMinutes} mins
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '6px' }}>
                  {quiz.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {quiz.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {quiz.questionsCount} Questions
                </span>
                <button
                  disabled={isLocked}
                  onClick={() => handleStartQuiz(quiz)}
                  className={`btn ${isLocked ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                >
                  {isLocked ? 'Prerequisites Required' : 'Start Assessment'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
