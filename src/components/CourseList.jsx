import React, { useState } from 'react';
import { BookOpen, Plus, Tag, ArrowRight, Layers, User, Sparkles } from 'lucide-react';

export const CourseList = ({ courses, onSelectCourse, onCreateCourse, userRole, loading }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('Data Structures, Algorithms');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canCreate = userRole === 'trainer' || userRole === 'admin';

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      const tagsArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
      await onCreateCourse({
        title: newTitle.trim(),
        description: newDesc.trim(),
        tags: tagsArray,
        is_published: true
      });
      setNewTitle('');
      setNewDesc('');
      setShowCreateModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '0 24px 32px' }}>
      {/* Top Banner & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Course Curriculum & Concept Maps</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Select any course to explore its prerequisite concept DAG and dependency progression.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search courses or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '220px', padding: '8px 12px' }}
          />

          {canCreate && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} /> Create Course
            </button>
          )}
        </div>
      </div>

      {/* Role permission info banner if student */}
      {!canCreate && (
        <div style={{
          marginBottom: '20px',
          padding: '10px 16px',
          borderRadius: '8px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          fontSize: '0.8125rem',
          color: '#c7d2fe',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={16} color="#818cf8" />
          <span>Viewing as <strong>Student</strong> (Read-only concept DAG exploration). Switch role to <strong>Trainer</strong> in top bar to create courses or modify concepts.</span>
        </div>
      )}

      {/* Course Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-dim)' }}>
          Loading courses...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
          <BookOpen size={48} color="#6366f1" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
          <h3>No courses found</h3>
          <p style={{ fontSize: '0.875rem', marginTop: '6px', color: 'var(--text-dim)' }}>
            {searchTerm ? 'Try a different search query' : 'Create your first course to begin configuring concept maps.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filtered.map((course) => (
            <div
              key={course.id}
              className="glass-card"
              onClick={() => onSelectCourse(course)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.125rem', color: '#f8fafc', lineHeight: 1.3 }}>{course.title}</h3>
                  <span style={{
                    fontSize: '0.75rem',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#a5b4fc',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    <Layers size={12} /> {course.concept_count} Concepts
                  </span>
                </div>

                <p style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.45',
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {course.description}
                </p>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {course.tags.map((tag, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.7rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-dim)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '12px',
                marginTop: '8px',
                fontSize: '0.75rem',
                color: 'var(--text-dim)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={13} />
                  <span>{course.creator_email || 'Trainer'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a5b4fc', fontWeight: 600 }}>
                  <span>View Concept DAG</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Create New Course</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Define the curriculum container. After creation, you can construct the prerequisite concept graph.
            </p>

            {errorMsg && (
              <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '6px', color: '#fca5a5', fontSize: '0.8125rem', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Advanced Full-Stack Architecture"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the learning objectives and scope of this course..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Python, Microservices, MongoDB"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
