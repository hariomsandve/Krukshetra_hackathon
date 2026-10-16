import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';
import { mockData } from '../../data/mockData';

export const AssessmentRunner = ({ onFinishAssessment, onNavigate }) => {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const availableQuizzes = [
    {
      id: "quiz-all-core",
      title: "Mentos Core Diagnostic (DSA, OOP, SQL, HTTP)",
      questionsCount: mockData.practiceQuestions.length,
      timeLimitMinutes: 15,
      status: "available",
      difficulty: "mixed",
      description: "Comprehensive diagnostic covering arrays, linked lists, hash collisions, encapsulation, SQL WHERE, and HTTP methods.",
      questions: mockData.practiceQuestions
    },
    {
      id: "quiz-dsa-foundation",
      title: "DSA Foundations: Arrays, Lists & Hash Maps",
      questionsCount: 5,
      timeLimitMinutes: 12,
      status: "available",
      difficulty: "beginner",
      description: "Assess understanding of zero-based indexing, O(1) lookups, pointer references, and hash collisions.",
      questions: mockData.practiceQuestions.filter(q => ['topic-arrays', 'topic-linked-list', 'topic-hashmap'].includes(q.topicId))
    },
    {
      id: "quiz-web-dbms",
      title: "Backend Core: OOP, SQL & REST Protocols",
      questionsCount: 3,
      timeLimitMinutes: 8,
      status: "available",
      difficulty: "intermediate",
      description: "Validate foundational knowledge in object encapsulation, SQL grouping filters, and HTTP verbs.",
      questions: mockData.practiceQuestions.filter(q => ['topic-oop', 'topic-db-sql', 'topic-http'].includes(q.topicId))
    }
  ];

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
  };

  const handleSelectOption = (optionId) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionId
    }));
  };

  const handleSubmit = () => {
    const questions = activeQuiz.questions;
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionId) {
        correctCount += 1;
      }
    });
    const percentage = Math.round((correctCount / questions.length) * 100);
    setScoreResult({
      total: questions.length,
      correct: correctCount,
      percentage
    });
    setIsSubmitted(true);
    if (onFinishAssessment) onFinishAssessment();
  };

  // Render Quiz Taking View
  if (activeQuiz) {
    const questions = activeQuiz.questions;
    const q = questions[currentQuestionIdx];
    const isAnswered = selectedAnswers[currentQuestionIdx] !== undefined;
    const allAnswered = Object.keys(selectedAnswers).length === questions.length;

    return (
      <div style={{ padding: '24px', maxWidth: '820px', margin: '0 auto', color: '#fff' }}>
        {/* Quiz Nav Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px', marginBottom: '8px' }}
            >
              ← Back to Assessments
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{activeQuiz.title}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)', fontSize: '0.75rem', color: '#c4b5fd', fontWeight: 600 }}>
            <Clock size={14} color="#a855f7" />
            <span>Time Left: 14:20</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          {questions.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentQuestionIdx(idx)}
              style={{
                flex: 1,
                height: '5px',
                borderRadius: '4px',
                background: selectedAnswers[idx] !== undefined
                  ? '#a855f7'
                  : idx === currentQuestionIdx
                  ? 'rgba(168, 85, 247, 0.4)'
                  : 'rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            />
          ))}
        </div>

        {/* Question Card */}
        <div className="surface-card" style={{ padding: '28px', marginBottom: '24px', background: 'rgba(16, 22, 38, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.75rem', color: '#c4b5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Question {currentQuestionIdx + 1} of {questions.length} • Difficulty: {q.difficulty}
            </span>
            {q.tags && (
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
                {q.tags.join(', ')}
              </span>
            )}
          </div>

          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '24px', lineHeight: 1.5, fontWeight: 700 }}>
            {q.question}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map((opt) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === opt.id;
              const isCorrect = isSubmitted && opt.id === q.correctOptionId;
              const isWrong = isSubmitted && isSelected && !isCorrect;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: isCorrect
                      ? 'rgba(16, 185, 129, 0.15)'
                      : isWrong
                      ? 'rgba(244, 63, 94, 0.15)'
                      : isSelected
                      ? 'rgba(168, 85, 247, 0.18)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isCorrect
                      ? '1px solid #10b981'
                      : isWrong
                      ? '1px solid #f43f5e'
                      : isSelected
                      ? '1px solid #a855f7'
                      : '1px solid var(--border-subtle)',
                    cursor: isSubmitted ? 'default' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isCorrect
                        ? '#10b981'
                        : isWrong
                        ? '#f43f5e'
                        : isSelected
                        ? '#a855f7'
                        : 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fff',
                      flexShrink: 0
                    }}
                  >
                    {opt.id.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#f1f5f9' }}>{opt.text}</span>
                </div>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isSubmitted && q.explanation && (
            <div
              style={{
                marginTop: '20px',
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                fontSize: '0.8125rem',
                color: '#cbd5e1',
                lineHeight: 1.5
              }}
            >
              <strong style={{ color: '#c4b5fd' }}>Mentos Explanation:</strong> {q.explanation}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIdx === 0}
            className="btn btn-secondary"
            style={{ opacity: currentQuestionIdx === 0 ? 0.5 : 1 }}
          >
            <ArrowLeft size={14} /> Previous
          </button>

          {!isSubmitted ? (
            currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="btn btn-primary"
              >
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                Submit Assessment ({Object.keys(selectedAnswers).length}/{questions.length})
              </button>
            )
          ) : (
            <button
              onClick={() => handleStartQuiz(activeQuiz)}
              className="btn btn-secondary"
            >
              <RotateCcw size={14} /> Retake Assessment
            </button>
          )}
        </div>

        {/* Score Modal if Submitted */}
        {scoreResult && (
          <div
            className="surface-card animate-fade-in"
            style={{
              marginTop: '24px',
              padding: '24px',
              textAlign: 'center',
              border: scoreResult.percentage >= 70 ? '1px solid #10b981' : '1px solid #f59e0b',
              background: 'rgba(16, 22, 38, 0.95)'
            }}
          >
            <Award size={36} color={scoreResult.percentage >= 70 ? '#10b981' : '#f59e0b'} style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              Assessment Complete: {scoreResult.percentage}% Score
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              You answered {scoreResult.correct} of {scoreResult.total} questions correctly. Your mastery telemetry has been updated!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn btn-primary"
              >
                View Updated Dashboard
              </button>
              <button
                onClick={() => setActiveQuiz(null)}
                className="btn btn-secondary"
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quizzes Catalogue List View
  return (
    <div style={{ padding: '28px 32px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
          Practice & Diagnostic Assessments
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Benchmark your algorithmic mastery and reinforce weak knowledge spots identified by the Mentos engine.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {availableQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="surface-card surface-card-interactive"
            onClick={() => handleStartQuiz(quiz)}
            style={{
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'rgba(16, 22, 38, 0.75)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c4b5fd' }}>
                  {quiz.difficulty.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {quiz.timeLimitMinutes} mins
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                {quiz.title}
              </h3>
              <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {quiz.description}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {quiz.questionsCount} Multiple Choice Questions
              </span>
              <button
                className="btn btn-primary"
                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
              >
                Start Quiz <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Past Assessment History */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              Past Assessment Submissions & Diagnostic Scores
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Historical attempts recorded by the Mentos cognitive engine:
            </p>
          </div>
          <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
            {mockData.assessmentHistory?.length || 0} Submissions
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {mockData.assessmentHistory?.map((attempt) => {
            const isHigh = attempt.scorePercent >= 75;
            const isMed = attempt.scorePercent >= 50 && attempt.scorePercent < 75;
            const color = isHigh ? '#10b981' : isMed ? '#f59e0b' : '#ef4444';
            const bg = isHigh ? 'rgba(16, 185, 129, 0.08)' : isMed ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)';
            const border = isHigh ? 'rgba(16, 185, 129, 0.25)' : isMed ? 'rgba(245, 158, 11, 0.25)' : 'rgba(239, 68, 68, 0.25)';

            return (
              <div
                key={attempt.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: bg,
                  border: `1px solid ${border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                    {attempt.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                    <span>{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{attempt.correctCount}/{attempt.totalCount} correct</span>
                    <span>•</span>
                    <span>{attempt.durationMinutes}m</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color }}>
                    {attempt.scorePercent}%
                  </span>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {attempt.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
