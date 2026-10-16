import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  Play,
  RotateCcw,
  Code2,
  FileText,
  Volume2,
  Activity,
  ArrowRight,
  User,
  Info
} from 'lucide-react';
import { mockData } from '../../data/mockData';

export const CodeVivaWorkspace = ({ onBack, onOpenVoiceTutor }) => {
  const [activeTab, setActiveTab] = useState('viva'); // 'viva' | 'replay'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState({
    0: mockData.codeViva?.sampleResponses?.[0]?.response || '',
    1: mockData.codeViva?.sampleResponses?.[1]?.response || ''
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(true);

  const viva = mockData.codeViva || {
    questions: [],
    sampleResponses: [],
    sampleFeedback: {
      strengths: ['Explains the complement lookup correctly'],
      improvements: ['Discuss worst-case hash map behavior', 'Mention edge cases explicitly'],
      score: 12,
      maxScore: 15
    }
  };

  const replay = mockData.sessionReplay || {
    sessionId: 'replay-001',
    durationSeconds: 642,
    events: [],
    integritySignals: []
  };

  const submissionCode = mockData.codingWorkspace?.sampleSubmission?.code?.replace(/\\n/g, '\n') || `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) return new int[]{seen.get(need), i};
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`;

  const currentQ = viva.questions[currentQuestionIdx] || viva.questions[0];

  const handlePreFillSample = () => {
    const sample = viva.sampleResponses.find(r => r.questionId === currentQ.id);
    if (sample) {
      setUserResponse(sample.response);
    } else {
      setUserResponse("To optimize the solution, we check for the required complement in O(1) average time.");
    }
  };

  const handleSubmitResponse = () => {
    if (!userResponse.trim()) return;
    setSubmittedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: userResponse.trim()
    }));
    setUserResponse('');
    if (currentQuestionIdx < viva.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setIsEvaluating(true);
      setTimeout(() => {
        setIsEvaluating(false);
        setShowEvaluation(true);
      }, 800);
    }
  };

  const toggleMic = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setUserResponse("On average the map lookup is constant time, and we process each element once, so total time is O(n).");
    }
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c4b5fd' }}>
              <Mic size={12} style={{ marginRight: '4px' }} /> Mentos Oral AI Viva Defense
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Candidate: {mockData.currentUser.displayName} • Two Sum
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Interactive AI Code Viva & Session Integrity
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            2-minute voice/text adaptive interrogation to verify authorship, algorithmic reasoning, and code comprehension.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              if (onOpenVoiceTutor) onOpenVoiceTutor();
            }}
            className="btn btn-secondary"
            style={{ fontSize: '0.78125rem', padding: '7px 14px', gap: '6px' }}
          >
            <Volume2 size={14} color="#a855f7" /> Launch Voice Agent
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#34d399' }}>Live Viva Ready</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('viva')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'viva' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'viva' ? '#fff' : 'var(--text-muted)',
            fontWeight: activeTab === 'viva' ? 600 : 400,
            fontSize: '0.875rem',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Mic size={15} /> Oral Interrogation ({viva.questions.length} Probes)
        </button>
        <button
          onClick={() => setActiveTab('replay')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'replay' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'replay' ? '#fff' : 'var(--text-muted)',
            fontWeight: activeTab === 'replay' ? 600 : 400,
            fontSize: '0.875rem',
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShieldAlert size={15} /> Session Replay & Integrity Signals ({replay.integritySignals.length})
        </button>
      </div>

      {/* TAB 1: VIVA ORAL INTERROGATION */}
      {activeTab === 'viva' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(380px, 460px) 1fr', gap: '20px' }}>
          {/* Left Column: Candidate's Code Submission */}
          <div className="surface-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', background: 'rgba(16, 22, 38, 0.75)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code2 size={16} color="#a855f7" />
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff' }}>Candidate Submission</h3>
              </div>
              <span className="badge" style={{ fontSize: '0.6875rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                Java 17 • Two Sum
              </span>
            </div>

            <pre
              style={{
                flex: 1,
                background: '#090d16',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                color: '#e2e8f0',
                fontSize: '0.78125rem',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                lineHeight: 1.6,
                overflowX: 'auto',
                whiteSpace: 'pre'
              }}
            >
              <code>{submissionCode}</code>
            </pre>

            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
              <span>AI Verification: Evaluates algorithmic logic, time complexity justification, and test coverage reasoning.</span>
            </div>
          </div>

          {/* Right Column: AI Interrogator Questions & Live Defense */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Active Question Box */}
            <div className="surface-card" style={{ padding: '24px', background: 'rgba(16, 22, 38, 0.75)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c4b5fd' }}>
                    Probe {currentQuestionIdx + 1} of {viva.questions.length}
                  </span>
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Category: {currentQ?.category}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                  Max: {currentQ?.maxPoints} pts
                </span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: '14px' }}>
                "{currentQ?.question}"
              </h2>

              {/* Expected Key Concepts */}
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  Key Expected Rationales:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {currentQ?.expectedTopics?.map((topic, i) => (
                    <span key={i} className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                      • {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Response Input Area (Mic / Text) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <textarea
                    rows={4}
                    placeholder="Speak your defense or type explanation here..."
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    className="form-input"
                    style={{
                      width: '100%',
                      background: '#090d16',
                      borderColor: isRecording ? '#a855f7' : 'var(--border-subtle)',
                      boxShadow: isRecording ? '0 0 12px rgba(168, 85, 247, 0.3)' : 'none',
                      fontSize: '0.84375rem',
                      lineHeight: 1.5,
                      padding: '12px 14px',
                      resize: 'vertical'
                    }}
                  />
                  {isRecording && (
                    <div style={{ position: 'absolute', right: '12px', top: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', color: '#a855f7' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', animation: 'pulse 1s infinite' }} />
                      Transcribing live speech...
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={toggleMic}
                      className={isRecording ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ fontSize: '0.75rem', padding: '6px 14px', gap: '6px' }}
                    >
                      {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                      {isRecording ? 'Stop Recording' : 'Speak via Mic'}
                    </button>

                    <button
                      type="button"
                      onClick={handlePreFillSample}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px 12px', color: '#c4b5fd' }}
                    >
                      <Sparkles size={13} style={{ marginRight: '4px' }} /> Auto-fill Sample Answer
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {currentQuestionIdx > 0 && (
                      <button
                        onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                      >
                        Previous
                      </button>
                    )}
                    <button
                      onClick={handleSubmitResponse}
                      className="btn btn-primary"
                      style={{ fontSize: '0.75rem', padding: '6px 18px', gap: '6px' }}
                    >
                      Submit Response <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Evaluator Feedback Score Card */}
            {showEvaluation && (
              <div className="surface-card" style={{ padding: '22px', background: 'rgba(16, 22, 38, 0.75)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={18} color="#a855f7" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                      Mentos AI Viva Evaluation
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{viva.sampleFeedback.score}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>/ {viva.sampleFeedback.maxScore} pts (80%)</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                  {/* Strengths */}
                  <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <CheckCircle2 size={12} /> Demonstrated Strengths
                    </span>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78125rem', color: '#e2e8f0' }}>
                      {viva.sampleFeedback.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <AlertTriangle size={12} /> Areas to Elaborate
                    </span>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78125rem', color: '#e2e8f0' }}>
                      {viva.sampleFeedback.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {viva.sampleFeedback.notice}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SESSION REPLAY & INTEGRITY SIGNALS */}
      {activeTab === 'replay' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
          {/* Replay Timeline Events */}
          <div className="surface-card" style={{ padding: '22px', background: 'rgba(16, 22, 38, 0.75)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Assessment Keystroke & Event Timeline</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Full chronological record of candidate interaction within the coding workspace</p>
              </div>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
                Total Duration: {Math.floor(replay.durationSeconds / 60)}m {replay.durationSeconds % 60}s
              </span>
            </div>

            {/* Event List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {replay.events.map((evt) => {
                const isPaste = evt.type === 'paste';
                const isTab = evt.type === 'tab-visibility';
                const isRun = evt.type === 'run';
                const color = isPaste ? '#ef4444' : isTab ? '#f59e0b' : isRun ? '#10b981' : '#818cf8';
                const bg = isPaste ? 'rgba(239, 68, 68, 0.08)' : isTab ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)';

                return (
                  <div
                    key={evt.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: bg,
                      border: `1px solid ${isPaste || isTab ? 'rgba(255, 255, 255, 0.1)' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', width: '50px' }}>
                        T+{evt.timeSeconds}s
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.84375rem', fontWeight: 600, color: '#fff' }}>
                            {evt.label}
                          </span>
                          <span className="badge" style={{ fontSize: '0.625rem', color, border: `1px solid ${color}40` }}>
                            {evt.evidence}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                          {evt.details}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Integrity Signals & Human Review Queue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="surface-card" style={{ padding: '22px', background: 'rgba(16, 22, 38, 0.75)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <ShieldAlert size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#fff' }}>
                  Integrity Signals for Review
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {replay.integritySignals.map((signal) => (
                  <div
                    key={signal.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(245, 158, 11, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fbbf24' }}>
                        {signal.label}
                      </span>
                      <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.65rem' }}>
                        {signal.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {signal.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Human Review Status:
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => alert("Marked as Verified Authentic by Evaluator.")}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.71875rem', color: '#10b981' }}
                  >
                    <CheckCircle2 size={13} style={{ marginRight: '4px' }} /> Authentic
                  </button>
                  <button
                    onClick={() => alert("Flagged for secondary trainer oral interview.")}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.71875rem', color: '#f59e0b' }}
                  >
                    <AlertTriangle size={13} style={{ marginRight: '4px' }} /> Flag Probe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeVivaWorkspace;
