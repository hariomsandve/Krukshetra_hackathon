import React, { useState } from 'react';
import {
  Compass,
  Search,
  Plus,
  Tag,
  ArrowRight,
  Layers,
  User,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const CourseExplorer = ({
  courses,
  onSelectCourse,
  onCreateCourse,
  userRole,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('Algorithms, Data Structures');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canCreate = userRole === 'trainer' || userRole === 'admin';

  // Extract all unique tags
  const allTags = ['all', ...new Set(courses.flatMap(c => c.tags || []))];

  const filtered = courses.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag =
      selectedTag === 'all' || (c.tags && c.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

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
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Course Curriculum Explorer
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Select any curriculum to explore its prerequisite concept DAG and dependency progression.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '32px', height: '34px', fontSize: '0.75rem' }}
            />
          </div>

          {canCreate && (
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ height: '34px' }}>
              <Plus size={14} /> Create Course
            </button>
          )}
        </div>
      </div>

      {/* Filter Tag Pills */}
      {allTags.length > 1 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              style={{
                background: selectedTag === t ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedTag === t ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                color: selectedTag === t ? '#c7d2fe' : 'var(--text-secondary)',
                fontSize: '0.6875rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Course Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading course catalog...
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
          <BookOpen size={40} color="#6366f1" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3>No courses match your filter</h3>
          <p style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-dim)' }}>
            Try adjusting your search keywords or tags.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {filtered.map((course) => (
            <div
              key={course.id}
              className="surface-card surface-card-interactive"
              onClick={() => onSelectCourse(course)}
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1rem', color: '#fff', lineHeight: 1.3 }}>{course.title}</h3>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0
                    }}
                  >
                    <Layers size={11} /> {course.concept_count} Concepts
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {course.description}
                </p>

                {/* Tags */}
                {course.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
                    {course.tags.map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.625rem',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-xs)',
                          background: 'rgba(255, 255, 255, 0.04)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} />
                  <span>{course.creator_email || 'Trainer'}</span>
                </div>

                <div style={{ color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span>View Concept DAG</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
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
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '500px',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '6px' }}>
              Create New Course
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Define the course container. Prerequisite concept nodes are linked directly in the DAG visualizer.
            </p>

            {errorMsg && (
              <div
                style={{
                  padding: '8px 12px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: 'var(--radius-xs)',
                  color: '#fca5a5',
                  fontSize: '0.75rem',
                  marginBottom: '14px'
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus & Raft Invariants"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe target knowledge outcomes, scope, and target cohort..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, Distributed Systems, Algorithms"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
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
