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
  Sparkles
} from 'lucide-react';

export const ConceptDetailDrawer = ({
  concept,
  allNodes,
  edges,
  onClose,
  onSelectConcept,
  onStartLearning,
  onDeleteConcept,
  canModify
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
        width: '360px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '620px',
        overflowY: 'auto'
      }}
    >
      <div>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className={`badge badge-${concept.difficulty}`}>
              {concept.difficulty}
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              Tier {concept.tier_level}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {canModify && (
              <button
                onClick={() => onDeleteConcept(concept.id)}
                className="btn btn-danger"
                style={{ padding: '4px 8px', fontSize: '0.6875rem' }}
                title="Delete this concept"
              >
                <Trash2 size={13} />
              </button>
            )}
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ padding: '4px' }}
              title="Close drawer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '8px', lineHeight: 1.3 }}>
          {concept.title}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
          {concept.description}
        </p>

        {/* Estimated Time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            marginBottom: '18px'
          }}
        >
          <Clock size={15} color="#818cf8" />
          <span>Estimated Completion: <strong>{concept.estimated_minutes} minutes</strong></span>
        </div>

        {/* Prerequisites Section */}
        <div style={{ marginBottom: '18px' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Prerequisites Required ({prereqNodes.length})
          </span>
          {prereqNodes.length === 0 ? (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              None (Foundational entry concept)
            </span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {prereqNodes.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectConcept(p)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    fontSize: '0.75rem',
                    color: '#c7d2fe',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  title="Jump to prerequisite in graph"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GitBranch size={12} />
                    <span>{p.title}</span>
                  </div>
                  <ArrowRight size={12} opacity={0.6} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dependent Concepts Section (What unlocks after this) */}
        <div style={{ marginBottom: '18px' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Unlocks Next ({dependentNodes.length})
          </span>
          {dependentNodes.length === 0 ? (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Terminal capstone concept in current curriculum
            </span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {dependentNodes.map(d => (
                <div
                  key={d.id}
                  onClick={() => onSelectConcept(d)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{d.title}</span>
                  <ArrowRight size={12} opacity={0.5} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Objectives */}
        {concept.learning_objectives?.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              Mastery Objectives
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {concept.learning_objectives.map((obj, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Target size={13} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => onStartLearning(concept)}
          className="btn btn-primary"
          style={{ width: '100%', padding: '9px 16px' }}
        >
          <PlayCircle size={16} /> Start Learning & Practice
        </button>
      </div>
    </div>
  );
};
