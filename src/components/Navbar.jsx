import React from 'react';
import { ShieldCheck, Cpu, UserCheck, ExternalLink, Activity } from 'lucide-react';

export const Navbar = ({ health, currentRole, onRoleChange }) => {
  const isHealthy = health && health.status === 'healthy';
  const dbStatus = health?.database?.status === 'connected';

  return (
    <header className="glass-panel" style={{ margin: '16px 24px', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}>
          <Cpu size={22} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              AdaptIQ
            </span>
            <span style={{ fontSize: '0.6875rem', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
              PS-2 PORTAL
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Adaptive Learning & Concept Map Engine
          </p>
        </div>
      </div>

      {/* Middle: Live Backend & Atlas Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: isHealthy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isHealthy ? '#10b981' : '#ef4444',
            boxShadow: isHealthy ? '0 0 8px #10b981' : 'none',
            display: 'inline-block'
          }} />
          <span style={{ color: isHealthy ? '#34d399' : '#f87171', fontWeight: 600 }}>
            {health?.status ? `API: ${health.status.toUpperCase()}` : 'Connecting API...'}
          </span>
          {health?.database?.latency_ms !== undefined && (
            <span style={{ color: 'var(--text-dim)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '6px' }}>
              {health.database.latency_ms}ms
            </span>
          )}
        </div>

        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            transition: 'color 0.2s'
          }}
          title="Open FastAPI OpenAPI Docs"
        >
          <span>Swagger Docs</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <UserCheck size={14} /> Active Role:
        </span>
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          {['student', 'trainer', 'evaluator', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              style={{
                background: currentRole === role ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: currentRole === role ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: currentRole === role ? 600 : 400,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease'
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
