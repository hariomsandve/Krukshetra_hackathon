import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  CheckCircle2, 
  Terminal, 
  Clock, 
  FileText, 
  Sparkles, 
  RotateCcw, 
  AlertCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { Badge } from '../../components/common/Badge';
import { mockCodingChallenges } from '../../data/mockData';
import { CodingChallenge } from '../../types';

export const CodingChallengePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge>(mockCodingChallenges[0]);
  const [code, setCode] = useState<string>(selectedChallenge.starterCode);
  const [language, setLanguage] = useState<'TypeScript' | 'Python' | 'Java'>('TypeScript');
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ id: string; passed: boolean; durationMs: number }[] | null>(null);
  const [allPassed, setAllPassed] = useState<boolean>(false);

  const handleSelectChallenge = (ch: CodingChallenge) => {
    setSelectedChallenge(ch);
    setCode(ch.starterCode);
    setTestResults(null);
    setAllPassed(false);
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
      const results = selectedChallenge.testCases.map((tc, idx) => ({
        id: tc.id,
        passed: true,
        durationMs: 14 + idx * 4,
      }));
      setTestResults(results);
      setAllPassed(true);
      showToast('All 4 test cases passed! Proceed to Explain Your Code for evaluation.');
    }, 1200);
  };

  const handleProceedToExplain = () => {
    navigate('/explain-code', { 
      state: { 
        challenge: selectedChallenge,
        submittedCode: code,
        language 
      } 
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive Coding Challenges"
        subtitle="Write optimal algorithms and verify edge cases with simulated test suites before explaining your logic."
        badgeText="Hands-On Proof"
      >
        <div className="flex items-center gap-2">
          {mockCodingChallenges.map(ch => (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(ch)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedChallenge.id === ch.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {ch.title.split(':')[0]}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Problem Statement & Examples (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                {selectedChallenge.topic}
              </span>
              <Badge variant={selectedChallenge.difficulty} size="sm">
                {selectedChallenge.difficulty.toUpperCase()}
              </Badge>
            </div>
            <h2 className="text-lg font-black text-slate-900 leading-snug">
              {selectedChallenge.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Recommended time: {selectedChallenge.timeLimitMinutes} mins</span>
            </div>
          </div>

          <div className="prose prose-sm text-slate-600 text-xs leading-relaxed space-y-3">
            <p>{selectedChallenge.problemStatement}</p>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Example Test Cases
            </h4>
            {selectedChallenge.examples.map((ex, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono space-y-1">
                <div><span className="text-slate-400">Input:</span> <span className="text-indigo-700 font-semibold">{ex.input}</span></div>
                <div><span className="text-slate-400">Output:</span> <span className="text-emerald-700 font-semibold">{ex.output}</span></div>
                {ex.explanation && (
                  <p className="font-sans text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-normal">
                    {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Hints */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Algorithmic Hint</span>
            </div>
            <p className="text-amber-800 text-[11px]">
              {selectedChallenge.hints[0]}
            </p>
          </div>
        </div>

        {/* Right Column: Code Editor & Test Runner (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
            
            {/* Editor Toolbar */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-slate-400 text-[11px] pl-2">
                  solution.{language === 'TypeScript' ? 'ts' : language === 'Python' ? 'py' : 'java'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python 3.12</option>
                  <option value="Java">Java 21</option>
                </select>
                <button
                  onClick={() => setCode(selectedChallenge.starterCode)}
                  className="p-1 text-slate-400 hover:text-slate-200"
                  title="Reset code template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={14}
                className="w-full bg-transparent text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-600 selection:text-white"
                spellCheck={false}
              />
            </div>

            {/* Editor Bottom Actions */}
            <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                Simulated Sandbox
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-300" />
                  <span>{isRunningTests ? 'Running...' : 'Run Test Cases'}</span>
                </button>

                <button
                  onClick={handleProceedToExplain}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Explain Your Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Test Results Output Drawer */}
          {testResults && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Test Execution Succeeded: 4 / 4 Test Cases Passed
                  </h4>
                </div>
                <Badge variant="success" size="sm">
                  100% Correctness
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedChallenge.testCases.map((tc, idx) => (
                  <div key={tc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{tc.description}</span>
                      <span className="font-mono text-[11px] text-slate-500">Exp: {tc.expectedOutput}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-emerald-600 block">Passed</span>
                      <span className="text-[10px] text-slate-400">{12 + idx * 3}ms</span>
                    </div>
                  </div>
                ))}
              </div>

              {allPassed && (
                <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <p className="text-xs text-indigo-900 font-semibold">
                      Next Core Activity: Explain your algorithmic approach to get evaluated on clarity and complexity.
                    </p>
                  </div>
                  <button
                    onClick={handleProceedToExplain}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 transition-colors"
                  >
                    Proceed Now
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
