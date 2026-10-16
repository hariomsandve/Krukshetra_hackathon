import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Paperclip,
  SlidersHorizontal,
  Mic,
  Copy,
  Check,
  Download,
  RotateCcw,
  BookOpen,
  Code2,
  GitBranch,
  Bot,
  User,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

import { mockData } from '../../data/mockData';

export const MentosChatDashboard = ({
  onNavigate,
  onOpenVoiceTutor,
  selectedCourse
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Mentos Adaptive Core v2.4 (Gemini 2.5 Flash)');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const quickActionChips = mockData.chat.suggestions.map(s => ({
    label: s.label,
    prompt: s.prompt
  }));

  const featureCards = [
    {
      title: 'AI Concept Explainer',
      description: 'Understand difficult algorithms and data structures through step-by-step intuition and visual mental models.',
      icon: BookOpen,
      actionText: 'Explore Concepts',
      onClick: () => onNavigate('concept-map')
    },
    {
      title: 'Coding Assistant',
      description: 'Get debugging guidance, code explanations, and live challenge practice in the Monaco IDE workspace.',
      icon: Code2,
      actionText: 'Launch Workspace',
      onClick: () => onNavigate('coding-workspace')
    },
    {
      title: 'Adaptive Learning',
      description: 'Discover weak concepts, priority focus nodes, and topological mastery pathways tailored to your gaps.',
      icon: GitBranch,
      actionText: 'View Dashboard',
      onClick: () => onNavigate('dashboard')
    }
  ];

  const handleSelectConversation = (conv) => {
    setActiveConversationId(conv.id);
    setMessages(conv.messages.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: new Date(m.createdAt || Date.now())
    })));
    setShowHistoryDropdown(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, loading]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage = { role: 'user', content: query, timestamp: new Date() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);

    try {
      const response = await api.chatWithMentos(
        query,
        messages.map(m => ({ role: m.role, content: m.content })),
        selectedCourse ? { course_id: selectedCourse.id, course_title: selectedCourse.title } : null
      );

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
          model: response.model,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Apologies, I encountered an issue connecting to the Mentos Core service: ${err.message}. Please verify the backend connection.`,
          isError: true,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExport = () => {
    if (messages.length === 0) return;
    const transcript = messages.map(m => `[${m.role.toUpperCase()} - ${new Date(m.timestamp).toLocaleTimeString()}]\n${m.content}\n\n`).join('---\n\n');
    const blob = new Blob([transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentos-chat-${new Date().toISOString().slice(0,10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: 'var(--bg-app-ambient)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* 1. Chat Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(11, 15, 25, 0.65)',
          backdropFilter: 'blur(12px)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Model Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#c4b5fd'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#a855f7',
                boxShadow: '0 0 8px #a855f7'
              }}
            />
            <span>{selectedModel}</span>
          </div>

          {/* Conversation History Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowHistoryDropdown(prev => !prev)}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '5px 12px', gap: '6px' }}
            >
              <span>{activeConversationId ? mockData.chat.conversations.find(c => c.id === activeConversationId)?.title : 'Past Chats'}</span>
              <span style={{ fontSize: '0.625rem', color: '#c4b5fd' }}>▾</span>
            </button>

            {showHistoryDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  background: 'rgba(16, 22, 38, 0.98)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px',
                  width: '260px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700, padding: '4px 8px' }}>
                  SAVED CONVERSATIONS
                </div>
                {mockData.chat.conversations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectConversation(c)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: activeConversationId === c.id ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                      color: activeConversationId === c.id ? '#c4b5fd' : '#cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: activeConversationId === c.id ? 600 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = activeConversationId === c.id ? 'rgba(168, 85, 247, 0.15)' : 'transparent')}
                  >
                    <span>{c.title}</span>
                    {c.pinned && <span style={{ fontSize: '0.625rem', color: '#a855f7' }}>📌</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {messages.length > 0 && (
            <>
              <button
                onClick={handleNewChat}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                title="Start a new chat session"
              >
                <RotateCcw size={13} /> New Chat
              </button>

              <button
                onClick={handleExport}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                title="Export transcript as Markdown"
              >
                <Download size={13} /> Export
              </button>
            </>
          )}

          <button
            onClick={onOpenVoiceTutor}
            className="btn btn-purple-subtle"
            style={{ fontSize: '0.75rem', padding: '5px 12px', gap: '6px' }}
          >
            <Mic size={14} /> Voice Tutor
          </button>
        </div>
      </div>

      {/* 2. Main Workspace Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 20px',
          width: '100%'
        }}
      >
        <div style={{ width: '100%', maxWidth: '820px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Welcome Screen (When no messages) */}
          {messages.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 'auto',
                marginBottom: 'auto',
                padding: '20px 0'
              }}
            >
              {/* Glowing Animated AI Visual */}
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 45px rgba(168, 85, 247, 0.45)',
                  marginBottom: '24px',
                  animation: 'mentosOrbPulse 4s ease-in-out infinite'
                }}
              >
                <Sparkles size={38} color="#ffffff" />
              </div>

              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.025em',
                  marginBottom: '10px'
                }}
              >
                Ready to Learn Something New?
              </h1>

              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '540px',
                  lineHeight: 1.6,
                  marginBottom: '26px'
                }}
              >
                Your personal AI learning companion for concepts, coding, and assessments.
              </p>

              {/* Quick-action chips */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '36px'
                }}
              >
                {quickActionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.prompt)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-full)',
                      padding: '8px 16px',
                      color: '#e2e8f0',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                      e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>{chip.label}</span>
                    <ArrowUpRight size={13} color="#a855f7" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Transcript */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={index}
                    className="animate-fade-in"
                    style={{
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start',
                      justifyContent: isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {!isUser && (
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.35)',
                          marginTop: '2px'
                        }}
                      >
                        <Bot size={17} color="#fff" />
                      </div>
                    )}

                    <div
                      style={{
                        maxWidth: isUser ? '75%' : '88%',
                        padding: '14px 18px',
                        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isUser
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)'
                          : 'rgba(16, 22, 38, 0.85)',
                        border: isUser
                          ? '1px solid rgba(139, 92, 246, 0.35)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        lineHeight: 1.65,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                        backdropFilter: 'blur(8px)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {msg.content}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '8px',
                          fontSize: '0.6875rem',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {!isUser && msg.model && ` • ${msg.model}`}
                        </span>

                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.content, index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}
                            title="Copy response"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check size={12} color="#34d399" />
                                <span style={{ color: '#34d399' }}>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                      >
                        <User size={17} color="#c7d2fe" />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Bot size={17} color="#fff" />
                  </div>
                  <div
                    style={{
                      padding: '12px 18px',
                      borderRadius: '16px',
                      background: 'rgba(16, 22, 38, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#a855f7',
                        animation: 'mentosOrbPulse 1.2s infinite'
                      }}
                    />
                    <span>Mentos is reasoning and formulating response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Input Composer & Feature Cards Container */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 20px 24px',
          background: 'transparent',
          flexShrink: 0
        }}
      >
        <div style={{ width: '100%', maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Multi-line Composer */}
          <div
            style={{
              width: '100%',
              background: 'rgba(16, 22, 38, 0.88)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: 'var(--radius-xl)',
              padding: '12px 16px 10px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45), 0 0 20px rgba(139, 92, 246, 0.1)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.2s ease'
            }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about coding, concepts, or your syllabus..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
                resize: 'none',
                fontFamily: 'inherit',
                maxHeight: '180px',
                minHeight: '26px'
              }}
            />

            {/* Composer Footer Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '8px',
                paddingTop: '6px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'not-allowed',
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="File upload available in next build"
                  disabled
                >
                  <Paperclip size={16} />
                </button>

                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Tune temperature & prompt preferences"
                >
                  <SlidersHorizontal size={16} />
                </button>

                <button
                  type="button"
                  onClick={onOpenVoiceTutor}
                  style={{
                    background: 'rgba(139, 92, 246, 0.12)',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    color: '#c4b5fd',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                  title="Open live Gemini voice conversation"
                >
                  <Mic size={14} color="#a855f7" />
                  <span>Voice Tutor</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-disabled)' }}>
                  Enter ↵ to send
                </span>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  style={{
                    background: input.trim() && !loading
                      ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: input.trim() && !loading ? '#ffffff' : 'var(--text-disabled)',
                    border: 'none',
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease',
                    boxShadow: input.trim() && !loading ? '0 0 14px rgba(168, 85, 247, 0.4)' : 'none'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Feature Cards (Shown on Welcome Screen) */}
          {messages.length === 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px',
                width: '100%'
              }}
            >
              {featureCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    onClick={card.onClick}
                    className="surface-card surface-card-interactive"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 'var(--radius-lg)',
                      background: 'rgba(16, 22, 38, 0.65)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.07)'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(139, 92, 246, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '10px'
                        }}
                      >
                        <Icon size={16} color="#c4b5fd" />
                      </div>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                        {card.title}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {card.description}
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#c4b5fd'
                      }}
                    >
                      <span>{card.actionText}</span>
                      <ArrowUpRight size={13} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
