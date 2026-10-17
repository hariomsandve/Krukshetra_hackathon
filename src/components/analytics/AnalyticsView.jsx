import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Calendar,
  Flame,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { mockData } from '../../data/mockData';

export const AnalyticsView = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topicPerformance = mockData.analytics?.topicPerformance || [];
  const commonMistakes = mockData.analytics?.commonMistakes || [];
  const weeklyGoals = mockData.analytics?.weeklyGoals || {
    targetMinutes: 360,
    completedMinutes: 315,
    targetAssessments: 4,
    completedAssessments: 3
  };
  const masteryTrend = mockData.dashboard?.masteryTrend || [];
  const weeklyActivity = mockData.dashboard?.weeklyActivity || [];
  const assessmentHistory = mockData.assessmentHistory || [];

  const studyTimePercent = Math.min(100, Math.round((weeklyGoals.completedMinutes / weeklyGoals.targetMinutes) * 100));
  const assessmentPercent = Math.min(100, Math.round((weeklyGoals.completedAssessments / weeklyGoals.targetAssessments) * 100));

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto text-neutral-900 select-none space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-200">
              <BarChart3 size={12} /> Telemetry v1.0
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              Learner: {mockData.currentUser.displayName} ({mockData.currentUser.cohort})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Progress & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            Deep cognitive mastery telemetry, historical assessment trends, and adaptive diagnostic signals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 shadow-2xs">
            <Flame size={18} className="text-amber-600" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-amber-800">Streak</span>
              <strong className="text-sm font-extrabold text-neutral-900">{mockData.dashboard.summary.currentStreakDays} Days</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 shadow-2xs">
            <Award size={18} className="text-purple-700" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-purple-900">Mastery</span>
              <strong className="text-sm font-extrabold text-purple-950">{mockData.dashboard.summary.overallMasteryPercent}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weekly Study Time Goal */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Weekly Study Time</span>
            <Clock size={16} className="text-purple-700" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-neutral-900">{weeklyGoals.completedMinutes}</span>
            <span className="text-xs text-neutral-500">/ {weeklyGoals.targetMinutes} mins</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#ecebe7] overflow-hidden">
            <div style={{ width: `${studyTimePercent}%` }} className="h-full bg-purple-600 rounded-full" />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500 pt-0.5">
            <span>{studyTimePercent}% reached</span>
            <span>{weeklyGoals.targetMinutes - weeklyGoals.completedMinutes}m left</span>
          </div>
        </div>

        {/* Weekly Assessments Goal */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Assessments Completed</span>
            <Target size={16} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-neutral-900">{weeklyGoals.completedAssessments}</span>
            <span className="text-xs text-neutral-500">/ {weeklyGoals.targetAssessments} tests</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#ecebe7] overflow-hidden">
            <div style={{ width: `${assessmentPercent}%` }} className="h-full bg-emerald-600 rounded-full" />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500 pt-0.5">
            <span>{assessmentPercent}% reached</span>
            <span>1 remaining</span>
          </div>
        </div>

        {/* Mastered Concepts */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Concepts Mastered</span>
            <CheckCircle2 size={16} className="text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-neutral-900">{mockData.dashboard.summary.conceptsMastered}</span>
            <span className="text-xs text-neutral-500">high proficiency</span>
          </div>
          <span className="text-xs text-blue-700 font-semibold block pt-1">
            +3 unlocked this week
          </span>
        </div>

        {/* Needs Reinforcement */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Needs Practice</span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-amber-700">{mockData.dashboard.summary.conceptsNeedingPractice}</span>
            <span className="text-xs text-neutral-500">flagged by tutor</span>
          </div>
          <span className="text-xs text-neutral-500 block truncate pt-1">
            Linked Lists, Hash Maps
          </span>
        </div>
      </div>

      {/* Main Charts: Topic Performance & Mastery Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Topic Performance Bar Chart */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Topic Accuracy vs Mastery</h3>
              <p className="text-xs text-neutral-500">Comparing practice accuracy with overall cognitive mastery</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#faf9f5] border border-[#dedcd5] text-neutral-600">
              5 Core Topics
            </span>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" />
                <XAxis dataKey="topicTitle" stroke="#71717a" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e3dc',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    fontSize: '12px',
                    color: '#18181b'
                  }}
                  formatter={(val, name) => [`${val}%`, name === 'accuracyPercent' ? 'Practice Accuracy' : 'Mastery Level']}
                />
                <Bar dataKey="accuracyPercent" name="Accuracy" fill="#9333ea" radius={[4, 4, 0, 0]} />
                <Bar dataKey="masteryPercent" name="Mastery" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-600 inline-block" />
              <span className="text-neutral-600 font-medium">Practice Accuracy %</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
              <span className="text-neutral-600 font-medium">Mastery %</span>
            </div>
          </div>
        </div>

        {/* Mastery Progression Trend */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Cognitive Mastery Trajectory</h3>
              <p className="text-xs text-neutral-500">Daily progression tracked across all adaptive assessments</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp size={13} /> +9% over 6 days
            </span>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={masteryTrend} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickFormatter={(d) => d.slice(5)} />
                <YAxis domain={[40, 70]} stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e3dc',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    fontSize: '12px',
                    color: '#18181b'
                  }}
                  formatter={(val) => [`${val}%`, 'Overall Mastery']}
                />
                <Line
                  type="monotone"
                  dataKey="masteryPercent"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center pt-1 text-xs text-neutral-500">
            <span>Starting baseline: 49% (Oct 11)</span>
            <span className="text-emerald-700 font-bold">Current: 58% (Oct 16)</span>
          </div>
        </div>
      </div>

      {/* Two Column: Common Mistakes & Assessment Attempt History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Identified Common Mistakes */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-[#ecebe7]">
            <AlertTriangle size={16} className="text-amber-600" />
            <h3 className="text-base font-bold text-neutral-900">
              Identified Knowledge Gaps & Remediation
            </h3>
          </div>
          <p className="text-xs text-neutral-500">
            Frequent conceptual misconceptions flagged during recent code executions:
          </p>

          <div className="space-y-2.5 pt-1">
            {commonMistakes.map((mistake) => (
              <div
                key={mistake.id}
                className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col gap-1.5 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-950">
                    {mistake.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    {mistake.occurrences} flags
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-purple-900 font-medium pt-0.5">
                  <Sparkles size={13} className="shrink-0 mt-0.5 text-purple-600" />
                  <span>Recommendation: {mistake.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment History Log */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex justify-between items-center pb-1 border-b border-[#ecebe7]">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-indigo-600" />
              <h3 className="text-base font-bold text-neutral-900">
                Recent Assessment History
              </h3>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              {assessmentHistory.length} attempts recorded
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Chronological log of diagnostic submissions and verified score outcomes:
          </p>

          <div className="space-y-2.5 pt-1">
            {assessmentHistory.map((attempt) => {
              const isHigh = attempt.scorePercent >= 75;
              const isMed = attempt.scorePercent >= 50 && attempt.scorePercent < 75;
              const scoreColor = isHigh ? 'text-emerald-700' : isMed ? 'text-amber-700' : 'text-rose-700';
              const badgeBg = isHigh ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : isMed ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200';

              return (
                <div
                  key={attempt.id}
                  className="p-3.5 rounded-xl bg-[#faf9f5] border border-[#ecebe7] flex justify-between items-center text-xs"
                >
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-0.5">
                      {attempt.title}
                    </h4>
                    <div className="flex gap-2 text-[11px] text-neutral-500">
                      <span>{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{attempt.correctCount} / {attempt.totalCount} correct</span>
                      <span>•</span>
                      <span>{attempt.durationMinutes} mins</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-lg font-extrabold ${scoreColor}`}>
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
    </div>
  );
};

export default AnalyticsView;
