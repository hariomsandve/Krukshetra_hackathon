import { useState, useEffect } from 'react';
import './AdaptiveDashboard.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export default function AdaptiveDashboard({ studentId = 'STU001', onAskAssistant }) {
    const [adaptiveData, setAdaptiveData] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [manualTopic, setManualTopic] = useState('');

    const fetchAdaptiveInfo = async () => {
        setLoading(true);
        setError('');
        try {
            const [profileRes, adaptRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/student/profile?student_id=${studentId}`, {
                    headers: { 'X-Student-Id': studentId }
                }),
                fetch(`${API_BASE_URL}/api/adaptive/recommendations?student_id=${studentId}`, {
                    headers: { 'X-Student-Id': studentId }
                })
            ]);

            if (profileRes.ok) {
                const profileJson = await profileRes.json();
                setProfile(profileJson);
            }
            if (adaptRes.ok) {
                const adaptJson = await adaptRes.json();
                setAdaptiveData(adaptJson);
            } else {
                throw new Error('Failed to load adaptive recommendations.');
            }
        } catch (err) {
            setError(err.message || 'Could not connect to adaptive learning service.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdaptiveInfo();
    }, [studentId]);

    const handleTeachMe = (concept) => {
        if (onAskAssistant) {
            onAskAssistant(`Teach me the concept of ${concept}. Break it down with beginner-friendly intuition, common pitfalls, and a simple step-by-step code example.`);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualTopic.trim() && onAskAssistant) {
            onAskAssistant(`I need help understanding ${manualTopic.trim()}. Could you explain this concept from the basics?`);
            setManualTopic('');
        }
    };

    if (loading) {
        return (
            <div className="adaptive-loading-panel">
                <div className="spinner"></div>
                <p>Analyzing concept map and student mastery from MongoDB Atlas...</p>
            </div>
        );
    }

    return (
        <div className="adaptive-dashboard">
            {/* Header Profile summary */}
            <div className="adaptive-header">
                <div>
                    <span className="section-eyebrow">ADAPTIVE LEARNING & CONCEPT MAP</span>
                    <h2>Student Knowledge & Mastery Profile</h2>
                    <p className="adaptive-subtext">
                        Dynamic recommendations powered by real assessment records for{' '}
                        <strong>{profile?.name || studentId}</strong> ({profile?.branch || 'CSE'}, Year {profile?.year || 3})
                    </p>
                </div>
                <button type="button" className="refresh-btn" onClick={fetchAdaptiveInfo}>
                    🔄 Refresh Data
                </button>
            </div>

            {error && (
                <div className="adaptive-alert error" role="alert">
                    <span>⚠️ {error}</span>
                </div>
            )}

            {/* If no performance data available, fallback gracefully */}
            {adaptiveData && !adaptiveData.has_data ? (
                <div className="no-data-card">
                    <h3>No Prior Assessment Records Found</h3>
                    <p>Tell the AI assistant what topic you would like help with today:</p>
                    <form onSubmit={handleManualSubmit} className="manual-topic-form">
                        <input
                            type="text"
                            placeholder="e.g., Recursion, Binary Trees, Dynamic Programming..."
                            value={manualTopic}
                            onChange={(e) => setManualTopic(e.target.value)}
                        />
                        <button type="submit" disabled={!manualTopic.trim()}>
                            Get Guided Lesson ➤
                        </button>
                    </form>
                </div>
            ) : (
                <div className="adaptive-grid">
                    {/* Left: Mastery Scores & Concept Map */}
                    <div className="adaptive-card mastery-card">
                        <h3>Concept Mastery Map</h3>
                        <p className="card-desc">Calculated from recent problem submissions and evaluations:</p>

                        <div className="mastery-list">
                            {adaptiveData?.mastery &&
                                Object.entries(adaptiveData.mastery).map(([concept, score]) => {
                                    const percent = Math.round(score * 100);
                                    const statusClass =
                                        percent >= 75 ? 'mastered' : percent >= 50 ? 'developing' : 'weak';

                                    return (
                                        <div key={concept} className="mastery-item">
                                            <div className="mastery-label-row">
                                                <span className="concept-name">{concept}</span>
                                                <span className={`mastery-percent ${statusClass}`}>{percent}%</span>
                                            </div>
                                            <div className="progress-track">
                                                <div
                                                    className={`progress-fill ${statusClass}`}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Right: Weak Concepts & Targeted Next Actions */}
                    <div className="adaptive-card recommendations-card">
                        <div className="card-header-badge">
                            <h3>Targeted Learning Focus</h3>
                            <span className="badge-count">
                                {adaptiveData?.recommendations?.length || 0} Areas to Improve
                            </span>
                        </div>
                        <p className="card-desc">
                            Personalized remediation paths based on prerequisite dependencies:
                        </p>

                        <div className="recommendations-list">
                            {adaptiveData?.recommendations && adaptiveData.recommendations.length > 0 ? (
                                adaptiveData.recommendations.map((rec, idx) => (
                                    <div key={idx} className="rec-item-card">
                                        <div className="rec-card-top">
                                            <div>
                                                <h4>{rec.concept}</h4>
                                                <span className="rec-meta">
                                                    Mastery: {Math.round(rec.current_mastery * 100)}% · Difficulty: {rec.difficulty}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-teach"
                                                onClick={() => handleTeachMe(rec.concept)}
                                            >
                                                ✨ Teach Me
                                            </button>
                                        </div>

                                        <p className="rec-rationale">
                                            <strong>Why:</strong> {rec.rationale}
                                        </p>

                                        {rec.common_pitfalls && (
                                            <p className="rec-pitfall">
                                                ⚠️ <em>Common Pitfall:</em> {rec.common_pitfalls}
                                            </p>
                                        )}

                                        {rec.recommended_practice && rec.recommended_practice.length > 0 && (
                                            <div className="rec-practice">
                                                <span className="practice-title">Recommended Practice:</span>
                                                <div className="practice-tags">
                                                    {rec.recommended_practice.map((prob, pIdx) => (
                                                        <span key={pIdx} className="practice-tag">
                                                            {prob}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="all-good-msg">🎉 Excellent! No critical weak concepts detected.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
