import React, { useState } from 'react';
import {
  ShieldAlert,
  Code2,
  CheckCircle2,
  AlertTriangle,
  History,
  Eye,
  Send,
  User,
  Clock,
  Sparkles
} from 'lucide-react';

export const EvaluatorWorkspace = () => {
  const [selectedSubId, setSelectedSubId] = useState('sub-101');
  const [reviewNote, setReviewNote] = useState('');
  const [reviewStatus, setReviewStatus] = useState('pending');

  const submissions = [
    {
      id: "sub-101",
      studentName: "Alex Rivera",
      studentEmail: "alex.r@student.edu",
      challengeTitle: "Detect Cycle in Prerequisite Graph",
      submittedAt: "10 mins ago",
      testsPassed: "12 / 12",
      runtimeMs: 42,
      integritySignals: [
        { type: "paste_frequency", label: "Burst Paste Event", severity: "high", detail: "45 lines inserted in 300ms at T+01:24 (potential external copy)" },
        { type: "window_blur", label: "2 Window Blur Events", severity: "low", detail: "Switched focus to external window for 14s total" }
      ],
      code: `def has_cycle(num_courses, prerequisites):
    from collections import defaultdict, deque
    adj = defaultdict(list)
    in_degree = [0] * num_courses
    for u, v in prerequisites:
        adj[v].append(u)
        in_degree[u] += 1
    q = deque([i for i in range(num_courses) if in_degree[i] == 0])
    visited = 0
    while q:
        curr = q.popleft()
        visited += 1
        for nbr in adj[curr]:
            in_degree[nbr] -= 1
            if in_degree[nbr] == 0:
                q.append(nbr)
    return visited != num_courses`
    },
    {
      id: "sub-102",
      studentName: "Priya Sharma",
      studentEmail: "priya.s@student.edu",
      challengeTitle: "Validate Binary Search Tree",
      submittedAt: "35 mins ago",
      testsPassed: "15 / 15",
      runtimeMs: 28,
      integritySignals: [
        { type: "cadence", label: "Organic Keystroke Cadence", severity: "info", detail: "Steady natural editing cadence across 18 minutes; 0 anomalous paste buffers" }
      ],
      code: `def is_valid_bst(root):
    def validate(node, low, high):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
    return validate(root, float('-inf'), float('inf'))`
    }
  ];

  const currentSub = submissions.find(s => s.id === selectedSubId) || submissions[0];

  const handleDecision = (decision) => {
    alert(`Review decision recorded: "${decision.toUpperCase()}". Human evaluation rationale stored.`);
    setReviewStatus(decision);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <ShieldAlert size={18} color="#818cf8" />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            Evaluator Submission Review Queue & Integrity Signals
          </h1>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Human-in-the-loop review of code submissions, editor replay telemetry, and explainable integrity signals.
        </p>
      </div>

      {/* Two Column Layout: Submissions Table on Left, Inspection Drawer on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px' }}>
        {/* Left: Queue List */}
        <div className="surface-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#fff', marginBottom: '4px' }}>
            Pending Queue ({submissions.length})
          </h3>

          {submissions.map((sub) => {
            const isSelected = sub.id === selectedSubId;
            const hasHighAlert = sub.integritySignals.some(s => s.severity === 'high');

            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubId(sub.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                    {sub.studentName}
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {sub.submittedAt}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {sub.challengeTitle}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>
                    {sub.testsPassed} Tests Passed
                  </span>

                  {hasHighAlert && (
                    <span className="badge badge-advanced" style={{ fontSize: '0.625rem' }}>
                      Flagged Telemetry
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Inspection & Code Replay */}
        <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Header Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Submission Inspection • {currentSub.id}
              </div>
              <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>{currentSub.studentName} ({currentSub.studentEmail})</h2>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Challenge: <strong>{currentSub.challengeTitle}</strong> • Runtime: <strong>{currentSub.runtimeMs}ms</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleDecision('approved')} className="btn btn-primary" style={{ background: '#10b981', fontSize: '0.75rem' }}>
                <CheckCircle2 size={13} /> Approve Solution
              </button>
              <button onClick={() => handleDecision('viva_requested')} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
                <Sparkles size={13} /> Request AI Viva
              </button>
            </div>
          </div>

          {/* Explainable Integrity Signals Panel */}
          <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Explainable Proctoring & Editor Telemetry Signals
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentSub.integritySignals.map((sig, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '0.75rem',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-xs)',
                    background: sig.severity === 'high' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${sig.severity === 'high' ? 'rgba(244, 63, 94, 0.25)' : 'var(--border-subtle)'}`
                  }}
                >
                  <AlertTriangle size={14} color={sig.severity === 'high' ? '#f43f5e' : '#34d399'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: sig.severity === 'high' ? '#fb7185' : '#c7d2fe' }}>{sig.label}: </strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{sig.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Code Viewer */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Submitted Source Code
            </h4>
            <pre
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                background: '#090e18',
                border: '1px solid var(--border-subtle)',
                color: '#e2e8f0',
                fontSize: '0.8125rem',
                fontFamily: "'Fira Code', monospace",
                lineHeight: 1.5,
                overflowX: 'auto'
              }}
            >
              {currentSub.code}
            </pre>
          </div>

          {/* Human Review Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Evaluator Decision Rationale Notes
            </label>
            <textarea
              rows={2}
              placeholder="Record rationale for approval or follow-up interview request..."
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="form-textarea"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
