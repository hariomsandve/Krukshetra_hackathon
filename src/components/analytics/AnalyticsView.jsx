import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { BarChart3, TrendingUp, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AnalyticsView = () => {
  const conceptMasteryData = [
    { concept: 'Memory & Arrays', mastery: 95 },
    { concept: 'Pointers & Refs', mastery: 90 },
    { concept: 'Linked Lists', mastery: 85 },
    { concept: 'Stacks & Queues', mastery: 64 },
    { concept: 'Binary Trees', mastery: 48 },
    { concept: 'DAG Cycles', mastery: 72 },
  ];

  const scoreTrends = [
    { assessment: 'Diag 1', score: 55 },
    { assessment: 'Quiz 1', score: 70 },
    { assessment: 'Mid-term', score: 68 },
    { assessment: 'Code 1', score: 85 },
    { assessment: 'Code 2', score: 92 },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
          Concept Mastery & Performance Analytics
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Detailed telemetry on concept proficiency, diagnostic score trends, and knowledge gap identification.
        </p>
      </div>

      {/* Two Column Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Concept Mastery Radar */}
        <div className="surface-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '0.9375rem', color: '#fff' }}>Mastery Proficiency by Concept</h3>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>0 - 100% Scale</span>
          </div>

          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conceptMasteryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <YAxis dataKey="concept" type="category" stroke="#94a3b8" fontSize={11} width={100} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101827',
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [`${val}%`, 'Mastery']}
                />
                <Bar dataKey="mastery" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Trend Line Chart */}
        <div className="surface-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '0.9375rem', color: '#fff' }}>Assessment Score Progression</h3>
            <span style={{ fontSize: '0.6875rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> Positive trajectory
            </span>
          </div>

          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis dataKey="assessment" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[40, 100]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101827',
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Table */}
      <div className="surface-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.9375rem', color: '#fff', marginBottom: '14px' }}>
          Diagnostic Knowledge State Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Strengths */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} /> High Competency Concepts (80%+)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                <span>Memory Addressing & Contiguous Arrays</span>
                <strong style={{ color: '#34d399' }}>95%</strong>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                <span>Pointers, Sentinel Nodes & Dereferencing</span>
                <strong style={{ color: '#34d399' }}>90%</strong>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                <span>Linked Lists & Two-Pointer Cycles</span>
                <strong style={{ color: '#34d399' }}>85%</strong>
              </div>
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={13} /> Priority Reinforcement Areas (&lt;70%)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                <div>
                  <div>Binary Search Tree Invariants</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>2 failed test cases on left/right bounds</div>
                </div>
                <strong style={{ color: '#fb7185' }}>48%</strong>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                <div>
                  <div>Stacks & Monotonic Queues</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Call-stack recursion overflow edge cases</div>
                </div>
                <strong style={{ color: '#fbbf24' }}>64%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
