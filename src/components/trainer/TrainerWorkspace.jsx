import React, { useState } from 'react';
import {
  BookPlus,
  Plus,
  Users,
  Layers,
  HelpCircle,
  BarChart2,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Clock,
  ArrowRight,
  User,
  Sparkles
} from 'lucide-react';
import { mockData } from '../../data/mockData';

export const TrainerWorkspace = ({
  courses,
  onSelectCourse,
  onOpenCreateCourse,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState('cohorts'); // 'cohorts' | 'curriculum' | 'assessments' | 'queue'

  const trainer = mockData.trainerWorkspace || {
    cohorts: [],
    learners: [],
    assessments: [],
    reviewQueue: []
  };

  const practiceQuestions = mockData.practiceQuestions || [];

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c4b5fd' }}>
              <Users size={12} style={{ marginRight: '4px' }} /> Trainer Portal
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Cohort: {trainer.cohorts[0]?.name || 'Computer Science - Year 3'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Trainer Cohort & Curriculum Command Center
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Supervise learner cognitive progress, review code submissions, manage DAG milestones, and configure diagnostic assessments.
          </p>
        </div>

        <button onClick={onOpenCreateCourse} className="btn btn-primary" style={{ height: '38px' }}>
          <Plus size={15} /> Create Course
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('cohorts')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'cohorts' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'cohorts' ? '#fff' : 'var(--text-muted)',
            fontWeight: activeTab === 'cohorts' ? 600 : 400,
            fontSize: '0.875rem',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={15} /> Cohorts & Learners ({trainer.learners.length})
        </button>

        <button
          onClick={() => setActiveTab('assessments')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'assessments' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'assessments' ? '#fff' : 'var(--text-muted)',
            fontWeight: activeTab === 'assessments' ? 600 : 400,
            fontSize: '0.875rem',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BarChart2 size={15} /> Assigned Assessments ({trainer.assessments.length})
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'queue' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'queue' ? '#fff' : 'var(--text-muted)',
            fontWeight: activeTab === 'queue' ? 600 : 400,
            fontSize: '0.875rem',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShieldAlert size={15} /> Integrity Review Queue ({trainer.reviewQueue.length})
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'curriculum' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'curriculum' ? '#fff' : 'var(--text-muted)',
            fontWeight: activeTab === 'curriculum' ? 600 : 400,
            fontSize: '0.875rem',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Layers size={15} /> Curriculum DAGs ({courses.length})
        </button>
      </div>

      {/* TAB 1: COHORTS & LEARNERS */}
      {activeTab === 'cohorts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Cohort Summary Box */}
          <div className="surface-card" style={{ padding: '20px 24px', background: 'rgba(16, 22, 38, 0.75)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', marginBottom: '6px' }}>
                Active Cohort
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                {trainer.cohorts[0]?.name || 'Computer Science - Year 3'}
              </h2>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {trainer.cohorts[0]?.learnerCount || 32} Enrolled Learners • {trainer.cohorts[0]?.activeAssessmentCount || 2} Active Diagnostic Milestones
              </span>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ textAlign: 'center', padding: '10px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>AVG MASTERY</span>
                <strong style={{ fontSize: '1.2rem', color: '#10b981' }}>57.6%</strong>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>REVIEWS PENDING</span>
                <strong style={{ fontSize: '1.2rem', color: '#f59e0b' }}>{trainer.reviewQueue.length}</strong>
              </div>
            </div>
          </div>

          {/* Learners Table */}
          <div className="surface-card" style={{ padding: '22px', background: 'rgba(16, 22, 38, 0.75)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Learner Mastery & Identified Weak Spots
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px' }}>Learner</th>
                  <th style={{ padding: '10px 14px' }}>Mastery Level</th>
                  <th style={{ padding: '10px 14px' }}>Flagged Weak Concepts</th>
                  <th style={{ padding: '10px 14px' }}>Last Activity</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainer.learners.map((learner) => (
                  <tr key={learner.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.06)', color: 'var(--text-secondary)' }}>
                    <td style={{ padding: '12px 14px', color: '#fff', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                          {learner.displayName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{learner.displayName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: learner.masteryPercent >= 60 ? '#10b981' : '#f59e0b' }}>
                          {learner.masteryPercent}%
                        </span>
                        <div style={{ width: '60px', height: '4px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                          <div style={{ width: `${learner.masteryPercent}%`, height: '100%', background: learner.masteryPercent >= 60 ? '#10b981' : '#f59e0b' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {learner.weakTopics.map((topic, i) => (
                          <span key={i} className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: '0.6875rem' }}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {new Date(learner.lastActiveAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          if (onNavigate) onNavigate('analytics');
                        }}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.71875rem', padding: '4px 10px' }}
                      >
                        Inspect Telemetry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ASSESSMENTS */}
      {activeTab === 'assessments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {trainer.assessments.map((asmt) => (
            <div key={asmt.id} className="surface-card" style={{ padding: '22px', background: 'rgba(16, 22, 38, 0.75)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`badge ${asmt.status === 'published' ? 'badge-mastered' : 'badge-needs-practice'}`} style={{ textTransform: 'capitalize' }}>
                    {asmt.status}
                  </span>
                  {asmt.dueAt && (
                    <span style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Due {new Date(asmt.dueAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {asmt.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Subject ID: {asmt.subjectId}
                </span>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  Submissions: <strong>{asmt.submissionCount}</strong> / {asmt.assignedCount || 32}
                </span>

                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('assessments');
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.71875rem', padding: '5px 12px' }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: INTEGRITY REVIEW QUEUE */}
      {activeTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {trainer.reviewQueue.map((item) => (
            <div key={item.id} className="surface-card" style={{ padding: '20px 24px', background: 'rgba(16, 22, 38, 0.75)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                    {item.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Session ID: {item.sessionId}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                  {item.assessmentTitle} — Candidate Review
                </h3>
                <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Learner: {trainer.learners.find(l => l.id === item.learnerId)?.displayName || 'Alex Morgan'} • {item.signalCount} integrity signals recorded during execution.
                </p>
              </div>

              <button
                onClick={() => {
                  if (onNavigate) onNavigate('viva');
                }}
                className="btn btn-primary"
                style={{ fontSize: '0.78125rem', padding: '8px 16px', gap: '6px' }}
              >
                Inspect Replay & Viva <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CURRICULUM DAGS */}
      {activeTab === 'curriculum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {courses.map((c) => (
            <div
              key={c.id}
              className="surface-card"
              style={{
                padding: '18px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(16, 22, 38, 0.75)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{c.title}</h3>
                  <span className="badge badge-mastered">
                    {c.concept_count} Concepts
                  </span>
                </div>
                <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                  {c.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    onSelectCourse(c);
                    onNavigate('concept-map');
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px 14px', gap: '6px' }}
                >
                  <Layers size={13} /> Edit Concept DAG
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerWorkspace;
