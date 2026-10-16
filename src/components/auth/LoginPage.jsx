import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  Mic,
  GitFork,
  Code2,
  ShieldCheck,
  Zap,
  Loader2,
  User,
  UserPlus
} from 'lucide-react';

export const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('student@adaptiq.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Role presets for quick demonstration
  const rolePresets = {
    student: {
      email: 'student@adaptiq.io',
      name: 'Aria Chen',
      badge: 'CS Junior • Pro Learner',
      description: 'Access personalized course DAGs, adaptive quizzes, code sandboxes & Gemini voice tutor.'
    },
    trainer: {
      email: 'trainer@adaptiq.io',
      name: 'Dr. Marcus Vance',
      badge: 'Curriculum Director',
      description: 'Design concept graphs, manage syllabus prerequisites, and review classroom progress.'
    },
    evaluator: {
      email: 'evaluator@adaptiq.io',
      name: 'Elena Rostova',
      badge: 'Academic Evaluator',
      description: 'Audit assessment telemetry, grade student code viva submissions, and review integrity logs.'
    }
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    if (!isSignUp) {
      setEmail(rolePresets[roleKey].email);
      setPassword('••••••••••••');
    }
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter an email address');
      return;
    }
    if (isSignUp && !fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Simulate swift authenticating experience with theme loading feedback
    setTimeout(() => {
      const preset = rolePresets[selectedRole] || {
        name: email.split('@')[0],
        email: email,
        badge: `${selectedRole.toUpperCase()} User`
      };

      const finalName = isSignUp ? (fullName.trim() || email.split('@')[0]) : preset.name;
      const finalBadge = isSignUp ? `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} • New Member` : preset.badge;

      if (onLogin) {
        onLogin({
          role: selectedRole,
          email: email,
          name: finalName,
          badge: finalBadge
        });
      }
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'var(--bg-app)',
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.18), transparent),
          radial-gradient(circle at 10% 30%, rgba(168, 85, 247, 0.08), transparent 40%),
          radial-gradient(circle at 90% 70%, rgba(99, 102, 241, 0.08), transparent 40%),
          #090d16
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 460px) minmax(360px, 480px)',
          gap: '32px',
          maxWidth: '1020px',
          width: '100%',
          alignItems: 'center'
        }}
        className="login-container-grid"
      >
        {/* Left Column: Brand Hero Highlights */}
        <div style={{ padding: '12px' }}>
          {/* Logo badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                flexShrink: 0
              }}
            >
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 30%, #c4b5fd 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1
                }}
              >
                Mentos AI
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                AdaptIQ Learning & Assessment Portal
              </div>
            </div>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.1rem',
              fontWeight: 800,
              lineHeight: 1.25,
              color: '#ffffff',
              marginBottom: '16px',
              letterSpacing: '-0.02em'
            }}
          >
            Personalized mastery powered by{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Real-Time AI
            </span>
          </h2>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '28px'
            }}
          >
            Experience dynamic concept prerequisite graphs, continuous knowledge tracing, and
            conversational voice tutoring with low-latency Gemini Multimodal Live streaming.
          </p>

          {/* Key capability cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#c4b5fd'
                }}
              >
                <Mic size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
                  Gemini Live Multimodal Voice Tutor
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Natural 24kHz bidirectional Socratic dialogue with instant barge-in interruption.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#a5b4fc'
                }}
              >
                <GitFork size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
                  Prerequisite Concept DAGs
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Interactive dependency graphs that adapt as you unlock coding benchmarks.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#67e8f9'
                }}
              >
                <Code2 size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
                  Monaco Code Workspace & Viva
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Algorithmic testing suites with automated telemetry and AI-driven code reviews.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Login Card */}
        <div
          style={{
            background: 'rgba(16, 22, 38, 0.78)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 32px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(139, 92, 246, 0.15)',
            position: 'relative'
          }}
        >
          {/* Top Header */}
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '6px'
              }}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {isSignUp
                ? "Join AdaptIQ and set up your personalized learning profile."
                : "Select your role profile to access your learning portal."}
            </p>
          </div>

          {/* Quick Role Selection Tabs */}
          <div style={{ marginBottom: '22px' }}>
            <div
              style={{
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                fontWeight: 700,
                marginBottom: '8px'
              }}
            >
              Workspace Role
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '4px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              {[
                { id: 'student', label: 'Student', icon: GraduationCap },
                { id: 'trainer', label: 'Trainer', icon: Users },
                { id: 'evaluator', label: 'Evaluator', icon: Award }
              ].map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 4px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)'
                        : 'transparent',
                      border: isSelected
                        ? '1px solid rgba(168, 85, 247, 0.45)'
                        : '1px solid transparent',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 600 : 500,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} color={isSelected ? '#c4b5fd' : 'var(--text-muted)'} />
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Role detail hint */}
            <div
              style={{
                marginTop: '8px',
                fontSize: '0.6875rem',
                color: '#c4b5fd',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <CheckCircle2 size={12} color="#10b981" />
              <span>{rolePresets[selectedRole].description}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name Input (Sign Up Mode) */}
            {isSignUp && (
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px'
                  }}
                >
                  Full Name
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px'
                  }}
                >
                  <User size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '0.8125rem',
                      width: '100%',
                      fontFamily: 'var(--font-sans)'
                    }}
                    required={isSignUp}
                  />
                </div>
              </div>
            )}
            {/* Email Input */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
                }}
              >
                Institutional Email
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  transition: 'border-color 0.15s ease, background 0.15s ease'
                }}
              >
                <Mail size={16} color="var(--text-muted)" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@adaptiq.io"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.8125rem',
                    width: '100%',
                    fontFamily: 'var(--font-sans)'
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)'
                  }}
                >
                  Password
                </label>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: '#a855f7',
                    cursor: 'pointer'
                  }}
                  onClick={() => alert("For this hackathon portal demo, mock authentication is active with any password.")}
                >
                  Forgot password?
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px'
                }}
              >
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.8125rem',
                    width: '100%',
                    fontFamily: 'var(--font-sans)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    accentColor: '#8b5cf6',
                    cursor: 'pointer'
                  }}
                />
                <span>Keep me signed in</span>
              </label>

              <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
                Dev-Token Mock Auth
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  fontSize: '0.75rem'
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isSubmitting ? 'wait' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isSignUp ? "Creating Account..." : "Authenticating..."}</span>
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus size={16} />
                      <span>Create Account & Launch</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Workspace</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </>
              )}
            </button>

            {/* Don't have an account / Already have an account switch */}
            <div
              style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)'
              }}
            >
              {isSignUp ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMessage('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#c4b5fd',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      fontSize: 'inherit'
                    }}
                  >
                    Sign in
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setErrorMessage('');
                      if (email === 'student@adaptiq.io') setEmail('');
                      if (password === '••••••••••••') setPassword('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#c4b5fd',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      fontSize: 'inherit'
                    }}
                  >
                    Create account
                  </button>
                </span>
              )}
            </div>
          </form>

          {/* Quick 1-Click Launch Bar for Hackathon judges/users */}
          <div
            style={{
              marginTop: '22px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#c4b5fd',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Zap size={12} color="#a855f7" />
              <span>Instant 1-Click Access</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  handleRoleSelect('student');
                  setTimeout(() => handleSubmit(), 50);
                }}
                className="btn btn-purple-subtle"
                style={{ fontSize: '0.6875rem', padding: '5px 10px' }}
              >
                Demo as Student
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRoleSelect('trainer');
                  setTimeout(() => handleSubmit(), 50);
                }}
                className="btn btn-purple-subtle"
                style={{ fontSize: '0.6875rem', padding: '5px 10px' }}
              >
                Demo as Trainer
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRoleSelect('evaluator');
                  setTimeout(() => handleSubmit(), 50);
                }}
                className="btn btn-purple-subtle"
                style={{ fontSize: '0.6875rem', padding: '5px 10px' }}
              >
                Demo as Evaluator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
