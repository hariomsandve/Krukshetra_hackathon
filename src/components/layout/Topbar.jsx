import React from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, Sparkles, Mic } from 'lucide-react';

export const Topbar = ({
  health,
  currentRole,
  onRoleChange,
  activeTab,
  selectedCourse,
  onClearSelectedCourse,
  onRefresh,
  onOpenVoiceTutor
}) => {
  const isHealthy = health && health.status === 'healthy';
  const isDegraded = health && health.status === 'degraded';

  const tabLabels = {
    'dashboard': 'Overview',
    'courses': 'Course Explorer',
    'concept-map': 'Concept Map DAG',
    'adaptive-path': 'Adaptive Learning Path',
    'assessments': 'Assessments & Quizzes',
    'coding-workspace': 'Coding Challenges',
    'analytics': 'Analytics & Mastery',
    'trainer-workspace': 'Curriculum Manager',
    'evaluator-workspace': 'Submission Review Queue'
  };

  return (
    <header
      style={{
        height: '60px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-topbar)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 15
      }}
    >
      {/* Left: Breadcrumbs & Course Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>AdaptIQ</span>
        <span style={{ color: 'var(--text-disabled)' }}>/</span>
        <span style={{ color: '#fff', fontWeight: 600 }}>{tabLabels[activeTab] || 'Workspace'}</span>

        {selectedCourse && (
          <>
            <span style={{ color: 'var(--text-disabled)' }}>/</span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#c7d2fe',
                fontWeight: 600
              }}
            >
              <Layers size={13} />
              <span>{selectedCourse.title}</span>
              <button
                onClick={onClearSelectedCourse}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a5b4fc',
                  cursor: 'pointer',
                  marginLeft: '4px',
                  fontSize: '0.9rem',
                  lineHeight: 1
                }}
                title="Deselect course"
              >
                ×
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right: Health & Role controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Live Backend Connection Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: isHealthy
              ? 'rgba(16, 185, 129, 0.08)'
              : isDegraded
              ? 'rgba(245, 158, 11, 0.08)'
              : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${
              isHealthy
                ? 'rgba(16, 185, 129, 0.25)'
                : isDegraded
                ? 'rgba(245, 158, 11, 0.25)'
                : 'rgba(239, 68, 68, 0.25)'
            }`,
            fontSize: '0.75rem'
          }}
          title={health?.database?.message || 'FastAPI + MongoDB Atlas Health Status'}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isHealthy ? '#10b981' : isDegraded ? '#f59e0b' : '#ef4444',
              boxShadow: isHealthy ? '0 0 6px #10b981' : 'none'
            }}
          />
          <span style={{ color: isHealthy ? '#34d399' : isDegraded ? '#fbbf24' : '#f87171', fontWeight: 600 }}>
            {isHealthy ? 'Atlas Live' : isDegraded ? 'FastAPI Up (Atlas Standby)' : 'API Disconnected'}
          </span>
          {health?.database?.latency_ms !== undefined && (
            <span style={{ color: 'var(--text-muted)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '6px' }}>
              {health.database.latency_ms}ms
            </span>
          )}
        </div>

        {/* Voice Tutor Launch Button */}
        {onOpenVoiceTutor && (
          <button
            onClick={onOpenVoiceTutor}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(6, 182, 212, 0.22))',
              border: '1px solid rgba(99, 102, 241, 0.45)',
              color: '#c7d2fe',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Talk with AdaptIQ Gemini Live Voice Tutor"
          >
            <Mic size={12} style={{ color: '#38bdf8' }} />
            <span>Voice Tutor</span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
          </button>
        )}

        {/* Swagger Docs Link */}
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
          style={{ padding: '5px 8px', fontSize: '0.75rem', gap: '4px' }}
          title="Open FastAPI Swagger Documentation"
        >
          <span>Swagger</span>
          <ExternalLink size={12} />
        </a>

        {/* Role Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          {['student', 'trainer', 'evaluator', 'admin'].map((r) => {
            const isCurrent = currentRole === r;
            return (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                style={{
                  border: 'none',
                  background: isCurrent ? 'var(--accent-primary)' : 'transparent',
                  color: isCurrent ? '#fff' : 'var(--text-secondary)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.6875rem',
                  fontWeight: isCurrent ? 600 : 500,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* User Avatar */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
          }}
          title={`Logged in as ${currentRole}`}
        >
          {currentRole.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
