import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Code, 
  Clock, 
  Database,
  Cpu,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';

export const ExplainCodePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, submitCodeExplanation, setRole, showToast } = useApp();

  const stateData = location.state as {
    challenge?: { id: string; title: string };
    submittedCode?: string;
    language?: string;
  } | undefined;

  const [challengeTitle, setChallengeTitle] = useState(
    stateData?.challenge?.title || 'Climbing Stairs: Minimum Cost & Path Optimization'
  );
  const [submittedCode, setSubmittedCode] = useState(
    stateData?.submittedCode || 
`function minCostClimbingStairs(cost: number[]): number {
  const n = cost.length;
  let prev2 = cost[0];
  let prev1 = cost[1];
  for (let i = 2; i < n; i++) {
    const current = cost[i] + Math.min(prev1, prev2);
    prev2 = prev1;
    prev1 = current;
  }
  return Math.min(prev1, prev2);
}`
  );
  const [approachExplanation, setApproachExplanation] = useState(
    'I adopted a bottom-up Dynamic Programming formulation using constant-space state rotation. Because the subproblem state transition at index i strictly depends on the previous two step totals (dp[i-1] and dp[i-2]), I avoided allocating an O(n) array and simply maintained two scalar variables in memory.'
  );
  const [timeComplexity, setTimeComplexity] = useState(
    'O(n) — single sequential pass over the array from index 2 to n. Each transition takes O(1) time.'
  );
  const [spaceComplexity, setSpaceComplexity] = useState(
    'O(1) — optimal auxiliary memory since only two integer pointers (prev1, prev2) are retained.'
  );
  const [edgeCases, setEdgeCases] = useState(
    'Handled minimal staircase length of n = 2 directly; zero cost values; negative cost prevention.'
  );

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [rubricResult, setRubricResult] = useState<{
    clarity: number;
    efficiency: number;
    edgeCases: number;
    total: number;
    feedback: string;
  } | null>(null);

  const handleSubmitExplanation = () => {
    setIsEvaluating(true);
    
    // Submit to AppContext queue
    submitCodeExplanation({
      studentId: student.id,
      studentName: student.name,
      challengeId: 'ch-1',
      challengeTitle,
      language: stateData?.language || 'TypeScript',
      submittedCode,
      approachExplanation,
      timeComplexity,
      spaceComplexity,
      edgeCasesConsidered: edgeCases,
    });

    // Simulate instant AI rubric evaluation preview
    setTimeout(() => {
      setIsEvaluating(false);
      setRubricResult({
        clarity: 29, // / 30
        efficiency: 34, // / 35
        edgeCases: 32, // / 35
        total: 95,
        feedback: 'Superb articulation of the state compression technique. The mathematical justification for O(1) space complexity is clear and verifiable. Edge case handling is thorough.',
      });
      showToast('Explanation verified! Evaluator queue updated.');
    }, 1200);
  };

  const handleSwitchToEvaluator = () => {
    setRole('evaluator');
    navigate('/evaluator');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Explain Your Code Activity"
        subtitle="Provide qualitative proof of your understanding. Evaluators grade algorithmic reasoning, complexity justification, and edge cases."
        badgeText="Proof of Understanding"
      >
        <button
          onClick={handleSwitchToEvaluator}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Switch to Evaluator Persona</span>
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Target Challenge
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {challengeTitle}
            </h2>
          </div>

          {/* Submitted Code Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-600" />
                Your Implementation
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Read-only code context</span>
            </label>
            <textarea
              value={submittedCode}
              onChange={(e) => setSubmittedCode(e.target.value)}
              rows={6}
              className="w-full bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-xs focus:outline-none border border-slate-800"
            />
          </div>

          {/* 1. Algorithmic Approach Explanation */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              1. Algorithmic Approach & Design Rationale
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Explain why you selected this paradigm (e.g. Memoization, Sliding Window, Greedy) and how your solution progresses.
            </p>
            <textarea
              value={approachExplanation}
              onChange={(e) => setApproachExplanation(e.target.value)}
              rows={4}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          {/* 2 & 3. Complexity Derivations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                2. Time Complexity
              </label>
              <textarea
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                rows={3}
                placeholder="e.g. O(n) because each element is visited once"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                3. Space Complexity
              </label>
              <textarea
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                rows={3}
                placeholder="e.g. O(1) auxiliary memory used"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              />
            </div>
          </div>

          {/* 4. Edge Cases */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              4. Edge Cases & Boundary Conditions Considered
            </label>
            <textarea
              value={edgeCases}
              onChange={(e) => setEdgeCases(e.target.value)}
              rows={2}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={handleSubmitExplanation}
              disabled={isEvaluating}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              {isEvaluating ? (
                <span>Generating Rubric Evaluation...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Explanation for Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Instant Rubric & Evaluator Criteria (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Rubric Criteria Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Evaluation Rubric Standards
              </h3>
              <Badge variant="primary" size="sm">
                100 Total Points
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                  <span>Algorithmic Clarity</span>
                  <span className="text-indigo-600">30 pts</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Precision in articulating why the approach was chosen and the step transitions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                  <span>Time & Space Proof</span>
                  <span className="text-indigo-600">35 pts</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Mathematical rigor in deriving asymptotic time/space bounds.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                  <span>Edge Case Robustness</span>
                  <span className="text-indigo-600">35 pts</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Identification of boundary constraints, empty states, and off-by-one hazards.
                </p>
              </div>
            </div>
          </div>

          {/* Rubric Evaluation Results Card (Live feedback) */}
          {rubricResult && (
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-lg space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-200">
                    Rubric Assessment
                  </span>
                </div>
                <span className="text-xl font-black text-emerald-400">
                  {rubricResult.total}/100
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-indigo-200 mb-1">
                    <span>Clarity & Rationale</span>
                    <span className="font-bold text-white">{rubricResult.clarity} / 30</span>
                  </div>
                  <ProgressBar value={(rubricResult.clarity / 30) * 100} colorScheme="emerald" height="h-1" />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-indigo-200 mb-1">
                    <span>Complexity Proof</span>
                    <span className="font-bold text-white">{rubricResult.efficiency} / 35</span>
                  </div>
                  <ProgressBar value={(rubricResult.efficiency / 35) * 100} colorScheme="emerald" height="h-1" />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-indigo-200 mb-1">
                    <span>Edge Cases</span>
                    <span className="font-bold text-white">{rubricResult.edgeCases} / 35</span>
                  </div>
                  <ProgressBar value={(rubricResult.edgeCases / 35) * 100} colorScheme="emerald" height="h-1" />
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl text-xs text-indigo-100 border border-white/10">
                <span className="font-bold text-amber-300 block mb-0.5">Evaluator Feedback:</span>
                <p className="text-[11px] leading-relaxed">{rubricResult.feedback}</p>
              </div>

              <button
                onClick={handleSwitchToEvaluator}
                className="w-full py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-700" />
                <span>Open Evaluator Queue to Review This</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
