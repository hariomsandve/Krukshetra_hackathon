import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  GitBranch,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Layers,
  Sparkles,
  Target
} from 'lucide-react';

export const ConceptGraphView = ({
  course,
  graphData,
  onBack,
  onAddConcept,
  onDeleteConcept,
  userRole,
  loading
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for Add Concept
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);
  const [learningObjectives, setLearningObjectives] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canModify = userRole === 'trainer' || userRole === 'admin';
  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  // Group nodes by tier_level
  const tiers = {};
  nodes.forEach(node => {
    const tier = node.tier_level ?? 0;
    if (!tiers[tier]) tiers[tier] = [];
    tiers[tier].push(node);
  });
  const tierKeys = Object.keys(tiers).map(Number).sort((a, b) => a - b);

  const selectedConcept = nodes.find(n => n.id === selectedConceptId) || nodes[0];

  const handlePrereqToggle = (id) => {
    setSelectedPrereqs(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const objList = learningObjectives
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

      await onAddConcept({
        title: title.trim(),
        description: description.trim(),
        difficulty,
        estimated_minutes: Number(estimatedMinutes),
        prerequisite_concept_ids: selectedPrereqs,
        learning_objectives: objList,
        order_index: nodes.length + 1
      });

      // Reset
      setTitle('');
      setDescription('');
      setDifficulty('beginner');
      setSelectedPrereqs([]);
      setLearningObjectives('');
      setShowAddModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (conceptId) => {
    if (!window.confirm("Are you sure you want to delete this concept?")) return;
    try {
      await onDeleteConcept(conceptId);
      if (selectedConceptId === conceptId) {
        setSelectedConceptId(null);
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '0 24px 32px' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: '6px 14px' }}
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={14} /> Total Concepts: <strong>{nodes.length}</strong>
          </span>
          {canModify && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setErrorMsg('');
              }}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add Concept
            </button>
          )}
        </div>
      </div>

      {/* Course Title Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#818cf8', fontWeight: 700 }}>
              Prerequisite Concept Map (DAG)
            </span>
            <h1 style={{ fontSize: '1.6rem', marginTop: '4px', marginBottom: '8px' }}>
              {course.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '850px' }}>
              {course.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-beginner">Tier 0: Root</span>
            <span style={{ color: 'var(--text-dim)' }}>→</span>
            <span className="badge badge-intermediate">Tier 1: Core</span>
            <span style={{ color: 'var(--text-dim)' }}>→</span>
            <span className="badge badge-advanced">Tier 2+: Capstone</span>
          </div>
        </div>
      </div>

      {/* Main Content: DAG Layout + Detail Drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: nodes.length > 0 ? 'minmax(0, 1fr) 360px' : '1fr', gap: '24px' }}>
        {/* Left: Topological Tiers Concept Map */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '520px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-dim)', fontSize: '0.8125rem' }}>
            <GitBranch size={16} color="#6366f1" />
            <span>Topological dependency progression (Directed Acyclic Graph)</span>
          </div>

          {nodes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
              <Layers size={40} color="#6366f1" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <h3>No concepts configured yet</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '6px', color: 'var(--text-dim)' }}>
                {canModify
                  ? 'Click "+ Add Concept" to start building the learning curriculum.'
                  : 'The trainer has not added concepts to this course yet.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
              {tierKeys.map((tierIndex) => (
                <div key={tierIndex} style={{ flex: '1', minWidth: '220px' }}>
                  {/* Tier Lane Header */}
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {tierIndex === 0 ? 'Tier 0: Foundations' : `Tier ${tierIndex}: Progression`}
                    </span>
                  </div>

                  {/* Nodes in this Tier */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {tiers[tierIndex].map((node) => {
                      const isSelected = selectedConcept?.id === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedConceptId(node.id)}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '10px',
                            background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.7)',
                            border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                            boxShadow: isSelected ? '0 0 16px rgba(99, 102, 241, 0.3)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <span className={`badge badge-${node.difficulty}`}>
                              {node.difficulty}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Clock size={11} /> {node.estimated_minutes}m
                            </span>
                          </div>

                          <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '6px', lineHeight: 1.3 }}>
                            {node.title}
                          </h4>

                          {node.prerequisites && node.prerequisites.length > 0 && (
                            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <GitBranch size={11} color="#818cf8" />
                              <span>Requires {node.prerequisites.length} prerequisite(s)</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Selected Concept Detail Drawer */}
        {selectedConcept && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span className={`badge badge-${selectedConcept.difficulty}`}>
                  {selectedConcept.difficulty}
                </span>

                {canModify && (
                  <button
                    onClick={() => handleDelete(selectedConcept.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Delete concept"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>

              <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                {selectedConcept.title}
              </h2>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                {selectedConcept.description}
              </p>

              {/* Time Estimate */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', marginBottom: '16px', fontSize: '0.8125rem' }}>
                <Clock size={16} color="#818cf8" />
                <span>Estimated Study Time: <strong>{selectedConcept.estimated_minutes} minutes</strong></span>
              </div>

              {/* Prerequisites Section */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  Prerequisites Required
                </span>
                {selectedConcept.prerequisites?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedConcept.prerequisites.map(pid => {
                      const prereqNode = nodes.find(n => n.id === pid);
                      return (
                        <div
                          key={pid}
                          onClick={() => setSelectedConceptId(pid)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            fontSize: '0.75rem',
                            color: '#c7d2fe',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <GitBranch size={12} />
                          <span>{prereqNode ? prereqNode.title : pid}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    None (Fundamental Entry Concept)
                  </span>
                )}
              </div>

              {/* Learning Objectives */}
              {selectedConcept.learning_objectives?.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                    Learning Objectives
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedConcept.learning_objectives.map((obj, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        <Target size={14} color="#10b981" style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Topological Level: <strong>Tier {selectedConcept.tier_level}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Add Concept Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Add New Concept</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Add a learning concept and connect its prerequisite dependencies. The engine automatically validates and guards against circular graphs.
            </p>

            {errorMsg && (
              <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5', fontSize: '0.8125rem', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <AlertTriangle size={15} /> Validation Error:
                </div>
                <div style={{ marginTop: '4px' }}>{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Concept Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dijkstra's Shortest Path Algorithm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain what the concept teaches and why it matters..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
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

                <div className="form-group">
                  <label className="form-label">Estimated Minutes</label>
                  <input
                    type="number"
                    min={5}
                    max={600}
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Prerequisites Multi-select */}
              <div className="form-group">
                <label className="form-label">
                  Prerequisites (Select dependencies required before starting this topic):
                </label>
                {nodes.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                    This will be the first concept (Root node / Tier 0).
                  </p>
                ) : (
                  <div style={{ maxHeight: '140px', overflowY: 'auto', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '8px' }}>
                    {nodes.map(n => (
                      <label key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 6px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedPrereqs.includes(n.id)}
                          onChange={() => handlePrereqToggle(n.id)}
                          style={{ accentColor: '#6366f1' }}
                        />
                        <span>{n.title}</span>
                        <span className={`badge badge-${n.difficulty}`} style={{ transform: 'scale(0.8)', transformOrigin: 'left' }}>
                          {n.difficulty}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Learning Objectives (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Understand priority queues in graph traversal&#10;Implement relaxation of edges"
                  value={learningObjectives}
                  onChange={(e) => setLearningObjectives(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Adding...' : 'Add Concept'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
