import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import './VoiceCodingMentor.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const MAX_CODE_LENGTH = 20_000;
const MAX_OUTPUT_LENGTH = 4_000;
const LANGUAGE_OPTIONS = [
    ['javascript', 'JavaScript'],
    ['typescript', 'TypeScript'],
    ['python', 'Python'],
    ['java', 'Java'],
    ['c', 'C'],
    ['cpp', 'C++'],
    ['csharp', 'C#'],
    ['go', 'Go'],
    ['rust', 'Rust'],
    ['php', 'PHP'],
    ['ruby', 'Ruby'],
    ['html', 'HTML'],
    ['css', 'CSS'],
    ['json', 'JSON'],
    ['sql', 'SQL'],
    ['markdown', 'Markdown'],
    ['shell', 'Shell'],
];
const DEFAULT_STARTER_CODE = `function greet(name) {
  return "Hello, " + name;
}

console.log(greet("learner"));`;

function VoiceCodingMentor({
    code: externalCode,
    setCode: setExternalCode,
    language: externalLanguage,
    setLanguage: setExternalLanguage,
    diagnostics: externalDiagnostics,
    setDiagnostics: setExternalDiagnostics,
    compilerOutput: externalCompilerOutput,
    setCompilerOutput: setExternalCompilerOutput,
    onOpenChatWithAction,
    onNavigateToViva
}) {
    const [localCode, setLocalCode] = useState(DEFAULT_STARTER_CODE);
    const [localLanguage, setLocalLanguage] = useState('javascript');
    const [localDiagnostics, setLocalDiagnostics] = useState([]);
    const [localCompilerOutput, setLocalCompilerOutput] = useState('');
    const [questionContext, setQuestionContext] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [autoSpeak, setAutoSpeak] = useState(false);
    const [hint, setHint] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const lastSuccessfulRequest = useRef('');
    const pendingTimer = useRef(null);
    const activeController = useRef(null);

    const code = externalCode !== undefined ? externalCode : localCode;
    const setCode = setExternalCode || setLocalCode;
    const language = externalLanguage !== undefined ? externalLanguage : localLanguage;
    const setLanguage = setExternalLanguage || setLocalLanguage;
    const diagnostics = externalDiagnostics !== undefined ? externalDiagnostics : localDiagnostics;
    const setDiagnostics = setExternalDiagnostics || setLocalDiagnostics;
    const compilerOutput = externalCompilerOutput !== undefined ? externalCompilerOutput : localCompilerOutput;
    const setCompilerOutput = setExternalCompilerOutput || setLocalCompilerOutput;

    const speak = (text) => {
        if (
            !('speechSynthesis' in window)
            || !window.speechSynthesis
            || typeof window.SpeechSynthesisUtterance !== 'function'
        ) {
            setStatus('Speech synthesis is not available in this browser.');
            return;
        }
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(text));
        setStatus('Reading the hint aloud.');
    };

    useEffect(() => {
        return () => {
            window.clearTimeout(pendingTimer.current);
            const controller = activeController.current;
            activeController.current = null;
            controller?.abort();
            window.speechSynthesis?.cancel();
        };
    }, []);

    const handleDiagnostics = (markers) => {
        setDiagnostics(
            markers.slice(0, 10).map((marker) => ({
                severity: marker.severity === 8 ? 'error' : marker.severity === 4 ? 'warning' : 'info',
                message: marker.message.slice(0, 1_200),
                line: marker.startLineNumber,
                source: (marker.source || 'Monaco').slice(0, 100),
            })),
        );
    };

    const requestHint = () => {
        if (!enabled) {
            setError('Turn on the voice mentor before requesting a hint.');
            return;
        }
        if (!code.trim()) {
            setError('Add some code before asking for a hint.');
            return;
        }
        if (code.length > MAX_CODE_LENGTH) {
            setError(`Code is over the ${MAX_CODE_LENGTH.toLocaleString()} character request limit.`);
            return;
        }

        const request = {
            code,
            language,
            diagnostics,
            compiler_output: compilerOutput,
            question_context: questionContext,
        };
        const fingerprint = JSON.stringify(request);
        if (fingerprint === lastSuccessfulRequest.current) {
            setStatus('You already have a hint for this code and diagnostic output.');
            return;
        }

        window.clearTimeout(pendingTimer.current);
        setError('');
        pendingTimer.current = window.setTimeout(async () => {
            const controller = new AbortController();
            activeController.current = controller;
            setLoading(true);
            setError('');
            setStatus('');
            try {
                const response = await fetch(`${API_BASE_URL}/api/mentor/hint`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(request),
                    signal: controller.signal,
                });
                let result;
                try {
                    result = await response.json();
                } catch {
                    throw new Error('The mentor service returned an invalid response.');
                }
                if (!response.ok) {
                    throw new Error(result.detail || 'Could not get a mentor hint.');
                }
                if (typeof result.hint !== 'string' || !result.hint.trim()) {
                    throw new Error('The mentor returned an empty hint. Please try again.');
                }
                lastSuccessfulRequest.current = fingerprint;
                setHint(result.hint);
                setStatus(`Hint ready${result.severity ? ` · ${result.severity}` : ''}.`);
                if (autoSpeak) speak(result.speak_text || result.hint);
            } catch (requestError) {
                if (requestError.name !== 'AbortError') {
                    setError(
                        requestError instanceof TypeError
                            ? `Can't reach the mentor API at ${API_BASE_URL}. Check that the backend is running.`
                            : requestError.message || 'The mentor service is unavailable.',
                    );
                }
            } finally {
                if (activeController.current === controller) {
                    activeController.current = null;
                    setLoading(false);
                }
            }
        }, 450);
    };

    return (
        <main className="mentor-app">
            <header className="mentor-header">
                <div>
                    <p className="mentor-eyebrow">ADAPTIVE LEARNING PORTAL</p>
                    <h1>Voice Coding Mentor</h1>
                    <p className="mentor-subtitle">
                        Write code in Monaco Editor, inspect live compiler diagnostics, and get step-by-step mentor guidance.
                    </p>
                </div>
                <div className="mentor-header-controls">
                    <label className="mentor-toggle">
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(event) => {
                                const mentorEnabled = event.target.checked;
                                setEnabled(mentorEnabled);
                                if (!mentorEnabled) {
                                    window.clearTimeout(pendingTimer.current);
                                    activeController.current?.abort();
                                    setLoading(false);
                                    window.speechSynthesis?.cancel();
                                    setStatus('Mentor is off. Your editor remains available.');
                                }
                            }}
                        />
                        <span>Mentor {enabled ? 'on' : 'off'}</span>
                    </label>
                </div>
            </header>

            {/* Quick Actions Shelf */}
            <div className="editor-quick-actions">
                <span className="qa-label">AI Actions for Current Code:</span>
                <button
                    type="button"
                    className="qa-btn"
                    onClick={() => onOpenChatWithAction && onOpenChatWithAction('Explain this code step-by-step in simple beginner-friendly terms.')}
                >
                    💬 Explain Code
                </button>
                <button
                    type="button"
                    className="qa-btn"
                    onClick={() => onOpenChatWithAction && onOpenChatWithAction('Explain the diagnostics and runtime issues in my code. What causes them and how can I fix them?')}
                >
                    🔍 Explain Diagnostics
                </button>
                <button
                    type="button"
                    className="qa-btn"
                    onClick={() => onOpenChatWithAction && onOpenChatWithAction('Give me progressive coding hints on how to improve this implementation without revealing the full solution.')}
                >
                    💡 Progressive Hints
                </button>
                <button
                    type="button"
                    className="qa-btn viva-qa"
                    onClick={() => onNavigateToViva && onNavigateToViva()}
                >
                    🎓 Generate Viva Questions
                </button>
            </div>

            <div className="mentor-workspace">
                <section className="editor-panel" aria-label="Code editor">
                    <div className="editor-toolbar">
                        <label htmlFor="mentor-language">Language</label>
                        <select
                            id="mentor-language"
                            value={language}
                            onChange={(event) => setLanguage(event.target.value)}
                        >
                            {LANGUAGE_OPTIONS.map(([value, label]) => (
                                <option value={value} key={value}>{label}</option>
                            ))}
                        </select>
                        <span className="editor-note">Monaco live diagnostics enabled</span>
                    </div>
                    <Editor
                        height="min(60vh, 660px)"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value || '')}
                        onValidate={handleDiagnostics}
                        theme="vs-dark"
                        options={{
                            automaticLayout: true,
                            fontSize: 14,
                            minimap: { enabled: false },
                            padding: { top: 16 },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                        }}
                    />
                    <div className="diagnostic-summary" aria-live="polite">
                        <strong>{diagnostics.length} editor diagnostic{diagnostics.length === 1 ? '' : 's'}</strong>
                        <span>Editor markers are not a substitute for compiling or running code.</span>
                    </div>
                </section>

                <aside className="mentor-panel" aria-label="Coding mentor">
                    <div className="mentor-panel-heading">
                        <div>
                            <p className="mentor-eyebrow">YOUR NEXT STEP</p>
                            <h2>Ask your mentor</h2>
                        </div>
                        <span className={`mentor-indicator${enabled ? ' is-on' : ''}`} aria-label={enabled ? 'Mentor on' : 'Mentor off'} />
                    </div>

                    <label className="field-label" htmlFor="compiler-output">Compiler or runner output (optional)</label>
                    <textarea
                        id="compiler-output"
                        className="mentor-textarea compiler-output"
                        maxLength={MAX_OUTPUT_LENGTH}
                        placeholder="Paste output from your trusted compiler or code runner."
                        value={compilerOutput}
                        onChange={(event) => setCompilerOutput(event.target.value)}
                    />
                    <span className="field-hint">{compilerOutput.length}/{MAX_OUTPUT_LENGTH} characters</span>

                    <label className="field-label" htmlFor="question-context">What are you trying to understand? (optional)</label>
                    <textarea
                        id="question-context"
                        className="mentor-textarea question-context"
                        maxLength={1_000}
                        placeholder="For example: Why does this value become undefined?"
                        value={questionContext}
                        onChange={(event) => setQuestionContext(event.target.value)}
                    />

                    <button
                        type="button"
                        className="hint-button"
                        onClick={requestHint}
                        disabled={!enabled || loading}
                    >
                        {loading ? 'Thinking…' : 'Get a short hint'}
                    </button>
                    <p className="request-note">
                        A request is sent only when you ask. Code and diagnostics are limited and sent to the configured AI provider.
                    </p>

                    {error && <p className="mentor-message error-message" role="alert">{error}</p>}
                    {status && <p className="mentor-message status-message" role="status">{status}</p>}
                    {hint && (
                        <section className="hint-card" aria-label="Mentor hint">
                            <p className="mentor-eyebrow">A HINT TO THINK ABOUT</p>
                            <p className="hint-text">{hint}</p>
                            <div className="hint-actions">
                                <button type="button" onClick={() => speak(hint)}>Read hint aloud</button>
                                <button type="button" onClick={() => speak(hint)}>Repeat</button>
                            </div>
                        </section>
                    )}

                    <label className="mentor-toggle speech-toggle">
                        <input
                            type="checkbox"
                            checked={autoSpeak}
                            onChange={(event) => setAutoSpeak(event.target.checked)}
                        />
                        <span>Speak new hints automatically</span>
                    </label>
                    <p className="safety-note">
                        This page does not execute code. Use an isolated, trusted runner for execution; student code is untrusted input.
                    </p>
                </aside>
            </div>
        </main>
    );
}

export default VoiceCodingMentor;
