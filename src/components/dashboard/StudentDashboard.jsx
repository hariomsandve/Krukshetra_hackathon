import React from 'react';
import {
  Sparkles,
  Zap,
  Play,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Mic,
  Award,
  Layers,
  Check,
  Lock,
  ExternalLink,
  BrainCircuit,
  Activity,
  FileCode2,
  ChevronRight
} from 'lucide-react';

export const StudentDashboard = ({ onNavigate, courses, onSelectCourse, onOpenVoiceTutor }) => {
  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* 1. Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 9px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#c4b5fd',
                letterSpacing: '0.04em'
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#a855f7' }} />
              ADAPTIVE LEARNING STATE
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last synced 4m ago</span>
          </div>

          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: '6px' }}>
            Your Learning Overview
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Understand your progress and discover what to focus on next.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('assessments')}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8125rem' }}
          >
            <Zap size={14} color="#f59e0b" /> Daily Knowledge Check <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>5 min</span>
          </button>

          <button
            onClick={() => onNavigate('coding-workspace')}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.8125rem', gap: '6px' }}
          >
            <Play size={14} fill="currentColor" /> Resume Path: Data Structures & Algorithms
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Grid (5 Cards from Image 1) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        {/* Card 1: Estimated Mastery */}
        <div className="surface-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              ESTIMATED MASTERY
            </span>
            <BrainCircuit size={15} color="#c084fc" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '14px 0 8px' }}>
            {/* SVG Ring 74% */}
            <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="23" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="5" />
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="5"
                  strokeDasharray="144.5"
                  strokeDashoffset="37.5"
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 800, color: '#fff' }}>
                74%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <TrendingUp size={12} /> +6% this week
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                DSA & System Core I...
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Mastered Concepts */}
        <div className="surface-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              MASTERED CONCEPTS
            </span>
            <CheckCircle2 size={15} color="#34d399" />
          </div>
          <div style={{ margin: '12px 0 6px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              42 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Topics</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Arrays, Linked Lists,...
            </div>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#a855f7' }} />
            Retention &gt; 90%
          </div>
        </div>

        {/* Card 3: Needs Reinforcement */}
        <div className="surface-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              NEEDS REINFORCEMENT
            </span>
            <span style={{ fontSize: '0.6875rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              7 Flagged
            </span>
          </div>
          <div style={{ margin: '12px 0 6px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
              7 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Topics</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Hash Collisions, Tree...
            </div>
          </div>
          <div
            onClick={() => onNavigate('concept-map')}
            style={{ fontSize: '0.6875rem', color: '#fbbf24', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
          >
            View practice queue →
          </div>
        </div>

        {/* Card 4: Active Streak */}
        <div className="surface-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              ACTIVE STREAK
            </span>
            <Flame size={15} color="#a855f7" />
          </div>
          <div style={{ margin: '12px 0 6px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              14 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Days In Flow</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              12.5 hrs logged this sprint
            </div>
          </div>
          <div style={{ width: '100%', height: '5px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* Card 5: Assessments */}
        <div className="surface-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              ASSESSMENTS
            </span>
            <Award size={15} color="#ec4899" />
          </div>
          <div style={{ margin: '12px 0 6px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              18 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Sessions</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px', fontWeight: 600 }}>
              ✓ 92% avg test pass rate
            </div>
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            Verified code viva & run
          </div>
        </div>
      </div>

      {/* 3. Recommended for You Section (3 Cards from Image 1) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={16} color="#a855f7" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Recommended for You
            </h2>
            <span
              style={{
                fontSize: '0.6875rem',
                background: 'rgba(139, 92, 246, 0.12)',
                color: '#c4b5fd',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600
              }}
            >
              Engine v2.4 • Dynamic Weighting
            </span>
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Prioritized by cognitive dependency graph
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Recommendation 1: High Priority Focus */}
          <div
            className="surface-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'rgba(16, 22, 38, 0.7)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f43f5e' }} />
                  High Priority Focus
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> 25 mins
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                Hash Map Collision Handling & Rehashing
              </h3>

              {/* Why Mentos Recommends It box */}
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  fontSize: '0.75rem',
                  color: '#cbd5e1',
                  lineHeight: 1.5,
                  marginBottom: '12px'
                }}
              >
                <strong style={{ color: '#c4b5fd' }}>Why Mentos recommends it:</strong> Understanding arrays and hash functions is strong (88%), but collision resolution and dynamic resizing need reinforcement before B-Trees.
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>Target: Amortized Complexity</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>Prerequisite: & Open Addressing</span>
                <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>Interactive Coding</span>
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>Core DSA</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Step 4 of 6 in Hashing</span>
              <button
                onClick={() => onNavigate('coding-workspace')}
                className="btn btn-primary"
                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
              >
                Start Practice <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Recommendation 2: Reinforcement Node */}
          <div
            className="surface-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'rgba(16, 22, 38, 0.7)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7' }} />
                  Reinforcement Node
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> 35 mins
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                Dijkstra's Algorithm & Priority Queue Implementation
              </h3>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                Graphs fundamentals completed yesterday. Reinforce weighted graphs with shortest path before progressing to Bellman-Ford and Network Flow.
              </p>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Graph Traversal Baseline</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>94% Retention</span>
                </div>
                <div style={{ width: '100%', height: '5px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ width: '94%', height: '100%', background: '#34d399', borderRadius: '9999px' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visual Node Explorer</span>
              <button
                onClick={() => onNavigate('concept-map')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 14px', gap: '6px' }}
              >
                <Compass size={13} /> Explore Concept Map
              </button>
            </div>
          </div>

          {/* Recommendation 3: Viva Assessment */}
          <div
            className="surface-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'rgba(16, 22, 38, 0.7)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899' }} />
                  Viva Assessment
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> 20 mins
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                Concurrency & Deadlock Prevention (OS Concepts)
              </h3>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                Verify mental models on mutex lock hierarchies, dining philosophers edge-cases, and thread contention through conversational probe.
              </p>

              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(236, 72, 153, 0.08)',
                  border: '1px solid rgba(236, 72, 153, 0.15)',
                  fontSize: '0.75rem',
                  color: '#cbd5e1',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Mic size={15} color="#ec4899" />
                <span>Interactive Audio / Text Probe: 3 core questions + counter-examples</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spoken or typed response</span>
              <button
                onClick={onOpenVoiceTutor || (() => onNavigate('viva'))}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 14px', gap: '6px', borderColor: 'rgba(236, 72, 153, 0.3)' }}
              >
                <Mic size={13} color="#ec4899" /> Start Quick Viva
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Roadmap Section (Phase 2 of 4 from Image 1) */}
      <div className="surface-card" style={{ padding: '22px 24px', background: 'rgba(16, 22, 38, 0.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#a855f7', letterSpacing: '0.05em', marginBottom: '2px' }}>
              ACTIVE ROADMAP • Phase 2 of 4
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Full Stack & Algorithms Pathway — Phase 2: Advanced Data Structures
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              68% <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Phase Completion</span>
            </span>
            <ExternalLink size={15} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => onNavigate('adaptive-path')} />
          </div>
        </div>

        {/* Roadmap Nodes Progress Path */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', margin: '20px 0 16px' }}>
          {/* Step 1 */}
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <Check size={14} color="#10b981" />
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff' }}>Linear Lists & Deques</div>
            <div style={{ fontSize: '0.6875rem', color: '#10b981', marginTop: '2px' }}>100% Mastered</div>
          </div>

          {/* Step 2 */}
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <Check size={14} color="#10b981" />
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff' }}>Binary Search Trees</div>
            <div style={{ fontSize: '0.6875rem', color: '#10b981', marginTop: '2px' }}>Passed (94%)</div>
          </div>

          {/* Step 3: Current Focus */}
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(168, 85, 247, 0.08)', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.25)', border: '2px solid #a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#fff' }}>AVL & Red-Black Trees</div>
            <div style={{ fontSize: '0.6875rem', color: '#c4b5fd', marginTop: '2px', fontWeight: 600 }}>Current Focus</div>
          </div>

          {/* Step 4: Locked */}
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <Lock size={12} color="var(--text-disabled)" />
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Tria & Suffix Automata</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-disabled)', marginTop: '2px' }}>Prerequisite Locked</div>
          </div>

          {/* Step 5: Locked */}
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <Lock size={12} color="var(--text-disabled)" />
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Segment Trees & Fenwick</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-disabled)', marginTop: '2px' }}>Phase 3 Gate</div>
          </div>
        </div>

        {/* Unlock info banner */}
        <div
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
            <Sparkles size={14} color="#a855f7" />
            <span>Next unlock: <strong>B-Trees & LSM Indexes</strong> will become available after finishing 2 more rotations in AVL trees.</span>
          </div>
          <span
            onClick={() => onNavigate('courses')}
            style={{ color: '#c4b5fd', cursor: 'pointer', fontWeight: 600 }}
          >
            View Syllabus Details →
          </span>
        </div>
      </div>

      {/* 5. Bottom Row: Recent Activity & Knowledge Retention + Tutor Notes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Left: Recent Activity */}
        <div className="surface-card" style={{ padding: '20px 24px', background: 'rgba(16, 22, 38, 0.7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff' }}>
                Recent Activity & Knowledge Retention
              </h3>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Automated Ebbinghaus memory curve tracking
              </div>
            </div>
            <span
              onClick={() => onNavigate('analytics')}
              style={{ fontSize: '0.75rem', color: '#c4b5fd', cursor: 'pointer', fontWeight: 600 }}
            >
              Full Analytics ›
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Activity 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileCode2 size={16} color="#818cf8" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>Graph BFS/DFS Edge Cases</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    12 test cases passed • <span style={{ color: '#34d399' }}>Score 98/100</span> • Yesterday
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Memory Health</div>
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>96% Optimal</div>
              </div>
            </div>

            {/* Activity 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={16} color="#fbbf24" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>QuickSort Partitioning & Pivot Selection</div>
                  <div style={{ fontSize: '0.6875rem', color: '#fbbf24' }}>
                    Review in 2 days to maintain 95% retention
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Memory Health</div>
                <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>78% Diminishing</div>
              </div>
            </div>

            {/* Activity 3 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mic size={16} color="#c084fc" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>AI Viva: Amortized Constant Time & Vector Resizing</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    14 min audio conversation • <span style={{ color: '#c084fc' }}>Mastery Confirmed</span> • 3 days ago
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Memory Health</div>
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>91% Stable</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tutor Notes */}
        <div className="surface-card" style={{ padding: '20px 24px', background: 'rgba(16, 22, 38, 0.7)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                TUTOR NOTES
              </span>
              <Sparkles size={15} color="#a855f7" />
            </div>

            {/* Banner card */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                marginBottom: '14px'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.25)', color: '#e9d5ff' }}>Cognitive Load Profile</span>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#6ee7b7' }}>Deep Flow</span>
              </div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                Weekly Synthesis
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                You've solved algorithmic proofs 2.4x faster during morning sessions. Prioritizing tree balance rotations before Friday will unlock System Design Caching architectures smoothly.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              AI Coach Online
            </span>
            <button
              onClick={() => onNavigate('chat')}
              className="btn btn-purple-subtle"
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              Open dialogue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
