import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  RotateCw, 
  ClipboardCheck, 
  Code2, 
  FileText, 
  BarChart3, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Award,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { role, submissions, topics } = useApp();

  const weakTopicsCount = topics.filter(t => t.proficiencyScore < 60).length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

  const studentLinks = [
    { to: '/', label: 'Student Dashboard', icon: LayoutDashboard },
    { to: '/adaptive-cycle', label: 'Adaptive Cycle Loop', icon: RotateCw, badge: '5-Stage', badgeColor: 'bg-indigo-100 text-indigo-700' },
    { to: '/assessments', label: 'Adaptive Quizzes', icon: ClipboardCheck },
    { to: '/coding-challenges', label: 'Coding Challenges', icon: Code2 },
    { to: '/explain-code', label: 'Explain Your Code', icon: FileText, badge: 'Rubric AI', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { to: '/analytics', label: 'Topic Analytics', icon: BarChart3 },
  ];

  const trainerLinks = [
    { to: '/trainer', label: 'Trainer Overview', icon: Users },
    { to: '/trainer/cohorts', label: 'Cohort Weak Topics', icon: Layers, badge: `${weakTopicsCount} gaps`, badgeColor: 'bg-rose-100 text-rose-700' },
    { to: '/trainer/courses', label: 'Curriculum & Courses', icon: BookOpen },
    { to: '/analytics', label: 'Performance Analytics', icon: BarChart3 },
  ];

  const evaluatorLinks = [
    { to: '/evaluator', label: 'Evaluation Queue', icon: ShieldCheck, badge: `${pendingSubmissions} new`, badgeColor: 'bg-amber-100 text-amber-800' },
    { to: '/evaluator/history', label: 'Assessed Archive', icon: Award },
    { to: '/explain-code', label: 'Student Explanation View', icon: FileText },
    { to: '/analytics', label: 'Assessment Audit', icon: BarChart3 },
  ];

  const activeLinks = role === 'student' ? studentLinks : role === 'trainer' ? trainerLinks : evaluatorLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col justify-between min-h-[calc(100vh-65px)]">
      <div className="p-4 space-y-6">
        
        {/* Role Badge Indicator */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Portal
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
              role === 'student' ? 'bg-indigo-100 text-indigo-700' :
              role === 'trainer' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {role}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-700 mt-1">
            {role === 'student' ? 'Personalized Learning Engine' :
             role === 'trainer' ? 'Cohort Tracking & Guidance' :
             'Code & Explanation Grading'}
          </p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Navigation Menu
          </p>
          {activeLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/' || item.to === '/trainer' || item.to === '/evaluator'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50/80 text-indigo-700 border border-indigo-200/80 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-700" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Simulated Hackathon Status Box */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 rounded-xl p-3 border border-indigo-100/80">
          <div className="flex items-center gap-1.5 text-indigo-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulated Engine</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
            Dynamic difficulty adjustments, diagnostic gaps, and rubric scoring are simulated for hackathon evaluation.
          </p>
        </div>
      </div>
    </aside>
  );
};
