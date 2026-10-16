import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Sparkles, 
  RotateCw, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  AlertCircle,
  BarChart,
  RefreshCw,
  Code
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';

export const AdaptiveLearningPage: React.FC = () => {
  const { adaptiveCycleStep, setAdaptiveCycleStep, updateTopicProficiency, showToast } = useApp();
  const [isSimulatingReassessment, setIsSimulatingReassessment] = useState(false);
  const [reassessmentCompleted, setReassessmentCompleted] = useState(false);

  const handleSimulateCycle = () => {
    setIsSimulatingReassessment(true);
    setAdaptiveCycleStep(4);
    setTimeout(() => {
      setIsSimulatingReassessment(false);
      setReassessmentCompleted(true);
      setAdaptiveCycleStep(5);
      updateTopicProficiency('top-1', 34); // Boost Dynamic Programming from 42 to 76
      showToast('Cycle completed! Dynamic Programming proficiency elevated to 76% (Improving).');
    }, 1800);
  };

  const stepsInfo = [
    {
      step: 1,
      title: 'Initial Adaptive Assessment',
      subtitle: 'Diagnostics with dynamic branching',
      badge: 'Step 01',
      details: 'Student was served an initial diagnostic across 6 algorithmic and architectural domains. As incorrect answers were registered on state transitions, question complexity scaled down to identify foundation boundaries.',
      metricLabel: 'Diagnostic Result',
      metricVal: '42% on Dynamic Programming',
      status: 'completed',
    },
    {
      step: 2,
      title: 'Knowledge Gap Identification',
      subtitle: 'Isolating specific sub-concept breakdowns',
      badge: 'Step 02',
      details: 'The portal identified that basic recursion logic was understood, but overlapping subproblem caching and bottom-up tabulation presented major hurdles.',
      metricLabel: 'Flagged Deficit',
      metricVal: 'Tabulation & Memory Constraints',
      status: 'completed',
    },
    {
      step: 3,
      title: 'Scaffolded Remedial Practice',
      subtitle: 'Personalized non-intimidating drills',
      badge: 'Step 03',
      details: 'Instead of serving complex 2D Knapsack problems, the platform automatically assigned targeted 1D memoization drills (Climbing Stairs, Fibonacci) with guided hints and step-by-step explanations.',
      metricLabel: 'Practice Assigned',
      metricVal: '1D State Reduction Drills',
      status: 'active',
    },
    {
      step: 4,
      title: 'Adaptive Reassessment',
      subtitle: 'Dynamic difficulty escalation',
      badge: 'Step 04',
      details: 'Re-evaluates learner on the target topic. When student answers early questions correctly, the engine escalates questions from Easy to Medium and unlocks Hard challenges.',
      metricLabel: 'Target Difficulty',
      metricVal: 'Dynamic: Scales with Accuracy',
      status: reassessmentCompleted ? 'completed' : 'pending',
    },
    {
      step: 5,
      title: 'Track Measurable Improvement',
      subtitle: 'Closing the loop & logging evidence',
      badge: 'Step 05',
      details: 'Quantifies net mastery gain (+34%), updates trainer dashboard alert status from Critical to On Track, and records proof of understanding in the Evaluator logs.',
      metricLabel: 'Mastery Shift',
      metricVal: '+34% Proficiency Delta',
      status: reassessmentCompleted ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Adaptive Learning Cycle Engine"
        subtitle="Demonstrating the full 5-stage loop: Assess → Identify Gaps → Recommend Practice → Reassess → Track Improvement"
        badgeText="Core Differentiator"
        badgeVariant="success"
      >
        <button
          onClick={handleSimulateCycle}
          disabled={isSimulatingReassessment}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all shadow-indigo-500/20 disabled:opacity-50"
        >
          {isSimulatingReassessment ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Simulating Reassessment...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Reassessment Loop</span>
            </>
          )}
        </button>
      </PageHeader>

      {/* Hero Banner Explaining the Algorithmic Differentiation */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Problem Statement PS-2 Solution Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            How AdaptIQ Solves the "One-Size-Fits-All" Limitation
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-2 leading-relaxed">
            Conventional platforms give static question sheets. When a learner fails, they are left discouraged. AdaptIQ dynamically intercepts deficits, scaffolds remedial modules, and re-tests dynamically—empowering both trainers and evaluators with concrete learning telemetry.
          </p>

          <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-indigo-200">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Adaptive Difficulty Branching
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Explain-Your-Code Proofs
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Automated Evaluator Rubrics
            </span>
          </div>
        </div>
      </div>

      {/* 5-Stage Stepper Breakdown */}
      <div className="space-y-4">
        {stepsInfo.map((s) => {
          const isCurrent = adaptiveCycleStep === s.step;
          const isDone = s.step < adaptiveCycleStep || (s.step <= 5 && reassessmentCompleted);

          return (
            <div
              key={s.step}
              onClick={() => setAdaptiveCycleStep(s.step)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-200/70'
                  : isDone
                  ? 'bg-white border-emerald-200 shadow-xs'
                  : 'bg-white/80 border-slate-200 opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : `0${s.step}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {s.badge}
                      </span>
                      {isCurrent && (
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 animate-pulse">
                          Active Phase
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">{s.subtitle}</p>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">{s.details}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 min-w-[200px] text-right md:text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {s.metricLabel}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 mt-0.5 block">
                    {s.metricVal}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Case Study: Dynamic Programming Improvement Delta */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Live Telemetry Comparison: Dynamic Programming & Memoization
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Comparing baseline assessment vs post-remedial reassessment results
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Baseline Diagnostic */}
          <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-rose-700">Before Intervention</span>
              <Badge variant="critical">Proficiency: 42%</Badge>
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Initial Diagnostic Attempt</h4>
            <ProgressBar value={42} colorScheme="rose" height="h-2" className="mb-4" />
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-1.5 text-rose-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Struggled on memo table indexing & recurrence formulation
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                • Questions attempted: 5 (2/5 Correct)
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                • Max difficulty reached: Easy only
              </li>
            </ul>
          </div>

          {/* Post Remedial Reassessment */}
          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-emerald-700">After Adaptive Practice</span>
              <Badge variant="mastered">
                {reassessmentCompleted ? 'Proficiency: 76%' : 'Target: 76%+'}
              </Badge>
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Post-Remedial Evaluation</h4>
            <ProgressBar 
              value={reassessmentCompleted ? 76 : 55} 
              colorScheme="emerald" 
              height="h-2" 
              className="mb-4" 
            />
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Mastered 1D sliding window DP & O(1) space optimization
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                • Net Improvement: <span className="font-bold text-emerald-600">+34% Score Gain</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                • Max difficulty reached: Escalated to Medium / Hard
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
