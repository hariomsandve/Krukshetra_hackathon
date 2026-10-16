import React, { useState } from 'react';
import { 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  Clock, 
  Trophy, 
  Sparkles,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { mockAssessments } from '../../data/mockData';
import { Assessment, AssessmentQuestion, DifficultyLevel } from '../../types';

export const AssessmentsPage: React.FC = () => {
  const { addQuizResult, updateTopicProficiency } = useApp();
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  
  // Quiz running states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('easy');
  const [adaptiveNotes, setAdaptiveNotes] = useState<string[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const startQuiz = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setCorrectAnswersCount(0);
    setCurrentDifficulty(assessment.difficulty);
    setAdaptiveNotes(['Baseline started at Easy level to verify fundamentals.']);
    setIsQuizCompleted(false);
  };

  const handleOptionSelect = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !selectedAssessment) return;
    setIsAnswerSubmitted(true);

    const question = selectedAssessment.questions[currentQuestionIndex];
    const isCorrect = selectedOption === question.correctAnswer;

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      // Adapt difficulty up if correct
      if (currentDifficulty === 'easy') {
        setCurrentDifficulty('medium');
        setAdaptiveNotes(prev => [...prev, `Q${currentQuestionIndex + 1} Correct: Escalated difficulty from Easy → Medium`]);
      } else if (currentDifficulty === 'medium') {
        setCurrentDifficulty('hard');
        setAdaptiveNotes(prev => [...prev, `Q${currentQuestionIndex + 1} Correct: Escalated difficulty from Medium → Hard`]);
      }
    } else {
      // Branch down if wrong
      if (currentDifficulty === 'hard') {
        setCurrentDifficulty('medium');
        setAdaptiveNotes(prev => [...prev, `Q${currentQuestionIndex + 1} Incorrect: Adjusted difficulty from Hard → Medium for reinforcement`]);
      } else if (currentDifficulty === 'medium') {
        setCurrentDifficulty('easy');
        setAdaptiveNotes(prev => [...prev, `Q${currentQuestionIndex + 1} Incorrect: Stepped down to Easy to reinforce foundational logic`]);
      }
    }
  };

  const handleNextQuestion = () => {
    if (!selectedAssessment) return;

    if (currentQuestionIndex + 1 < selectedAssessment.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      // Quiz Finished!
      const totalQ = selectedAssessment.questions.length;
      const score = Math.round((correctAnswersCount / totalQ) * 100);
      
      addQuizResult({
        assessmentId: selectedAssessment.id,
        topicName: selectedAssessment.topicName,
        score,
        totalQuestions: totalQ,
        correctCount: correctAnswersCount,
        accuracy: score,
        difficultyAchieved: currentDifficulty,
        timestamp: 'Just now',
        adaptiveAdjustment: `Achieved ${currentDifficulty.toUpperCase()} tier with ${correctAnswersCount}/${totalQ} correct`,
      });

      // Update topic proficiency delta
      const delta = score >= 80 ? 15 : score >= 50 ? 8 : -5;
      updateTopicProficiency(selectedAssessment.topicId, delta);

      setIsQuizCompleted(true);
    }
  };

  // 1. Quizzes Directory View
  if (!selectedAssessment) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Adaptive Assessments & Diagnostic Quizzes"
          subtitle="Real-time difficulty adjustment: questions automatically adapt to your answers to accurately map knowledge boundaries."
          badgeText="Self-Adjusting Engine"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAssessments.map((asmt) => (
            <div
              key={asmt.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="primary" size="sm">
                    {asmt.topicName}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    ~{asmt.estimatedMinutes} mins
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {asmt.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Evaluates optimal substructure, tabulation constraints, and recurrence relations with dynamic difficulty branching.
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
                    <span className="font-bold text-slate-800">{asmt.questionsCount} Adaptive</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Branching</span>
                    <span className="font-bold text-indigo-700">Easy ↔ Medium ↔ Hard</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Feedback</span>
                    <span className="font-bold text-emerald-700">Instant Explanations</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Self-Paced Diagnostic
                </span>
                <button
                  onClick={() => startQuiz(asmt)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-500/20 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Score Summary Report Screen
  if (isQuizCompleted) {
    const finalScore = Math.round((correctAnswersCount / selectedAssessment.questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6 py-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Assessment Complete
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            {selectedAssessment.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Adaptive engine results & proficiency adjustments calculated
          </p>

          <div className="grid grid-cols-3 gap-3 my-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Final Score</span>
              <span className={`text-2xl font-black ${finalScore >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {finalScore}%
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="text-2xl font-black text-slate-800">
                {correctAnswersCount}/{selectedAssessment.questions.length}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Difficulty Reached</span>
              <span className="text-lg font-black text-indigo-700 uppercase mt-1 block">
                {currentDifficulty}
              </span>
            </div>
          </div>

          {/* Adaptive Engine Telemetry Log */}
          <div className="text-left bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 mb-6">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Adaptive Adjustment Trace
            </h4>
            <div className="space-y-1.5">
              {adaptiveNotes.map((note, idx) => (
                <div key={idx} className="text-xs text-indigo-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setSelectedAssessment(null)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
            >
              Back to Assessments
            </button>
            <button
              onClick={() => startQuiz(selectedAssessment)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Active Quiz Question View
  const question: AssessmentQuestion = selectedAssessment.questions[currentQuestionIndex];
  const totalQuestions = selectedAssessment.questions.length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Top bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <Badge variant={currentDifficulty} size="sm">
              Adaptive Level: {currentDifficulty.toUpperCase()}
            </Badge>
          </div>
          <h2 className="text-sm font-bold text-slate-800 mt-0.5 line-clamp-1">
            {selectedAssessment.title}
          </h2>
        </div>

        <button
          onClick={() => setSelectedAssessment(null)}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 self-end sm:self-center"
        >
          Exit Assessment
        </button>
      </div>

      <ProgressBar value={progressPercent} height="h-1.5" />

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            {question.topicName}
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            {question.question}
          </h3>
        </div>

        {/* Optional Code Snippet */}
        {question.codeSnippet && (
          <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
            <pre>{question.codeSnippet}</pre>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctAnswer;
            
            let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
            
            if (isAnswerSubmitted) {
              if (isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-300';
              } else if (isSelected) {
                btnStyle = 'border-rose-500 bg-rose-50/70 text-rose-900 ring-2 ring-rose-300';
              } else {
                btnStyle = 'border-slate-200 opacity-60';
              }
            } else if (isSelected) {
              btnStyle = 'border-indigo-600 bg-indigo-50/60 text-indigo-900 ring-2 ring-indigo-200';
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswerSubmitted}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
              >
                <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-snug">{option}</span>
                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Hint Accordion */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
          </button>
          {showHint && (
            <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
              {question.hint}
            </div>
          )}
        </div>

        {/* Instant Feedback Explanation (shown after submission) */}
        {isAnswerSubmitted && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            selectedOption === question.correctAnswer
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {selectedOption === question.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct! Adaptive Engine registered high comprehension.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Incorrect. Adaptive Engine logged this sub-concept for review.</span>
                </>
              )}
            </div>
            <p className="mt-1">{question.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-500/20 disabled:opacity-40 transition-all"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>{currentQuestionIndex + 1 < totalQuestions ? 'Next Adaptive Question' : 'Complete Assessment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
