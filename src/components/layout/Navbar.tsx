import React from 'react';
import { 
  BrainCircuit, 
  UserCheck, 
  GraduationCap, 
  RotateCcw, 
  Bell, 
  Flame, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { role, setRole, student, resetDemoData, toastMessage, submissions } = useApp();

  const pendingEvaluations = submissions.filter(s => s.status === 'pending').length;

  const roleConfigs: Record<UserRole, { label: string; icon: any; desc: string; user: string; roleTag: string }> = {
    student: {
      label: 'Student View',
      icon: GraduationCap,
      desc: 'Adaptive Practice & Quizzes',
      user: student.name,
      roleTag: 'Learner',
    },
    trainer: {
      label: 'Trainer View',
      icon: UserCheck,
      desc: 'Cohort Analytics & Weak Topics',
      user: 'Dr. Sarah Chen',
      roleTag: 'Cohort Lead',
    },
    evaluator: {
      label: 'Evaluator View',
      icon: ShieldCheck,
      desc: 'Code Rubric & Essay Grading',
      user: 'Marcus Vance',
      roleTag: 'Technical Evaluator',
    },
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & PS Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                  AdaptIQ
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-700 border border-blue-200">
                  PS-2 Hackathon
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Adaptive Learning & Assessment Portal
              </p>
            </div>
          </div>

          {/* Interactive Role Switcher */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider hidden md:inline">
              Persona:
            </span>
            {(['student', 'trainer', 'evaluator'] as UserRole[]).map((r) => {
              const config = roleConfigs[r];
              const Icon = config.icon;
              const isActive = role === r;

              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  title={`Switch to ${config.label} (${config.desc})`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className="hidden sm:inline">{r === 'student' ? 'Student' : r === 'trainer' ? 'Trainer' : 'Evaluator'}</span>
                  {r === 'evaluator' && pendingEvaluations > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {pendingEvaluations}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & Active Profile */}
          <div className="flex items-center gap-3">
            {role === 'student' && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/70 rounded-lg text-amber-800 text-xs font-semibold">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{student.streakDays}-Day Streak</span>
              </div>
            )}

            {/* Reset Demo button for Judges */}
            <button
              onClick={resetDemoData}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors border border-slate-200"
              title="Reset simulation data to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Demo</span>
            </button>

            {/* Profile pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden flex items-center justify-center text-indigo-700 font-bold text-xs">
                {role === 'student' ? (
                  <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                ) : role === 'trainer' ? (
                  'SC'
                ) : (
                  'MV'
                )}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {roleConfigs[role].user}
                </p>
                <p className="text-[10px] font-semibold text-indigo-600">
                  {roleConfigs[role].roleTag}
                </p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-bounce text-xs font-medium max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
