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
      <div className="p-4 sm:p-6 max-w-4xl mx-auto text-neutral-900 select-none">
        {/* Quiz Nav Bar */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#dedcd5] hover:bg-[#edebe5] text-neutral-700 bg-white shadow-2xs mb-2 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Assessments</span>
            </button>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">{activeQuiz.title}</h2>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900 shadow-2xs">
            <Clock size={14} className="text-purple-700" />
            <span>Time Left: 14:20</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-6">
          {questions.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentQuestionIdx(idx)}
              className={`flex-1 h-1.5 rounded-full cursor-pointer transition-all ${
                selectedAnswers[idx] !== undefined
                  ? 'bg-neutral-900'
                  : idx === currentQuestionIdx
                  ? 'bg-purple-600'
                  : 'bg-[#dedcd5]'
              }`}
            />
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-6 sm:p-8 shadow-xs mb-6 space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
              Question {currentQuestionIdx + 1} of {questions.length} • Difficulty: {q.difficulty}
            </span>
            {q.tags && (
              <span className="text-xs font-medium text-neutral-500 bg-[#faf9f5] border border-[#ecebe7] px-2 py-0.5 rounded-md">
                {q.tags.join(', ')}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-relaxed">
            {q.question}
          </h3>

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            {q.options.map((opt) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === opt.id;
              const isCorrect = isSubmitted && opt.id === q.correctOptionId;
              const isWrong = isSubmitted && isSelected && !isCorrect;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`flex items-center gap-3.5 p-3.5 px-4 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                      : isWrong
                      ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold'
                      : isSelected
                      ? 'bg-purple-50 border-purple-400 text-purple-950 font-bold shadow-2xs'
                      : 'bg-[#faf9f5] border-[#dedcd5] text-neutral-800 hover:bg-white hover:border-neutral-900'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isWrong
                        ? 'bg-rose-600 text-white'
                        : isSelected
                        ? 'bg-purple-700 text-white'
                        : 'bg-white border border-[#dedcd5] text-neutral-700'
                    }`}
                  >
                    {opt.id.toUpperCase()}
                  </span>
                  <span className="leading-normal">{opt.text}</span>
                </div>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isSubmitted && q.explanation && (
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 leading-relaxed">
              <strong className="text-purple-900 font-bold">MentOS AI Pedagogical Explanation:</strong> {q.explanation}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIdx === 0}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border border-[#dedcd5] bg-white text-neutral-700 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentQuestionIdx === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#edebe5]'
            }`}
          >
            <ArrowLeft size={14} /> Previous
          </button>

          {!isSubmitted ? (
            currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                Submit Assessment ({Object.keys(selectedAnswers).length}/{questions.length})
              </button>
            )
          ) : (
            <button
              onClick={() => handleStartQuiz(activeQuiz)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#dedcd5] hover:bg-[#edebe5] text-neutral-800 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw size={14} /> Retake Assessment
            </button>
          )}
        </div>

        {/* Score Modal if Submitted */}
        {scoreResult && (
          <div
            className={`mt-6 p-6 rounded-2xl bg-white border text-center shadow-sm space-y-3 ${
              scoreResult.percentage >= 70 ? 'border-emerald-300' : 'border-amber-300'
            }`}
          >
            <Award size={36} className={`mx-auto ${scoreResult.percentage >= 70 ? 'text-emerald-600' : 'text-amber-600'}`} />
            <h3 className="text-xl font-extrabold text-neutral-900">
              Assessment Complete: {scoreResult.percentage}% Score
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
              You answered {scoreResult.correct} of {scoreResult.total} questions correctly. Your mastery telemetry has been updated!
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white shadow-2xs cursor-pointer transition-colors"
              >
                View Updated Dashboard
              </button>
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#dedcd5] hover:bg-[#edebe5] bg-white text-neutral-800 shadow-2xs cursor-pointer transition-colors"
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
    <div className="p-4 sm:p-8 max-w-6xl mx-auto text-neutral-900 select-none">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-1">
          Practice & Diagnostic Assessments
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600">
          Benchmark your algorithmic mastery and reinforce weak knowledge spots identified by the MentOS cognitive engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {availableQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            onClick={() => handleStartQuiz(quiz)}
            className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-neutral-900 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-md">
                  {quiz.difficulty}
                </span>
                <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                  <Clock size={12} /> {quiz.timeLimitMinutes} mins
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900 mb-2 group-hover:text-purple-800 transition-colors">
                {quiz.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {quiz.description}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#ecebe7]">
              <span className="text-[11px] text-neutral-500 font-medium">
                {quiz.questionsCount} Multiple Choice Questions
              </span>
              <button
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Start</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Past Assessment History */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-0.5">
              Past Assessment Submissions & Diagnostic Scores
            </h3>
            <p className="text-xs text-neutral-500">
              Historical attempts recorded by the MentOS cognitive engine:
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-[#dedcd5] text-neutral-600">
            {mockData.assessmentHistory?.length || 0} Submissions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockData.assessmentHistory?.map((attempt) => {
            const isHigh = attempt.scorePercent >= 75;
            const isMed = attempt.scorePercent >= 50 && attempt.scorePercent < 75;
            const scoreColor = isHigh ? 'text-emerald-700' : isMed ? 'text-amber-700' : 'text-rose-700';
            const badgeBg = isHigh ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : isMed ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200';

            return (
              <div
                key={attempt.id}
                className="bg-white border border-[#e5e3dc] rounded-2xl p-4 shadow-xs flex justify-between items-center"
              >
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-1">
                    {attempt.title}
                  </h4>
                  <div className="flex gap-2 text-[11px] text-neutral-500">
                    <span>{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{attempt.correctCount}/{attempt.totalCount} correct</span>
                    <span>•</span>
                    <span>{attempt.durationMinutes}m</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xl font-extrabold ${scoreColor}`}>
                    {attempt.scorePercent}%
                  </span>
                  <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-0.5 ${badgeBg}`}>
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
