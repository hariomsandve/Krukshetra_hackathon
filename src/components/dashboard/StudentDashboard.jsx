import React from 'react';
import {
  Sparkles,
  Trophy,
  Flame,
  AlertTriangle,
  PlayCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const StudentDashboard = ({ onNavigate, courses, onSelectCourse }) => {
  const weeklyActivity = [
    { day: 'Mon', minutes: 45, tests: 3 },
    { day: 'Tue', minutes: 30, tests: 2 },
    { day: 'Wed', minutes: 60, tests: 5 },
    { day: 'Thu', minutes: 20, tests: 1 },
    { day: 'Fri', minutes: 50, tests: 4 },
    { day: 'Sat', minutes: 75, tests: 6 },
    { day: 'Sun', minutes: 40, tests: 2 },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Welcome back, Student
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Your adaptive learning engine recommended 1 prerequisite reinforcement for today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onNavigate('adaptive-path')} className="btn btn-secondary">
            View Adaptive Path
          </button>
          <button onClick={() => onNavigate('coding-workspace')} className="btn btn-primary">
            <PlayCircle size={15} /> Resume Coding Challenge
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        <div className="surface-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Mastery Score
            </span>
            <Target size={16} color="#818cf8" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>68%</div>
          <div style={{ fontSize: '0.6875rem', color: '#34d399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={11} /> +4% this week
          </div>
        </div>

        <div className="surface-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Learning Streak
            </span>
            <Flame size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>5 Days</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Streak preserved today
          </div>
        </div>

        <div className="surface-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Concepts Mastered
            </span>
            <Trophy size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>12 / 18</div>
          <div style={{ fontSize: '0.6875rem', color: '#818cf8', marginTop: '4px' }}>
            4 in progress
          </div>
        </div>

        <div className="surface-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Needs Review
            </span>
            <AlertTriangle size={16} color="#f43f5e" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fb7185', lineHeight: 1.1 }}>2 Concepts</div>
          <div style={{ fontSize: '0.6875rem', color: '#fca5a5', marginTop: '4px' }}>
            BSTs & Monotonic Stacks
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Action + Weekly Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
        {/* Recommended Action Spotlight */}
        <div
          className="surface-card"
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <span className="badge badge-advanced">Top Recommendation</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Adaptive Engine Calculation</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
              Graph Traversal & Cycle Detection (Kahn's DAG)
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              <strong>Why this is next:</strong> Prerequisite for advanced topological sorting. Your recent quiz indicated a knowledge gap in recursive call stack bounds (45% accuracy on BST traversals).
            </p>

            <div style={{ display: 'flex', gap: '14px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> 25 min practice
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Target size={13} /> Intermediate Tier 2
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => onNavigate('coding-workspace')}
              className="btn btn-primary"
              style={{ padding: '8px 18px' }}
            >
              Start Coding Challenge <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigate('concept-map')}
              className="btn btn-secondary"
            >
              View in Prerequisite DAG
            </button>
          </div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <div className="surface-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '0.9375rem', color: '#fff' }}>Weekly Learning Activity</h3>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Minutes Practiced</span>
          </div>

          <div style={{ flex: 1, minHeight: '160px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101827',
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="minutes" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Row */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#fff' }}>Current Courses</h2>
          <button onClick={() => onNavigate('courses')} className="btn btn-ghost" style={{ fontSize: '0.75rem' }}>
            Browse All Courses <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {courses.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className="surface-card surface-card-interactive"
              onClick={() => {
                onSelectCourse(c);
                onNavigate('concept-map');
              }}
              style={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '0.9375rem', color: '#fff' }}>{c.title}</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {c.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>{c.concept_count} Concepts in DAG</span>
                <span style={{ color: '#818cf8', fontWeight: 600 }}>Explore Graph →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
