import React from 'react';
import {
  Route,
  CheckCircle2,
  Lock,
  AlertTriangle,
  PlayCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Compass
} from 'lucide-react';

export const AdaptiveLearningPath = ({ course, onNavigate }) => {
  const pathSteps = [
    {
      id: "step-1",
      title: "Memory Addressing & Pointers",
      status: "mastered",
      score: 95,
      reason: "Mastery demonstrated via quiz and sample pointers test (O(1) lookups).",
      estimatedMinutes: 25,
      tier: 0
    },
    {
      id: "step-2",
      title: "Linked Nodes & Sentinel Lists",
      status: "mastered",
      score: 88,
      reason: "Prerequisites satisfied. Implemented two-pointer cycle detection.",
      estimatedMinutes: 35,
      tier: 1
    },
    {
      id: "step-3",
      title: "Stacks & Monotonic Queues",
      status: "in-progress",
      score: 64,
      reason: "In-progress: Completed monotonic stack basics; needs parentheses matching review.",
      estimatedMinutes: 30,
      tier: 2
    },
    {
      id: "step-4",
      title: "Binary Search Trees (BST Invariants)",
      status: "weak",
      score: 48,
      reason: "Knowledge gap detected: 2 incorrect submissions on recursive DFS left/right bound validation.",
      estimatedMinutes: 45,
      tier: 2
    },
    {
      id: "step-5",
      title: "DAG Cycle Detection & Topological Sort",
      status: "recommended",
      score: null,
      reason: "Current target: Unlock after reinforcing BST traversals. Essential for course capstone.",
      estimatedMinutes: 50,
      tier: 3
    },
    {
      id: "step-6",
      title: "Dynamic Programming on Trees",
      status: "locked",
      score: null,
      reason: "Locked: Requires 80%+ mastery on DAG Cycle Detection and BSTs.",
      estimatedMinutes: 60,
      tier: 4
    }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Route size={18} color="#818cf8" />
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              Adaptive Learning Path
            </h1>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Personalized concept roadmap generated from assessment diagnostic signals and prerequisite DAG dependencies.
          </p>
        </div>

        <button onClick={() => onNavigate('concept-map')} className="btn btn-secondary">
          <Compass size={15} /> View Full Concept DAG
        </button>
      </div>

      {/* Adaptive Rationale Banner */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <Sparkles size={20} color="#818cf8" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem', color: '#c7d2fe' }}>
          <strong>Next Action Identified:</strong> Reinforce <strong>Binary Search Trees</strong> to eliminate prerequisite gaps before advancing to <strong>Topological Sort</strong>.
        </div>
      </div>

      {/* Ordered Progression Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pathSteps.map((step, idx) => {
          const isMastered = step.status === 'mastered';
          const isWeak = step.status === 'weak';
          const isRecommended = step.status === 'recommended';
          const isLocked = step.status === 'locked';
          const isInProgress = step.status === 'in-progress';

          return (
            <div
              key={step.id}
              className="surface-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${
                  isMastered
                    ? '#10b981'
                    : isWeak
                    ? '#f43f5e'
                    : isRecommended
                    ? '#818cf8'
                    : isInProgress
                    ? '#06b6d4'
                    : '#475569'
                }`,
                opacity: isLocked ? 0.6 : 1
              }}
            >
              {/* Left Column: Index & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isMastered
                      ? 'rgba(16, 185, 129, 0.15)'
                      : isWeak
                      ? 'rgba(244, 63, 94, 0.15)'
                      : isRecommended
                      ? 'rgba(99, 102, 241, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isMastered ? '#10b981' : isWeak ? '#fb7185' : isRecommended ? '#818cf8' : '#94a3b8',
                    flexShrink: 0
                  }}
                >
                  {isMastered ? <CheckCircle2 size={16} /> : isLocked ? <Lock size={15} /> : idx + 1}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '0.9375rem', color: '#fff' }}>{step.title}</h3>
                    <span className={`badge badge-${step.status}`}>
                      {step.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    {step.reason}
                  </p>
                </div>
              </div>

              {/* Right Column: Score & Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div>Tier {step.tier}</div>
                  {step.score !== null ? (
                    <div style={{ color: step.score >= 80 ? '#34d399' : '#fb7185', fontWeight: 600 }}>
                      {step.score}% Mastery
                    </div>
                  ) : (
                    <div>{step.estimatedMinutes} mins</div>
                  )}
                </div>

                {!isLocked && (
                  <button
                    onClick={() => onNavigate('coding-workspace')}
                    className={`btn ${isRecommended || isWeak ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                  >
                    {isWeak ? 'Reinforce Concept' : isMastered ? 'Review Practice' : 'Start Practice'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
