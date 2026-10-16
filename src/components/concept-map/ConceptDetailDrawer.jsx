import React from 'react';
import {
  Clock,
  Target,
  GitBranch,
  PlayCircle,
  Trash2,
  X,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Lock,
  MoreHorizontal,
  Lightbulb,
  Code2,
  ExternalLink,
  Zap
} from 'lucide-react';

export const ConceptDetailDrawer = ({
  concept,
  allNodes,
  edges,
  onClose,
  onSelectConcept,
  onStartLearning,
  onDeleteConcept,
  canModify,
  onAskMentos
}) => {
  if (!concept) return null;

  // Find incoming prerequisites
  const prereqIds = concept.prerequisites || [];
  const prereqNodes = allNodes.filter(n => prereqIds.includes(n.id));

  // Find outgoing dependents (concepts that require this one)
  const dependentIds = edges.filter(e => e.source === concept.id).map(e => e.target);
  const dependentNodes = allNodes.filter(n => dependentIds.includes(n.id));

  return (
    <div
      style={{
        width: '380px',
        background: 'rgba(15, 20, 34, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100vh - 120px)',
        maxHeight: '780px',
        overflowY: 'auto',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
        flexShrink: 0
      }}
    >
      <div>
        {/* Top Header Badge & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#fbbf24',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              Needs Practice • 62% Mastery
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              #DS-302
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {canModify && (
              <button
                onClick={() => onDeleteConcept(concept.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f43f5e',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title="Delete this concept"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px', lineHeight: 1.25 }}>
          {concept.title}
        </h2>

        {/* OVERVIEW */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '6px' }}>
            OVERVIEW
          </div>
          <p style={{ fontSize: '0.78125rem', color: '#cbd5e1', lineHeight: 1.55 }}>
            {concept.description || "Key-value mapping data structure achieving average O(1) time complexity. Focus area: open addressing vs chaining and load factor triggers."}
          </p>
        </div>

        {/* DIRECT PREREQUISITES */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              DIRECT PREREQUISITES
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#34d399', fontWeight: 600 }}>
              {prereqNodes.length > 0 ? `${prereqNodes.length} Complete` : '2 Complete'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {prereqNodes.length > 0 ? (
              prereqNodes.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectConcept(p)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    <span style={{ fontSize: '0.78125rem', color: '#f1f5f9' }}>{p.title}</span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 600 }}>92%</span>
                </div>
              ))
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    <span style={{ fontSize: '0.78125rem', color: '#f1f5f9' }}>Arrays & Pointers</span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 600 }}>92%</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    <span style={{ fontSize: '0.78125rem', color: '#f1f5f9' }}>Modulo & Hash Codes</span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 600 }}>85%</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* DOWNSTREAM UNLOCKS */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              DOWNSTREAM UNLOCKS
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#a855f7', fontWeight: 600 }}>
              Target Ready
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.78125rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={13} color="var(--text-disabled)" />
                <span>LRU Cache Implementation</span>
              </div>
              <span>›</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.78125rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={13} color="var(--text-disabled)" />
                <span>Bloom Filters & Caching</span>
              </div>
              <span>›</span>
            </div>
          </div>
        </div>

        {/* IDENTIFIED WEAK KNOWLEDGE SPOTS */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <Lightbulb size={13} />
            <span>IDENTIFIED WEAK KNOWLEDGE SPOTS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ color: '#fbbf24' }}>•</span>
              <span>Quadratic probing collision steps & primary clustering avoidance</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ color: '#fbbf24' }}>•</span>
              <span>Worst-case O(N) degradation scenarios & denial-of-service hash attacks</span>
            </div>
          </div>
        </div>

        {/* LINKED ASSESSMENTS */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              LINKED ASSESSMENTS
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              2 of 3 Solved
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f1f5f9' }}>
                <CheckCircle2 size={12} color="#10b981" />
                <span>#1 Two Sum</span>
              </div>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.625rem' }}>Easy</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f1f5f9' }}>
                <CheckCircle2 size={12} color="#10b981" />
                <span>#49 Group Anagrams</span>
              </div>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.625rem' }}>Medium</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '4px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#fda4af' }}>
                <Zap size={12} color="#f43f5e" />
                <span>#146 LRU Cache</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#f43f5e' }}>2 test cases failing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => onStartLearning(concept)}
          className="btn btn-primary"
          style={{ width: '100%', padding: '10px', fontSize: '0.8125rem', gap: '8px' }}
        >
          <Code2 size={15} /> Launch Coding Practice
        </button>

        <button
          onClick={() => onAskMentos ? onAskMentos(concept) : onStartLearning(concept)}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '8px', fontSize: '0.8125rem', gap: '6px', color: '#c4b5fd' }}
        >
          <Sparkles size={14} color="#a855f7" /> Ask Mentos to Explain
        </button>
      </div>
    </div>
  );
};
