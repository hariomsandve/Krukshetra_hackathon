import React from 'react';
import {
  Sparkles,
  Plus,
  MessageSquare,
  LayoutDashboard,
  GitFork,
  CheckSquare,
  Code2,
  Mic,
  BarChart3,
  BookOpen,
  Headphones,
  FolderTree,
  Bookmark,
  HelpCircle,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsUpDown,
  Compass,
  Sun,
  Moon
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  onSelectTab,
  role,
  isCollapsed,
  onToggleCollapse,
  onOpenVoiceTutor,
  theme = 'dark-plum',
  onToggleTheme
}) => {
  const learningSuiteItems = [
    { id: 'chat', label: 'Chat History', icon: MessageSquare },
    { id: 'dashboard', label: 'Learning Dashboard', icon: LayoutDashboard },
    { id: 'concept-map', label: 'Concept Maps', icon: GitFork },
    { id: 'assessments', label: 'Practice & Assessments', icon: CheckSquare },
    { id: 'coding-workspace', label: 'Coding Workspace', icon: Code2 },
    { id: 'viva', label: 'AI Code Viva', icon: Mic },
    { id: 'analytics', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'courses', label: 'Learning Library', icon: BookOpen },
    { id: 'voice-tutor', label: 'Voice Tutor', icon: Headphones, isAction: true },
  ];

  const handleItemClick = (item) => {
    if (item.id === 'voice-tutor') {
      if (onOpenVoiceTutor) onOpenVoiceTutor();
    } else {
      onSelectTab(item.id);
    }
  };

  return (
    <aside
      style={{
        width: isCollapsed ? '68px' : '260px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        zIndex: 20,
        height: '100vh',
        overflow: 'hidden',
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {/* 1. Brand Header */}
      <div
        style={{
          height: '62px',
          padding: isCollapsed ? '0' : '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div
          onClick={() => onSelectTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          {/* Logo icon */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(168, 85, 247, 0.45)',
              flexShrink: 0
            }}
          >
            <Sparkles size={18} color="#fff" />
          </div>

          {!isCollapsed && (
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.1 }}>
                Mentos
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                AI Learning Companion
              </div>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Collapse sidebar"
          >
            <PanelLeftClose size={17} />
          </button>
        )}
      </div>

      {/* 2. New Chat Button */}
      <div style={{ padding: isCollapsed ? '12px 10px' : '14px 14px 8px' }}>
        <button
          onClick={() => onSelectTab('chat')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '10px 0' : '9px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} color="#c4b5fd" />
            {!isCollapsed && <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>New Chat</span>}
          </div>
          {!isCollapsed && (
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.06)',
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              ⌘N
            </span>
          )}
        </button>
      </div>

      {/* 3. Navigation List (Scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* LEARNING SUITE */}
        <div>
          {!isCollapsed && (
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '6px 8px 6px'
              }}
            >
              Learning Suite
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {learningSuiteItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  title={isCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: isCollapsed ? '10px 0' : '8px 12px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'rgba(139, 92, 246, 0.16)' : 'transparent',
                    color: isActive ? '#e9d5ff' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    outline: 'none',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon size={16} color={isActive ? '#c084fc' : 'currentColor'} style={{ flexShrink: 0 }} />
                  {!isCollapsed && <span>{item.label}</span>}
                  {isActive && !isCollapsed && (
                    <span
                      style={{
                        position: 'absolute',
                        right: '8px',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#a855f7',
                        boxShadow: '0 0 6px #a855f7'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* WORKSPACE */}
        {!isCollapsed && (
          <div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '6px 8px 6px'
              }}
            >
              Workspace
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer'
                }}
                onClick={() => onSelectTab('adaptive-path')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FolderTree size={15} color="#94a3b8" />
                  <span>Paths</span>
                </div>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#c4b5fd',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}
                >
                  2 active
                </span>
              </div>

              <div
                onClick={() => onSelectTab('coding-workspace')}
                style={{
                  padding: '5px 12px 5px 36px',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                DSA Mastery
              </div>

              <div
                onClick={() => onSelectTab('concept-map')}
                style={{
                  padding: '5px 12px 5px 36px',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                System Design
              </div>

              <div
                onClick={() => onSelectTab('courses')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 12px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <Compass size={15} />
                <span>Recent Courses</span>
              </div>

              <div
                onClick={() => onSelectTab('concept-map')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 12px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <Bookmark size={15} />
                <span>Saved Concepts</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Footer / Profile (Aria Chen) */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: isCollapsed ? '12px 8px' : '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(11, 15, 25, 0.95)'
        }}
      >
        {!isCollapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 4px' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <HelpCircle size={14} /> Help
              </button>
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme === 'light' ? '#d97706' : '#c4b5fd',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                  title={theme === 'light' ? 'Switch to Dark-Plum Mode' : 'Switch to Light Mode'}
                >
                  {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                  <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
                </button>
              )}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Settings size={14} /> Settings
              </button>
            </div>

            {/* User Profile Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                    flexShrink: 0
                  }}
                >
                  AM
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
                    Alex Morgan
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    CS Year 3 • Pro Learner
                  </div>
                </div>
              </div>

              <ChevronsUpDown size={15} color="var(--text-muted)" />
            </div>
          </>
        ) : (
          <div
            onClick={onToggleCollapse}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px 0'
            }}
            title="Expand sidebar"
          >
            <PanelLeftOpen size={18} />
          </div>
        )}
      </div>
    </aside>
  );
};
