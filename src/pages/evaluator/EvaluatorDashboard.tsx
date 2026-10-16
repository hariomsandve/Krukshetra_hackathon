import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  User, 
  Code, 
  Award, 
  Sparkles,
  Sliders,
  Send,
  Eye,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { CodeExplanationSubmission } from '../../types';

export const EvaluatorDashboard: React.FC = () => {
  const { submissions, evaluateSubmission, showToast } = useApp();
  
  const [selectedSubmission, setSelectedSubmission] = useState<CodeExplanationSubmission | null>(
    submissions.find(s => s.status === 'pending') || submissions[0] || null
  );

  // Rubric state for grading
  const [clarityScore, setClarityScore] = useState<number>(27);
  const [efficiencyScore, setEfficiencyScore] = useState<number>(33);
  const [edgeCasesScore, setEdgeCasesScore] = useState<number>(31);
  const [feedbackNotes, setFeedbackNotes] = useState<string>(
    'Well formulated justification. Algorithmic trade-offs between memoized recursion vs iterative tabulation are properly explained.'
  );

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const evaluatedSubmissions = submissions.filter(s => s.status === 'evaluated');

  const totalCalculatedScore = clarityScore + efficiencyScore + edgeCasesScore;

  const handleOpenReview = (sub: CodeExplanationSubmission) => {
    setSelectedSubmission(sub);
    if (sub.rubricScores) {
      setClarityScore(sub.rubricScores.clarity);
      setEfficiencyScore(sub.rubricScores.efficiency);
      setEdgeCasesScore(sub.rubricScores.edgeCases);
      setFeedbackNotes(sub.evaluatorFeedback || '');
    } else {
      setClarityScore(28);
      setEfficiencyScore(32);
      setEdgeCasesScore(30);
      setFeedbackNotes('Evidence of algorithmic understanding is validated.');
    }
  };

  const handleCommitEvaluation = () => {
    if (!selectedSubmission) return;

    evaluateSubmission(
      selectedSubmission.id,
      {
        clarity: clarityScore,
        efficiency: efficiencyScore,
        edgeCases: edgeCasesScore,
        total: totalCalculatedScore,
      },
      feedbackNotes
    );

    // Update local selection to reflect evaluated
    setSelectedSubmission(prev => prev ? {
      ...prev,
      status: 'evaluated',
      rubricScores: {
        clarity: clarityScore,
        efficiency: efficiencyScore,
        edgeCases: edgeCasesScore,
        total: totalCalculatedScore,
      },
      evaluatorFeedback: feedbackNotes,
      evaluatorName: 'Marcus Vance (Evaluator)',
      evaluatedAt: 'Just now',
    } : null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluator Verification & Rubric Portal"
        subtitle="Review qualitative proof of understanding: verify students' written code, explanation essays, and complexity proofs."
        badgeText="Accreditation Queue"
        badgeVariant="warning"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Queue"
          value={`${pendingSubmissions.length} Submissions`}
          subtitle="Awaiting manual / rubric audit"
          icon={Clock}
          accentColor="amber"
        />
        <StatCard
          title="Evaluated Archive"
          value={`${evaluatedSubmissions.length} Records`}
          subtitle="Signed evaluation proofs"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="Avg Rubric Score"
          value="87.5 / 100"
          subtitle="Across Alpha cohort"
          icon={Award}
          accentColor="indigo"
          trend={{ value: '+4.1%', isPositive: true }}
        />
        <StatCard
          title="Integrity Assurance"
          value="100%"
          subtitle="No plagiarism flags detected"
          icon={ShieldCheck}
          accentColor="blue"
        />
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Queue List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Evaluation Submissions Queue
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{submissions.length} Total</span>
          </div>

          <div className="space-y-2.5">
            {submissions.map((sub) => {
              const isSelected = selectedSubmission?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => handleOpenReview(sub)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900">{sub.studentName}</span>
                    <Badge variant={sub.status === 'pending' ? 'warning' : 'success'} size="sm">
                      {sub.status.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="font-semibold text-slate-700 line-clamp-1">{sub.challengeTitle}</p>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <span>{sub.language}</span>
                    {sub.rubricScores ? (
                      <span className="font-extrabold text-emerald-600">
                        Score: {sub.rubricScores.total}/100
                      </span>
                    ) : (
                      <span className="text-amber-600 font-bold">Needs Review</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Submission Inspector & Grading Rubric (8 cols) */}
        {selectedSubmission ? (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
            
            {/* Inspector Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedSubmission.challengeTitle}
                  </h3>
                  <Badge variant={selectedSubmission.status === 'pending' ? 'warning' : 'success'}>
                    {selectedSubmission.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Submitted by <span className="font-bold text-slate-800">{selectedSubmission.studentName}</span> • {selectedSubmission.submittedAt}
                </p>
              </div>

              {selectedSubmission.rubricScores && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">Evaluated Grade</span>
                  <span className="text-xl font-black text-emerald-800">{selectedSubmission.rubricScores.total} / 100</span>
                </div>
              )}
            </div>

            {/* Student's Code Implementation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-600" />
                  Student's Code Solution
                </span>
                <span className="text-xs font-mono text-slate-400">{selectedSubmission.language}</span>
              </div>
              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <pre>{selectedSubmission.submittedCode}</pre>
              </div>
            </div>

            {/* Student's Qualitative Explanation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div>
                <span className="text-[11px] uppercase font-bold text-indigo-700 block mb-1">
                  Algorithmic Approach & Logic Explanation:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {selectedSubmission.approachExplanation}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Time Complexity:</span>
                  <span className="text-xs font-semibold text-slate-800">{selectedSubmission.timeComplexity}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Space Complexity:</span>
                  <span className="text-xs font-semibold text-slate-800">{selectedSubmission.spaceComplexity}</span>
                </div>
              </div>

              {selectedSubmission.edgeCasesConsidered && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Edge Cases:</span>
                  <span className="text-xs text-slate-700">{selectedSubmission.edgeCasesConsidered}</span>
                </div>
              )}
            </div>

            {/* Evaluator Rubric Grading Form */}
            <div className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-indigo-950">
                    Evaluator Rubric Scoring
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">Composite Score: </span>
                  <span className="text-base font-black text-indigo-700">{totalCalculatedScore} / 100</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1">
                    <span>Clarity (0-30)</span>
                    <span className="font-bold text-indigo-700">{clarityScore}</span>
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="30"
                    value={clarityScore}
                    onChange={(e) => setClarityScore(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1">
                    <span>Complexity (0-35)</span>
                    <span className="font-bold text-indigo-700">{efficiencyScore}</span>
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="35"
                    value={efficiencyScore}
                    onChange={(e) => setEfficiencyScore(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1">
                    <span>Edge Cases (0-35)</span>
                    <span className="font-bold text-indigo-700">{edgeCasesScore}</span>
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="35"
                    value={edgeCasesScore}
                    onChange={(e) => setEdgeCasesScore(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Evaluator Feedback & Recommendations:
                </label>
                <textarea
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCommitEvaluation}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {selectedSubmission.status === 'pending' ? 'Approve & Commit Grade' : 'Update Evaluator Grade'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            Select a submission from the queue to start evaluating.
          </div>
        )}

      </div>
    </div>
  );
};
