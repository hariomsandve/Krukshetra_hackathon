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
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const viva = mockData.codeViva;
  const replay = mockData.sessionReplay;

  const submissionCode = `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) {
                return new int[]{seen.get(need), i};
            }
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
    <div className="p-5 sm:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full bg-[#faf9f5] min-h-full text-neutral-900 select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-200">
              <Mic className="w-3.5 h-3.5" />
              <span>MentOS Oral AI Viva Defense</span>
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              Candidate: {mockData.currentUser.displayName} • Two Sum
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Interactive AI Code Viva & Session Integrity
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            Adaptive voice & text interrogation to verify algorithmic reasoning, authorship, and solution comprehension.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              if (onOpenVoiceTutor) onOpenVoiceTutor();
            }}
            className="px-3.5 py-1.5 rounded-xl border border-[#dedcd5] hover:bg-[#edebe5] text-xs font-semibold text-neutral-800 flex items-center gap-2 transition-colors cursor-pointer bg-white shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-purple-700" />
            <span>Launch Voice Agent</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span>Live Viva Ready</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#dedcd5] pb-1">
        <button
          onClick={() => setActiveTab('viva')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'viva'
              ? 'text-neutral-900 border-b-2 border-neutral-900 font-bold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Oral Interrogation ({viva.questions.length} Probes)</span>
        </button>
        <button
          onClick={() => setActiveTab('replay')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'replay'
              ? 'text-neutral-900 border-b-2 border-neutral-900 font-bold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Session Replay & Integrity Signals ({replay.integritySignals.length})</span>
        </button>
      </div>

      {/* TAB 1: VIVA ORAL INTERROGATION */}
      {activeTab === 'viva' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Candidate's Code Submission */}
          <div className="lg:col-span-5 bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-700" />
                <h3 className="text-sm font-bold text-neutral-900">Candidate Submission</h3>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Java 17 • Two Sum
              </span>
            </div>

            <pre className="flex-1 bg-[#18181b] border border-neutral-800 rounded-xl p-4 text-neutral-100 text-xs font-mono leading-relaxed overflow-x-auto shadow-inner">
              <code>{submissionCode}</code>
            </pre>

            <div className="mt-3 p-3 rounded-xl bg-[#faf9f5] border border-[#ecebe7] text-[11px] text-neutral-600 leading-normal">
              AI Verification evaluates algorithmic logic, time complexity trade-offs, and edge case handling.
            </div>
          </div>

          {/* Right Column: Active Question & Live Defense */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                    Probe {currentQuestionIdx + 1} of {viva.questions.length}
                  </span>
                  <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {currentQ?.category}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700">
                  Max: {currentQ?.maxPoints} pts
                </span>
              </div>

              <h2 className="text-base sm:text-xl font-bold text-neutral-900 leading-snug">
                "{currentQ?.question}"
              </h2>

              {/* Expected Key Concepts */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Key Expected Rationales:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentQ?.expectedTopics?.map((topic, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium"
                    >
                      • {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Response Input Area */}
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <textarea
                    rows={4}
                    placeholder="Speak your defense or type your technical explanation here..."
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    className={`w-full bg-[#faf9f5] border text-xs sm:text-sm text-neutral-900 p-3.5 rounded-xl outline-none transition-all placeholder:text-neutral-400 ${
                      isRecording
                        ? 'border-purple-600 ring-2 ring-purple-100 bg-white'
                        : 'border-[#dedcd5] focus:border-neutral-900 focus:bg-white'
                    }`}
                  />
                  {isRecording && (
                    <div className="absolute right-3 top-3 flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                      <span>Recording speech...</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMic}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        isRecording
                          ? 'bg-rose-600 text-white border-rose-700'
                          : 'bg-white hover:bg-[#edebe5] text-neutral-800 border-[#dedcd5]'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isRecording ? 'Stop Recording' : 'Speak via Mic'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePreFillSample}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-fill Sample</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentQuestionIdx > 0 && (
                      <button
                        onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-neutral-700 bg-white hover:bg-[#edebe5] border border-[#dedcd5] transition-colors cursor-pointer"
                      >
                        Previous
                      </button>
                    )}
                    <button
                      onClick={handleSubmitResponse}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Submit Response</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Evaluator Feedback Score Card */}
            {showEvaluation && (
              <div className="bg-[#faf9f5] border border-purple-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-700" />
                    <h3 className="text-base font-bold text-neutral-900">
                      MentOS AI Viva Evaluation Scorecard
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-emerald-700">
                      {viva.sampleFeedback.score}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      / {viva.sampleFeedback.maxScore} pts (80%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Strengths */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Demonstrated Strengths
                    </span>
                    <ul className="text-xs text-neutral-700 space-y-1 pl-4 list-disc">
                      {viva.sampleFeedback.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                    <span className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Areas to Elaborate
                    </span>
                    <ul className="text-xs text-neutral-700 space-y-1 pl-4 list-disc">
                      {viva.sampleFeedback.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-500 text-right pt-1 font-mono">
                  {viva.sampleFeedback.notice}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SESSION REPLAY & INTEGRITY SIGNALS */}
      {activeTab === 'replay' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Replay Timeline Events */}
          <div className="lg:col-span-8 bg-white border border-[#e5e3dc] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ecebe7]">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Keystroke & Event Timeline</h3>
                <p className="text-xs text-neutral-500">
                  Chronological record of candidate interaction in the coding workspace
                </p>
              </div>
              <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#faf9f5] border border-[#dedcd5] text-neutral-600">
                Duration: {Math.floor(replay.durationSeconds / 60)}m {replay.durationSeconds % 60}s
              </span>
            </div>

            <div className="space-y-2">
              {replay.events.map((evt) => {
                const isPaste = evt.type === 'paste';
                const isTab = evt.type === 'tab-visibility';
                const isRun = evt.type === 'run';

                return (
                  <div
                    key={evt.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      isPaste
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : isTab
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : isRun
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-[#faf9f5] border-[#ecebe7] text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-neutral-500 text-[11px] w-12 shrink-0">
                        T+{evt.timeSeconds}s
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900">{evt.label}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/70 border border-current">
                            {evt.evidence}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600 mt-0.5">{evt.details}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Integrity Signals */}
          <div className="lg:col-span-4 bg-white border border-[#e5e3dc] rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#ecebe7]">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-neutral-900">Integrity Signals for Review</h3>
              </div>

              <div className="space-y-2">
                {replay.integritySignals.map((signal) => (
                  <div
                    key={signal.id}
                    className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950">{signal.label}</span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                        {signal.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600">{signal.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#ecebe7] space-y-2">
              <span className="text-[11px] font-semibold text-neutral-500">Human Evaluator Action:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => alert("Marked as Verified Authentic by Evaluator.")}
                  className="flex-1 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  ✓ Authentic
                </button>
                <button
                  onClick={() => alert("Flagged for secondary trainer oral interview.")}
                  className="flex-1 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
                >
                  ⚠ Flag Probe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeVivaWorkspace;
