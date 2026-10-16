import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Send, 
  CheckCircle2, 
  Search, 
  Filter,
  GraduationCap,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { mockCourses } from '../../data/mockData';
import { CohortStudent } from '../../types';

export const TrainerDashboard: React.FC = () => {
  const { cohortStudents, topics, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<CohortStudent | null>(null);

  const filteredStudents = cohortStudents.filter(student => {
    const matchesFilter = filterStatus === 'all' || student.status.toLowerCase().replace(' ', '-') === filterStatus;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAssignRemedial = (studentName: string, topicName: string) => {
    showToast(`Assigned adaptive remedial drill on "${topicName}" to ${studentName}.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainer Command Center"
        subtitle="Monitor cohort learning telemetry, isolate systemic knowledge gaps, and assign automated adaptive interventions."
        badgeText="Cohort Alpha Fall 2026"
      >
        <button
          onClick={() => showToast('New adaptive curriculum module published.')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Course Module</span>
        </button>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Learners"
          value="142"
          subtitle="Enrolled in Alpha Cohort"
          icon={Users}
          accentColor="indigo"
          trend={{ value: '+12 this week', isPositive: true }}
        />
        <StatCard
          title="Cohort Mastery"
          value="72.4%"
          subtitle="Median assessment accuracy"
          icon={TrendingUp}
          accentColor="emerald"
          trend={{ value: '+5.2%', isPositive: true }}
        />
        <StatCard
          title="Interventions Needed"
          value="2 Students"
          subtitle="Flagged by gap detector"
          icon={AlertTriangle}
          accentColor="rose"
        />
        <StatCard
          title="Curriculum Modules"
          value="44 Total"
          subtitle="Across 4 active tracks"
          icon={BookOpen}
          accentColor="blue"
        />
      </div>

      {/* 2 Column Layout: Cohort Weakness Distribution + Student Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Weak Topic Heatmap & Course Curricula (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Systemic Knowledge Gaps Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Cohort Knowledge Gap Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Percentage of learners requiring scaffolded practice
                </p>
              </div>
              <Badge variant="warning" size="sm">
                Systemic Bottlenecks
              </Badge>
            </div>

            <div className="space-y-3.5 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Dynamic Programming & Memoization</span>
                  <span className="text-rose-600 font-bold">48% Struggling</span>
                </div>
                <ProgressBar value={48} colorScheme="rose" height="h-2" />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Recommended action: Assign 1D state transition drills</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">SQL Complex Joins & Subqueries</span>
                  <span className="text-amber-600 font-bold">41% Struggling</span>
                </div>
                <ProgressBar value={41} colorScheme="amber" height="h-2" />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Recommended action: Visual relational join simulator</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Tree Traversal & BST Balancing</span>
                  <span className="text-indigo-600 font-bold">34% Struggling</span>
                </div>
                <ProgressBar value={34} colorScheme="indigo" height="h-2" />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Recommended action: In-order recursion animations</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Hash Tables & Hash Maps</span>
                  <span className="text-emerald-600 font-bold">8% Struggling (92% Mastered)</span>
                </div>
                <ProgressBar value={8} colorScheme="emerald" height="h-2" />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Optimal competency tier achieved</span>
              </div>
            </div>
          </div>

          {/* Managed Courses Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Active Managed Curricula
            </h3>

            <div className="space-y-2.5">
              {mockCourses.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{c.title}</h5>
                    <span className="text-[11px] text-slate-500">{c.enrolledStudentsCount} Students • {c.totalModules} Modules</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {c.progressPercent}% Avg
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Student Roster & Adaptive Interventions (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cohort Student Roster</h3>
              <p className="text-xs text-slate-500 mt-0.5">Individual mastery status and weak topic telemetry</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['all', 'on-track', 'needs-attention', 'at-risk'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg transition-all capitalize ${
                    filterStatus === st
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student by name or university email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Student List */}
          <div className="space-y-3">
            {filteredStudents.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{st.name}</h4>
                      <Badge
                        variant={
                          st.status === 'On Track' ? 'success' :
                          st.status === 'Needs Attention' ? 'warning' : 'danger'
                        }
                        size="sm"
                      >
                        {st.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">{st.email} • Last active {st.lastActive}</p>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {st.weakTopics.map((wt, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
                          Gap: {wt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Mastery</span>
                    <span className="text-sm font-black text-slate-800 ml-1 sm:ml-0 sm:block">{st.masteryScore}%</span>
                  </div>

                  <button
                    onClick={() => handleAssignRemedial(st.name, st.weakTopics[0] || 'Dynamic Programming')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Assign Drill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
