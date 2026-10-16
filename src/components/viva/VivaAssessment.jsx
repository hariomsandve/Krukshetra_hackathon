import { useState, useEffect } from 'react';
import './VivaAssessment.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export default function VivaAssessment({
    studentId = 'STU001',
    code = '',
    language = 'javascript',
    onNavigateToEditor
}) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState(['', '', '']);
    const [evaluation, setEvaluation] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Fetch past viva history from MongoDB
    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/assistant/viva/history?student_id=${studentId}`, {
                headers: { 'X-Student-Id': studentId }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data.viva_records || []);
            }
        } catch (err) {
            console.log('Viva history fetch:', err.message);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [studentId]);

    const handleGenerateViva = async () => {
        if (!code.trim()) {
            setError('Please write or load code in the Monaco Editor before generating viva questions.');
            return;
        }

        setError('');
        setGenerating(true);
        setEvaluation(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/assistant/viva/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Student-Id': studentId
                },
                body: JSON.stringify({
                    student_id: studentId,
                    code,
                    language
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || 'Could not generate viva questions.');
            }

            const data = await res.json();
            const qList = data.questions && data.questions.length > 0
                ? data.questions
                : [
                    `What is the time and space complexity of your ${language} implementation?`,
                    'Can you identify potential boundary or null input edge cases?',
                    'How could this approach be optimized or refactored?'
                ];
            setQuestions(qList);
            setAnswers(new Array(qList.length).fill(''));
            fetchHistory();
        } catch (err) {
            setError(err.message || 'Error generating viva questions.');
        } finally {
            setGenerating(false);
        }
    };

    const handleAnswerChange = (index, val) => {
        setAnswers((prev) => {
            const updated = [...prev];
            updated[index] = val;
            return updated;
        });
    };

    const handleSubmitEvaluation = async () => {
        if (questions.length === 0) return;
        const nonBlank = answers.filter((a) => a.trim().length > 0);
        if (nonBlank.length === 0) {
            setError('Please provide at least one answer before submitting for evaluation.');
            return;
        }

        setError('');
        setEvaluating(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/assistant/viva/evaluate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Student-Id': studentId
                },
                body: JSON.stringify({
                    student_id: studentId,
                    code,
                    language,
                    questions,
                    answers
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || 'Could not evaluate viva answers.');
            }

            const data = await res.json();
            setEvaluation(data);
            fetchHistory();
        } catch (err) {
            setError(err.message || 'Error during viva evaluation.');
        } finally {
            setEvaluating(false);
        }
    };

    return (
        <div className="viva-container">
            <div className="viva-header">
                <div>
                    <span className="section-eyebrow">CODE VIVA & ASSESSMENT EVALUATION</span>
                    <h2>Code Understanding & Viva Voce</h2>
                    <p className="viva-subtext">
                        Evaluate your comprehension of the code currently active in Monaco Editor ({language || 'code'}).
                    </p>
                </div>
                <button
                    type="button"
                    className="generate-viva-btn"
                    onClick={handleGenerateViva}
                    disabled={generating || !code.trim()}
                >
                    {generating ? 'Analyzing Code & Generating…' : '⚡ Generate 3 Viva Questions'}
                </button>
            </div>

            {error && (
                <div className="viva-alert error" role="alert">
                    <span>⚠️ {error}</span>
                    <button type="button" onClick={() => setError('')}>✕</button>
                </div>
            )}

            {!code.trim() && (
                <div className="viva-notice">
                    <p>
                        No code found in the editor. Head to the <strong>Code Studio</strong> tab to write or load your code, then return here to test your understanding!
                    </p>
                    {onNavigateToEditor && (
                        <button type="button" className="btn-to-editor" onClick={onNavigateToEditor}>
                            Go to Code Studio ➤
                        </button>
                    )}
                </div>
            )}

            {/* Questions and Answers Section */}
            {questions.length > 0 && (
                <div className="viva-exam-card">
                    <h3>Active Viva Questions</h3>
                    <p className="exam-desc">
                        Provide your reasoning below. The AI examiner evaluates your answers against your submitted code:
                    </p>

                    <div className="questions-list">
                        {questions.map((q, idx) => (
                            <div key={idx} className="question-item">
                                <label className="question-label">
                                    <span className="q-number">Q{idx + 1}</span> {q}
                                </label>
                                <textarea
                                    className="viva-textarea"
                                    rows={3}
                                    placeholder="Explain your approach, complexity, or design reasoning..."
                                    value={answers[idx] || ''}
                                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                    disabled={evaluating}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="submit-eval-btn"
                        onClick={handleSubmitEvaluation}
                        disabled={evaluating}
                    >
                        {evaluating ? 'Grading & Evaluating Submission…' : 'Submit Answers for AI Evaluation ➤'}
                    </button>
                </div>
            )}

            {/* Evaluation Results Card */}
            {evaluation && (
                <div className="evaluation-card">
                    <div className="eval-card-header">
                        <div>
                            <span className="eval-tag">EVALUATION REPORT</span>
                            <h3>Viva Assessment Score: {evaluation.score}/10</h3>
                        </div>
                        <span className="provider-badge">{evaluation.provider}</span>
                    </div>

                    <div className="eval-content">
                        {evaluation.evaluation_text.split('\n\n').map((block, idx) => (
                            <p key={idx}>{block}</p>
                        ))}
                    </div>
                </div>
            )}

            {/* Past Viva History from MongoDB */}
            <div className="viva-history-card">
                <h3>Past Viva Submissions (MongoDB Atlas)</h3>
                {historyLoading ? (
                    <p className="loading-text">Loading submission records...</p>
                ) : history.length === 0 ? (
                    <p className="empty-history-text">No recorded viva assessments yet for this student.</p>
                ) : (
                    <div className="history-records-list">
                        {history.map((record, rIdx) => (
                            <div key={rIdx} className="history-record-item">
                                <div className="history-top">
                                    <span className="history-lang">{record.language || 'code'}</span>
                                    <span className="history-date">
                                        {record.created_at ? new Date(record.created_at).toLocaleString() : 'Recent'}
                                    </span>
                                </div>
                                <div className="history-questions">
                                    <strong>Questions:</strong>
                                    <ul>
                                        {record.questions?.map((hq, qIdx) => (
                                            <li key={qIdx}>{hq}</li>
                                        ))}
                                    </ul>
                                </div>
                                {record.evaluation?.score && (
                                    <div className="history-score">
                                        Score: <strong>{record.evaluation.score}/10</strong>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
