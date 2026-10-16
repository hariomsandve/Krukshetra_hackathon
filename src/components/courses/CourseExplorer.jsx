import React, { useState } from 'react';
import {
  Compass,
  Search,
  Plus,
  Tag,
  ArrowRight,
  Layers,
  Sparkles,
  BookOpen,
  Bookmark,
  ExternalLink,
  Code2,
  FileText,
  Video,
  CheckCircle2,
  Cpu,
  Globe,
  Database,
  Cloud,
  BrainCircuit,
  Coffee
} from 'lucide-react';
import { mockData } from '../../data/mockData';

export const CourseExplorer = ({
  courses,
  onSelectCourse,
  onCreateCourse,
  userRole,
  loading
}) => {
  const [activeTab, setActiveTab] = useState('subjects'); // 'subjects' | 'resources'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states for creating course
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('Algorithms, Data Structures');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canCreate = userRole === 'trainer' || userRole === 'admin';

  // Subjects from mockData
  const subjects = mockData.subjects || [];
  const learningResources = mockData.learningResources || [];
  const libraryItems = mockData.library?.items || [];

  const libraryFilters = mockData.library?.filters || [
    'All',
    'Explanations',
    'Notes',
    'Resources',
    'Code Snippets',
    'Bookmarks'
  ];

  // Helper icon for subjects
  const getSubjectIcon = (icon) => {
    switch (icon) {
      case 'coffee': return <Coffee size={20} color="#a855f7" />;
      case 'network': return <Layers size={20} color="#8b5cf6" />;
      case 'database': return <Database size={20} color="#3b82f6" />;
      case 'cpu': return <Cpu size={20} color="#10b981" />;
      case 'globe': return <Globe size={20} color="#f97316" />;
      case 'code': return <Code2 size={20} color="#ec4899" />;
      case 'brain-circuit': return <BrainCircuit size={20} color="#6366f1" />;
      case 'cloud': return <Cloud size={20} color="#06b6d4" />;
      default: return <BookOpen size={20} color="#a855f7" />;
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={16} color="#ec4899" />;
      case 'code-snippet': return <Code2 size={16} color="#10b981" />;
      case 'note': return <FileText size={16} color="#f59e0b" />;
      case 'explanation': return <Sparkles size={16} color="#a855f7" />;
      default: return <BookOpen size={16} color="#38bdf8" />;
    }
  };

  // Filtered Subjects
  const filteredSubjects = subjects.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered Resources
  const combinedResources = [
    ...libraryItems.map(item => ({ ...item, isLibraryItem: true })),
    ...learningResources.map(res => ({ ...res, isExternalResource: true }))
  ];

  const filteredResources = combinedResources.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Bookmarks') return r.isBookmarked === true;
    if (selectedCategory === 'Explanations') return r.type === 'explanation';
    if (selectedCategory === 'Notes') return r.type === 'note';
    if (selectedCategory === 'Code Snippets') return r.type === 'code-snippet';
    if (selectedCategory === 'Resources') return r.type === 'resource' || r.type === 'documentation' || r.type === 'article' || r.type === 'lesson';
    return true;
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
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c4b5fd' }}>
              <BookOpen size={12} style={{ marginRight: '4px' }} /> Learning Library
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Curated by Mentos AI
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Curriculum Subjects & Knowledge Library
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Explore verified computer science subjects, adaptive concept DAGs, and curated pedagogical resources.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '34px', height: '38px', fontSize: '0.8125rem' }}
            />
          </div>

          {canCreate && (
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ height: '38px' }}>
              <Plus size={14} /> Create Course
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('subjects')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'subjects' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'subjects' ? '#fff' : 'var(--text-muted)',
            fontWeight: activeTab === 'subjects' ? 600 : 400,
            fontSize: '0.875rem',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Compass size={15} /> Curriculum Subjects ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'resources' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'resources' ? '#fff' : 'var(--text-muted)',
            fontWeight: activeTab === 'resources' ? 600 : 400,
            fontSize: '0.875rem',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BookOpen size={15} /> Curated Resources & Notes ({combinedResources.length})
        </button>
      </div>

      {/* VIEW 1: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
          {filteredSubjects.map((sub) => {
            return (
              <div
                key={sub.id}
                className="surface-card surface-card-interactive"
                onClick={() => {
                  if (onSelectCourse) {
                    onSelectCourse({
                      id: sub.id,
                      title: sub.title,
                      description: sub.description,
                      tags: [sub.level, sub.color]
                    });
                  }
                }}
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 22, 38, 0.75)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getSubjectIcon(sub.icon)}
                    </div>
                    <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c4b5fd', fontSize: '0.6875rem' }}>
                      {sub.level}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {sub.title}
                  </h3>
                  <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {sub.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.71875rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>{sub.topicCount} Topics</span>
                    <span>{sub.progressPercent}% Completed</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{ width: `${sub.progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #6366f1)', borderRadius: '3px' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                      Explore Concept DAG <ArrowRight size={13} style={{ marginLeft: '4px' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: RESOURCES & LIBRARY */}
      {activeTab === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {libraryFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedCategory(filter)}
                className={`badge ${selectedCategory === filter ? 'badge-in-progress' : ''}`}
                style={{
                  cursor: 'pointer',
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  border: selectedCategory === filter ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
                  background: selectedCategory === filter ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedCategory === filter ? '#fff' : 'var(--text-muted)'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="surface-card"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 22, 38, 0.75)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getResourceIcon(res.type)}
                      <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {res.type}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {res.isBookmarked && (
                        <Bookmark size={14} color="#f59e0b" fill="#f59e0b" />
                      )}
                      {res.isVerified && (
                        <span title="Verified source" style={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircle2 size={14} color="#10b981" />
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {res.title}
                  </h4>
                  <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {res.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.71875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {res.durationMinutes ? `${res.durationMinutes} mins read` : res.savedAt ? `Saved ${new Date(res.savedAt).toLocaleDateString()}` : res.sourceName || 'Curated'}
                  </span>

                  {res.sourceUrl ? (
                    <a
                      href={res.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.6875rem', padding: '4px 10px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Source <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(168, 85, 247, 0.1)', color: '#c4b5fd' }}>
                      Mentos Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="surface-card" style={{ width: '480px', padding: '24px', background: '#101827' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Create New Curriculum Subject
            </h3>
            {errorMsg && (
              <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '12px' }}>
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Curriculum Title</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Systems & Consensus"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  placeholder="Outline the core learning objectives..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="form-input"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. distributed, consensus, paxos"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="form-input"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Creating...' : 'Create Curriculum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseExplorer;
