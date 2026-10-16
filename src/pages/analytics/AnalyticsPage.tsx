import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Target, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';

export const AnalyticsPage: React.FC = () => {
  const { topics, student } = useApp();

  // 1. Data for Topic Mastery Bar Chart
  const topicData = topics.map(t => ({
    name: t.name.split(' ')[0] + ' ' + (t.name.split(' ')[1] || ''),
    fullName: t.name,
    proficiency: t.proficiencyScore,
    benchmark: 70, // Cohort target
  }));

  // 2. Data for Learning Velocity Area Chart
  const velocityData = [
    { session: 'Baseline', score: 48, difficulty: 'Easy' },
    { session: 'Week 1', score: 55, difficulty: 'Easy' },
    { session: 'Week 2', score: 62, difficulty: 'Medium' },
    { session: 'Diagnostic', score: 58, difficulty: 'Medium' },
    { session: 'Remedial Drill', score: 72, difficulty: 'Medium' },
    { session: 'Reassessment', score: student.overallMastery, difficulty: 'Adaptive' },
  ];

  // 3. Data for Radar Chart (Skills matrix)
  const radarData = topics.map(t => ({
    subject: t.name.split(' ')[0],
    student: t.proficiencyScore,
    cohortAvg: 68,
  }));

  // 4. Time distribution Donut chart
  const distributionData = [
    { name: 'DP & Algorithms', value: 35, color: '#4f46e5' },
    { name: 'Relational SQL', value: 25, color: '#06b6d4' },
    { name: 'Data Structures', value: 20, color: '#10b981' },
    { name: 'System Design', value: 20, color: '#f59e0b' },
  ];

  // 5. Adaptive Difficulty Performance
  const difficultyData = [
    { level: 'Easy Questions', accuracy: 91, attempted: 45, fill: '#10b981' },
    { level: 'Medium Questions', accuracy: 74, attempted: 38, fill: '#6366f1' },
    { level: 'Hard Questions', accuracy: 52, attempted: 21, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comprehensive Learning Telemetry & Analytics"
        subtitle="Topic-wise strengths, knowledge gap distribution, adaptive velocity, and evaluator verification metrics."
        badgeText="Real-Time Analytics"
      />

      {/* Top Telemetry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Mastery Index"
          value={`${student.overallMastery}%`}
          subtitle="Dynamic composite score"
          icon={TrendingUp}
          accentColor="indigo"
          trend={{ value: '+14% this month', isPositive: true }}
        />
        <StatCard
          title="Gap Remediation Rate"
          value="75%"
          subtitle="Topics elevated above 60%"
          icon={CheckCircle2}
          accentColor="emerald"
          trend={{ value: 'Above target', isPositive: true }}
        />
        <StatCard
          title="Adaptive Accuracy"
          value="78.2%"
          subtitle="Across multi-tier difficulties"
          icon={Zap}
          accentColor="blue"
        />
        <StatCard
          title="Peer Rank"
          value={`Top #${student.rank}`}
          subtitle={`Out of 142 learners`}
          icon={Award}
          accentColor="amber"
        />
      </div>

      {/* Grid: Topic Strengths & Weaknesses Bar Chart vs Radar Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Topic Mastery Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Topic-Wise Strengths & Weaknesses
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current proficiency scores relative to the 70% mastery benchmark
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
                Student Score
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-0.5 bg-slate-300 inline-block" />
                Benchmark (70%)
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`, 'Proficiency']}
                />
                <Bar 
                  dataKey="proficiency" 
                  fill="#4f46e5" 
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Highlight badges */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Top Strengths</span>
              <span className="font-bold text-slate-800">Hash Tables (92%) & Graphs (84%)</span>
            </div>
            <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Primary Knowledge Gaps</span>
              <span className="font-bold text-slate-800">Dynamic Programming & SQL Joins</span>
            </div>
          </div>
        </div>

        {/* Radar Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Competency Radar Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-axial comparison: Alex Rivera vs Cohort Average
            </p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Alex Rivera" dataKey="student" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Cohort Average" dataKey="cohortAvg" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.2} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
              <span className="font-semibold text-slate-700">Alex Rivera</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
              <span className="font-medium text-slate-500">Cohort Average</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Learning Velocity Area Chart + Adaptive Difficulty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Learning Velocity (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Learning Velocity & Longitudinal Progression
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Trajectory showing mastery recovery following scaffolded interventions
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="session" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[30, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}% Mastery`, 'Score']}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4f46e5" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#velocityGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Adaptive Difficulty Accuracy Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Adaptive Difficulty Accuracy
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Success rates as the engine dynamically scales difficulty
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {difficultyData.map((d, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">{d.level}</span>
                  <span className="text-xs font-black text-indigo-700">{d.accuracy}% Success</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
                  <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${d.accuracy}%`, backgroundColor: d.fill }}
                  />
                </div>
                <span className="text-[11px] text-slate-400">
                  {d.attempted} questions served dynamically
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
