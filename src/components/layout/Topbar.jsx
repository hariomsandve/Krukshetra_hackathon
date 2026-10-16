import React, { useState } from 'react';
import { Search, Mic, Layers, ChevronDown, Sparkles, LogOut } from 'lucide-react';

export const Topbar = ({
  health,
  currentRole,
  onRoleChange,
  activeTab,
  selectedCourse,
  onClearSelectedCourse,
  onRefresh,
  onOpenVoiceTutor,
  userProfile,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getBreadcrumbs = () => {
    switch (activeTab) {
      case 'chat':
        return { root: 'Mentos AI', current: 'AI Chat Companion' };
      case 'dashboard':
        return { root: 'Mentos AI', current: 'Learning Workspace' };
      case 'concept-map':
        return {
          root: 'Concept Maps',
          sub: 'Computer Science',
          current: selectedCourse ? selectedCourse.title : 'Data Structures & Algorithms'
        };
      case 'coding-workspace':
        return { root: 'Workspace', current: 'Coding Practice (LRU Cache)' };
      case 'assessments':
        return { root: 'Practice', current: 'Assessments & Quizzes' };
      case 'viva':
        return { root: 'AI Mentorship', current: 'Interactive AI Code Viva' };
      case 'analytics':
        return { root: 'Insights', current: 'Cognitive Mastery Analytics' };
      case 'courses':
        return { root: 'Curriculum', current: 'Learning Library' };
      default:
        return { root: 'Mentos AI', current: 'Learning Workspace' };
    }
  };

  const breadcrumbs = getBreadcrumbs();
  const isHealthy = health && health.status === 'healthy';

  return (
    <header
      style={{
        height: '62px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-topbar)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 15,
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {/* 1. Left: Breadcrumbs & Core Version Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8125rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'var(--text-muted)' }}>{breadcrumbs.root}</span>
          <span style={{ color: 'var(--text-disabled)' }}>›</span>
          {breadcrumbs.sub && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>{breadcrumbs.sub}</span>
              <span style={{ color: 'var(--text-disabled)' }}>›</span>
            </>
          )}
          <span style={{ color: '#ffffff', fontWeight: 600 }}>{breadcrumbs.current}</span>
        </div>

        {/* Adaptive Core Version Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#c4b5fd',
            cursor: 'pointer'
          }}
          title="Engine: Dynamic Cognitive Weighting"
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#a855f7',
              boxShadow: '0 0 6px #a855f7'
            }}
          />
          <span>Mentos Adaptive Core v2.4</span>
          <ChevronDown size={11} />
        </div>
      </div>

      {/* 2. Center/Right: Search, Voice Tutor, Health & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            width: '280px',
            transition: 'all 0.15s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, syntax, lessons..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.75rem',
              width: '100%'
            }}
          />
          <span
            style={{
              fontSize: '0.625rem',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '1px 5px',
              borderRadius: '3px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            ⌘K
          </span>
        </div>

        {/* Voice Tutor Button */}
        {onOpenVoiceTutor && (
          <button
            onClick={onOpenVoiceTutor}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              color: '#c4b5fd',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.22)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.55)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(168, 85, 247, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.2)';
            }}
          >
            <Mic size={14} color="#a855f7" />
            <span>Voice Tutor</span>
          </button>
        )}

        {/* User Avatar with Status indicator & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                border: '2px solid rgba(255, 255, 255, 0.1)'
              }}
              title={userProfile?.name || `${currentRole.toUpperCase()} User`}
            >
              {userProfile?.name
                ? userProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                : currentRole.slice(0, 2).toUpperCase()}
            </div>
            <span
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #090d16'
              }}
            />
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                borderRadius: 'var(--radius-full)',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fb7185';
                e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)';
                e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
              title="Sign Out"
            >
              <LogOut size={13} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
