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
  Edit,
  Trash2
} from 'lucide-react';

export const TrainerWorkspace = ({
  courses,
  onSelectCourse,
  onOpenCreateCourse,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState('curriculum');

  const questionBank = [
    { id: "qb-1", title: "Unbalanced BST Search Complexity", type: "Multiple Choice", concept: "Binary Search Trees", difficulty: "intermediate", usedIn: "Mid-Term Diagnostic" },
    { id: "qb-2", title: "In-Order Traversal Invariant", type: "Multiple Choice", concept: "Binary Search Trees", difficulty: "beginner", usedIn: "Mid-Term Diagnostic" },
    { id: "qb-3", title: "3-Color DFS Gray Node Meaning", type: "Multiple Choice", concept: "DAG Cycle Detection", difficulty: "intermediate", usedIn: "Advanced Mastery" },
    { id: "qb-4", title: "Detect Cycle in Prerequisite Graph", type: "Coding Challenge", concept: "DAG Cycle Detection", difficulty: "intermediate", usedIn: "Week 4 Evaluation" }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Trainer Curriculum & Cohort Workspace
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Manage course roadmaps, prerequisite concept DAGs, question banks, and cohort mastery thresholds.
          </p>
        </div>

        <button onClick={onOpenCreateCourse} className="btn btn-primary">
          <Plus size={15} /> Create New Course
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('curriculum')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'curriculum' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'curriculum' ? '#fff' : 'var(--text-muted)',
            fontWeight: activeTab === 'curriculum' ? 600 : 400,
            fontSize: '0.8125rem',
            padding: '8px 14px',
            cursor: 'pointer'
          }}
        >
          Curriculum & Concept Maps ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('question-bank')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'question-bank' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'question-bank' ? '#fff' : 'var(--text-muted)',
            fontWeight: activeTab === 'question-bank' ? 600 : 400,
            fontSize: '0.8125rem',
            padding: '8px 14px',
            cursor: 'pointer'
          }}
        >
          Question Bank ({questionBank.length})
        </button>
      </div>

      {/* Tab 1: Curriculum List */}
      {activeTab === 'curriculum' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {courses.map((c) => (
            <div
              key={c.id}
              className="surface-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '0.95rem', color: '#fff' }}>{c.title}</h3>
                  <span className="badge badge-mastered">
                    {c.concept_count} Concepts
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
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
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                >
                  <Layers size={13} /> Edit Concept DAG
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Tab 2: Question Bank */
        <div className="surface-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '0.9375rem', color: '#fff' }}>Repository Questions & Challenges</h3>
            <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '5px 12px' }}>
              <Plus size={13} /> Add Question
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px' }}>Title</th>
                <th style={{ padding: '8px 12px' }}>Type</th>
                <th style={{ padding: '8px 12px' }}>Target Concept</th>
                <th style={{ padding: '8px 12px' }}>Difficulty</th>
                <th style={{ padding: '8px 12px' }}>Assessment Attached</th>
              </tr>
            </thead>
            <tbody>
              {questionBank.map((q) => (
                <tr key={q.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.06)', color: 'var(--text-secondary)' }}>
                  <td style={{ padding: '10px 12px', color: '#fff', fontWeight: 500 }}>{q.title}</td>
                  <td style={{ padding: '10px 12px' }}>{q.type}</td>
                  <td style={{ padding: '10px 12px' }}>{q.concept}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{q.usedIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
