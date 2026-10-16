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
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c4b5fd' }}>
              <BarChart3 size={12} style={{ marginRight: '4px' }} /> Telemetry v1.0
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Learner: {mockData.currentUser.displayName} ({mockData.currentUser.cohort})
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Progress & Performance Analytics
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Deep cognitive mastery telemetry, historical assessment trends, and adaptive diagnostic signals.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <Flame size={16} color="#f59e0b" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Streak</span>
              <strong style={{ fontSize: '0.875rem', color: '#fff' }}>{mockData.dashboard.summary.currentStreakDays} Days</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <Award size={16} color="#818cf8" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mastery</span>
              <strong style={{ fontSize: '0.875rem', color: '#818cf8' }}>{mockData.dashboard.summary.overallMasteryPercent}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Weekly Study Time Goal */}
        <div className="surface-card" style={{ padding: '18px 20px', background: 'rgba(16, 22, 38, 0.75)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weekly Study Time</span>
            <Clock size={16} color="#a855f7" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{weeklyGoals.completedMinutes}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>/ {weeklyGoals.targetMinutes} mins</span>
          </div>
          <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${studyTimePercent}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #6366f1)', borderRadius: '3px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            <span>{studyTimePercent}% target reached</span>
            <span>{weeklyGoals.targetMinutes - weeklyGoals.completedMinutes} mins left</span>
          </div>
        </div>

        {/* Weekly Assessments Goal */}
        <div className="surface-card" style={{ padding: '18px 20px', background: 'rgba(16, 22, 38, 0.75)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assessments Completed</span>
            <Target size={16} color="#10b981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{weeklyGoals.completedAssessments}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>/ {weeklyGoals.targetAssessments} tests</span>
          </div>
          <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${assessmentPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)', borderRadius: '3px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            <span>{assessmentPercent}% target reached</span>
            <span>1 remaining this week</span>
          </div>
        </div>

        {/* Mastered Concepts */}
        <div className="surface-card" style={{ padding: '18px 20px', background: 'rgba(16, 22, 38, 0.75)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Concepts Mastered</span>
            <CheckCircle2 size={16} color="#38bdf8" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{mockData.dashboard.summary.conceptsMastered}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>concepts high proficiency</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
            +3 unlocked this week
          </span>
        </div>

        {/* Needs Reinforcement */}
        <div className="surface-card" style={{ padding: '18px 20px', background: 'rgba(16, 22, 38, 0.75)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Needs Practice</span>
            <AlertTriangle size={16} color="#f59e0b" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>{mockData.dashboard.summary.conceptsNeedingPractice}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>flagged by AI tutor</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Linked Lists, Hash Maps, Recursion
          </span>
        </div>
      </div>

      {/* Main Charts: Topic Performance & Mastery Progression */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Topic Performance Bar Chart */}
        <div className="surface-card" style={{ padding: '22px', background: 'rgba(16, 22, 38, 0.75)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#fff' }}>Topic Accuracy vs Mastery</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Comparing practice accuracy with overall cognitive mastery</p>
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>5 Core Topics</span>
          </div>

          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis dataKey="topicTitle" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101827',
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(val, name) => [`${val}%`, name === 'accuracyPercent' ? 'Practice Accuracy' : 'Mastery Level']}
                />
                <Bar dataKey="accuracyPercent" name="Accuracy" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="masteryPercent" name="Mastery" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#a855f7' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Practice Accuracy %</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#38bdf8' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Mastery %</span>
            </div>
          </div>
        </div>

        {/* Mastery Progression Trend */}
        <div className="surface-card" style={{ padding: '22px', background: 'rgba(16, 22, 38, 0.75)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#fff' }}>Cognitive Mastery Trajectory</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Daily progression tracked across all adaptive assessments</p>
            </div>
            <span style={{ fontSize: '0.6875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={13} /> +9% over 6 days
            </span>
          </div>

          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={masteryTrend} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={(d) => d.slice(5)} />
                <YAxis domain={[40, 70]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101827',
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [`${val}%`, 'Overall Mastery']}
                />
                <Line
                  type="monotone"
                  dataKey="masteryPercent"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Starting baseline: 49% (Oct 11)</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Current: 58% (Oct 16)</span>
          </div>
        </div>
      </div>

      {/* Two Column: Common Mistakes & Assessment Attempt History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Identified Common Mistakes & Pedagogical Recommendations */}
        <div className="surface-card" style={{ padding: '22px', background: 'rgba(16, 22, 38, 0.75)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertTriangle size={16} color="#f59e0b" />
            <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#fff' }}>
              Identified Knowledge Gaps & Remediation
            </h3>
          </div>
          <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Frequent conceptual misconceptions flagged during recent code executions and diagnostic quizzes:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {commonMistakes.map((mistake) => (
              <div
                key={mistake.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84375rem', fontWeight: 600, color: '#fff' }}>
                    {mistake.title}
                  </span>
                  <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.6875rem' }}>
                    {mistake.occurrences} flags
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.78125rem', color: '#c4b5fd' }}>
                  <Sparkles size={13} style={{ flexShrink: 0, marginTop: '2px', color: '#a855f7' }} />
                  <span>Recommendation: {mistake.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment History Log */}
        <div className="surface-card" style={{ padding: '22px', background: 'rgba(16, 22, 38, 0.75)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#818cf8" />
              <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#fff' }}>
                Recent Assessment History
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {assessmentHistory.length} attempts recorded
            </span>
          </div>
          <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Chronological log of diagnostic submissions and verified score outcomes:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {assessmentHistory.map((attempt) => {
              const isHigh = attempt.scorePercent >= 75;
              const isMed = attempt.scorePercent >= 50 && attempt.scorePercent < 75;
              const color = isHigh ? '#10b981' : isMed ? '#f59e0b' : '#ef4444';
              const bg = isHigh ? 'rgba(16, 185, 129, 0.08)' : isMed ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)';
              const border = isHigh ? 'rgba(16, 185, 129, 0.25)' : isMed ? 'rgba(245, 158, 11, 0.25)' : 'rgba(239, 68, 68, 0.25)';

              return (
                <div
                  key={attempt.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: bg,
                    border: `1px solid ${border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '3px' }}>
                      {attempt.title}
                    </h4>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                      <span>{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{attempt.correctCount} / {attempt.totalCount} correct</span>
                      <span>•</span>
                      <span>{attempt.durationMinutes} mins</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color }}>
                      {attempt.scorePercent}%
                    </span>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
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
