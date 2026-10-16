import React from 'react';
import {
  LayoutDashboard,
  Compass,
  GitFork,
  Route,
  CheckSquare,
  Code2,
  BarChart3,
  BookPlus,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ activeTab, onSelectTab, role, isCollapsed, onToggleCollapse }) => {
  // Navigation structure tailored by role
  const getNavItems = () => {
    const common = [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'courses', label: 'Course Explorer', icon: Compass },
      { id: 'concept-map', label: 'Concept Map DAG', icon: GitFork },
    ];

    if (role === 'trainer' || role === 'admin') {
      return [
        ...common,
        { id: 'trainer-workspace', label: 'Curriculum Manager', icon: BookPlus },
        { id: 'coding-workspace', label: 'Coding Challenges', icon: Code2 },
        { id: 'analytics', label: 'Cohort Analytics', icon: BarChart3 },
      ];
    }

    if (role === 'evaluator') {
      return [
        ...common,
        { id: 'evaluator-workspace', label: 'Submission Review Queue', icon: ShieldAlert },
        { id: 'coding-workspace', label: 'Coding Workspace', icon: Code2 },
        { id: 'analytics', label: 'Evaluation Metrics', icon: BarChart3 },
      ];
    }

    // Default: Student
    return [
      ...common,
      { id: 'adaptive-path', label: 'Adaptive Path', icon: Route },
      { id: 'assessments', label: 'Assessments', icon: CheckSquare },
      { id: 'coding-workspace', label: 'Coding Challenges', icon: Code2 },
      { id: 'analytics', label: 'My Mastery Analytics', icon: BarChart3 },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside
      style={{
        width: isCollapsed ? '64px' : '240px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        zIndex: 20,
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: '60px',
          padding: isCollapsed ? '0' : '0 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          cursor: 'pointer'
        }}
        onClick={() => onSelectTab('dashboard')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)',
              flexShrink: 0
            }}
          >
            <Sparkles size={18} color="#fff" />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.1 }}>
                AdaptIQ
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Adaptive Engine
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
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
                background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                color: isActive ? '#c7d2fe' : 'var(--text-secondary)',
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
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '6px',
                    bottom: '6px',
                    width: '3px',
                    borderRadius: '0 2px 2px 0',
                    background: 'var(--accent-primary)'
                  }}
                />
              )}
              <Icon size={18} color={isActive ? '#818cf8' : 'currentColor'} style={{ flexShrink: 0 }} />
              {!isCollapsed && (
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Role / Collapse button */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between'
        }}
      >
        {!isCollapsed && (
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            Active: <strong style={{ color: '#c7d2fe', textTransform: 'capitalize' }}>{role}</strong>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="btn btn-ghost"
          style={{ padding: '6px', borderRadius: 'var(--radius-xs)' }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};
