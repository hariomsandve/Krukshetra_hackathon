import React from 'react';
import './PortalHeader.css';

export default function PortalHeader({
    activeTab,
    setActiveTab,
    studentId = 'STU001',
    diagnosticsCount = 0
}) {
    return (
        <header className="portal-top-navbar">
            <div className="portal-brand">
                <div className="portal-logo">K26</div>
                <div className="portal-brand-text">
                    <span className="portal-title">KuruKshetra 2K26</span>
                    <span className="portal-tagline">Adaptive Learning & Assessment Portal</span>
                </div>
            </div>

            <nav className="portal-nav-tabs">
                <button
                    type="button"
                    className={`nav-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
                    onClick={() => setActiveTab('editor')}
                >
                    <span className="tab-icon">💻</span>
                    <span>Code Studio</span>
                    {diagnosticsCount > 0 && (
                        <span className="nav-badge-warn">{diagnosticsCount}</span>
                    )}
                </button>

                <button
                    type="button"
                    className={`nav-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                >
                    <span className="tab-icon">🤖</span>
                    <span>AI Learning Chat</span>
                </button>

                <button
                    type="button"
                    className={`nav-tab-btn ${activeTab === 'adaptive' ? 'active' : ''}`}
                    onClick={() => setActiveTab('adaptive')}
                >
                    <span className="tab-icon">📊</span>
                    <span>Adaptive Mastery</span>
                </button>

                <button
                    type="button"
                    className={`nav-tab-btn ${activeTab === 'viva' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viva')}
                >
                    <span className="tab-icon">🎓</span>
                    <span>Assessment & Viva</span>
                </button>
            </nav>

            <div className="portal-user-meta">
                <div className="db-pill">
                    <span className="status-dot"></span>
                    <span>Atlas DB</span>
                </div>
                <div className="student-profile-pill">
                    <div className="student-avatar-circle">{studentId.slice(-3)}</div>
                    <div className="student-name-meta">
                        <span className="student-id-text">{studentId}</span>
                        <span className="student-sub">Demo Student</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
