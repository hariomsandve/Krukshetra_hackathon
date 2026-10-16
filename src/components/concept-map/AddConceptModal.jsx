import React, { useState } from 'react';
import { Plus, AlertTriangle, X, GitBranch, Layers } from 'lucide-react';

export const AddConceptModal = ({
  allConcepts,
  onClose,
  onSubmit,
  submitting,
  errorMsg
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);
  const [learningObjectives, setLearningObjectives] = useState('');

  const handlePrereqToggle = (id) => {
    setSelectedPrereqs(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const objList = learningObjectives
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      difficulty,
      estimated_minutes: Number(estimatedMinutes),
      prerequisite_concept_ids: selectedPrereqs,
      learning_objectives: objList,
      order_index: allConcepts.length + 1
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 9, 20, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          padding: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>Add Curriculum Concept</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Configure a learning node and connect its prerequisite dependencies in the DAG.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fca5a5',
              fontSize: '0.75rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
              Concept Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dijkstra's Shortest Path Algorithm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
              Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain concept scope, invariants, and core intuition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Difficulty Tier
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="form-select"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Estimated Study Time (mins)
              </label>
              <input
                type="number"
                min={5}
                max={300}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Prerequisite Multi-Select Checklist */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
              Prerequisites (Required dependencies before this topic)
            </label>
            {allConcepts.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No existing concepts. This will be the root foundational concept (Tier 0).
              </p>
            ) : (
              <div
                style={{
                  maxHeight: '130px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px',
                  background: 'var(--bg-app)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {allConcepts.map(c => (
                  <label
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 6px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      background: selectedPrereqs.includes(c.id) ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPrereqs.includes(c.id)}
                      onChange={() => handlePrereqToggle(c.id)}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>{c.title}</span>
                    <span className={`badge badge-${c.difficulty}`} style={{ fontSize: '0.5625rem', padding: '1px 4px', marginLeft: 'auto' }}>
                      {c.difficulty}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
              Learning Objectives (One outcome per line)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Implement edge relaxation&#10;Differentiate Dijkstra vs Bellman-Ford"
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Validating & Adding...' : 'Add Concept to DAG'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
