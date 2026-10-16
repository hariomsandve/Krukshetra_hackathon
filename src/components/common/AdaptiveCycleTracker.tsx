import React from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Sparkles, 
  RotateCw, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdaptiveCycleTracker: React.FC = () => {
  const { adaptiveCycleStep, setAdaptiveCycleStep } = useApp();

  const steps = [
    {
      num: 1,
      name: 'Assess',
      tagline: 'Adaptive Diagnostic',
      desc: 'Baseline quiz adjusts question difficulty to student level',
      icon: ClipboardCheck,
    },
    {
      num: 2,
      name: 'Identify Gaps',
      tagline: 'Weakness Detection',
      desc: 'Pinpoints specific sub-topics below 60% threshold',
      icon: Search,
    },
    {
      num: 3,
      name: 'Recommend Practice',
      tagline: 'Scaffolded Interventions',
      desc: 'Provides easier remedial modules & guided code drills',
      icon: Sparkles,
    },
    {
      num: 4,
      name: 'Reassess',
      tagline: 'Dynamic Escalation',
      desc: 'Increases problem difficulty as correct answers stream in',
      icon: RotateCw,
    },
    {
      num: 5,
      name: 'Track Improvement',
      tagline: 'Mastery Delta',
      desc: 'Calculates net proficiency gains & updates evaluator logs',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-5 mb-6 overflow-hidden relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700">
              Core Differentiator
            </span>
            <span className="text-xs text-slate-500">Live 5-Stage Adaptive Loop</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            Complete Adaptive Learning Cycle
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Click step to simulate cycle state:</span>
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            {steps.map(s => (
              <button
                key={s.num}
                onClick={() => setAdaptiveCycleStep(s.num)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  adaptiveCycleStep === s.num
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {s.num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Step Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
        {steps.map((step) => {
          const isPassed = step.num < adaptiveCycleStep;
          const isCurrent = step.num === adaptiveCycleStep;
          const Icon = step.icon;

          return (
            <div
              key={step.num}
              onClick={() => setAdaptiveCycleStep(step.num)}
              className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-200 relative ${
                isCurrent
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-200/60'
                  : isPassed
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-200 bg-slate-50/60 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-bold text-slate-400">Step 0{step.num}</span>
              </div>

              <h4 className={`text-sm font-bold ${isCurrent ? 'text-indigo-900' : 'text-slate-800'}`}>
                {step.name}
              </h4>
              <p className="text-[11px] font-semibold text-indigo-600 mt-0.5">
                {step.tagline}
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {step.desc}
              </p>

              {isCurrent && (
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-indigo-700 animate-pulse">
                  <span>Active Engine Phase</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
