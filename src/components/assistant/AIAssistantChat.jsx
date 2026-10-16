import { useState, useEffect, useRef } from 'react';
import './AIAssistantChat.css';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

const SUGGESTED_PROMPTS = [
    'Explain this error.',
    'Teach me this concept.',
    'Give me a coding hint.',
    'Recommend my next topic.',
    'Help me understand my submitted code.'
];

export default function AIAssistantChat({
    studentId = 'STU001',
    code = '',
    language = 'javascript',
    diagnostics = [],
    compilerOutput = '',
    onNavigateTab
}) {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'bot',
            text: "Hello! I'm your AI Learning Assistant. I'm here to help you understand computer science concepts, debug programming errors, practice algorithms, and prepare for viva assessments.\n\nHow can I help you today?",
            provider: 'system',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [includeCodeContext, setIncludeCodeContext] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastSpokenText, setLastSpokenText] = useState('');
    const [showConfirmClear, setShowConfirmClear] = useState(false);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Fetch conversation history from MongoDB on load
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/assistant/history?student_id=${studentId}`, {
                    headers: { 'X-Student-Id': studentId }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.conversations && data.conversations.length > 0) {
                        const latestConv = data.conversations[0];
                        if (latestConv.messages && latestConv.messages.length > 0) {
                            setMessages(latestConv.messages.map((m, idx) => ({
                                id: `hist-${idx}`,
                                sender: m.sender,
                                text: m.text,
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            })));
                        }
                    }
                }
            } catch (err) {
                console.log('History load notice:', err.message);
            }
        };
        fetchHistory();
    }, [studentId]);

    // Speech-to-Text Setup
    const handleToggleVoiceInput = () => {
        setSpeechError('');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setSpeechError('');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                setIsListening(false);
                if (event.error === 'not-allowed') {
                    setSpeechError('Microphone permission was denied. Please allow microphone access in your browser.');
                } else if (event.error === 'no-speech') {
                    setSpeechError('No speech was detected. Please try speaking again.');
                } else {
                    setSpeechError(`Voice input error: ${event.error}`);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
            recognition.start();
        } catch (err) {
            setIsListening(false);
            setSpeechError(`Could not access microphone: ${err.message}`);
        }
    };

    // Text-to-Speech (Read Aloud)
    const speakText = (text) => {
        if (!('speechSynthesis' in window) || !window.speechSynthesis) {
            setSpeechError('Speech synthesis is not supported in this browser.');
            return;
        }
        window.speechSynthesis.cancel();
        // Strip markdown code fences for cleaner audio
        const cleanAudioText = text.replace(/```[\s\S]*?```/g, 'Code block omitted from audio.').replace(/[*#_`]/g, '');
        const utterance = new window.SpeechSynthesisUtterance(cleanAudioText);
        utterance.rate = 1.0;
        utterance.onstart = () => {
            setIsSpeaking(true);
            setLastSpokenText(text);
        };
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const handleSend = async (messageText) => {
        const textToSend = (messageText || input).trim();
        if (!textToSend || loading) return;

        const userMsg = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text: textToSend,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);
        setError('');

        const conversationContext = updatedMessages.slice(-8).map((m) => ({
            sender: m.sender,
            text: m.text
        }));

        const payload = {
            message: textToSend,
            student_id: studentId,
            mode: textToSend.toLowerCase().includes('viva') ? 'viva' : 'chat',
            code: includeCodeContext && code.trim() ? code : null,
            language: includeCodeContext && code.trim() ? language : null,
            diagnostics: includeCodeContext ? diagnostics : [],
            compiler_output: includeCodeContext ? compilerOutput : '',
            history: conversationContext
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/assistant/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Student-Id': studentId
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || `Server error (${res.status}).`);
            }

            const data = await res.json();
            const botMsg = {
                id: `bot-${Date.now()}`,
                sender: 'bot',
                text: data.reply,
                provider: data.provider,
                viva_questions: data.viva_questions || [],
                suggested_actions: data.suggested_actions || [],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            setError(err.message || 'The AI assistant is currently unreachable.');
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/assistant/history?student_id=${studentId}`, {
                method: 'DELETE',
                headers: { 'X-Student-Id': studentId }
            });
            setMessages([
                {
                    id: 'welcome-reset',
                    sender: 'bot',
                    text: 'Conversation history has been cleared. What would you like to explore next?',
                    provider: 'system',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
            setShowConfirmClear(false);
        } catch (err) {
            setError('Could not clear history: ' + err.message);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard?.writeText(text);
    };

    return (
        <div className="assistant-container">
            <div className="assistant-header">
                <div className="assistant-header-title">
                    <div className="assistant-badge">AI</div>
                    <div>
                        <h2>AI Learning Assistant</h2>
                        <p className="assistant-subtext">
                            Student: <strong>{studentId}</strong> · Context Aware · MongoDB Atlas Connected
                        </p>
                    </div>
                </div>

                <div className="assistant-header-actions">
                    {isSpeaking && (
                        <button type="button" className="btn-action stop-btn" onClick={stopSpeaking} title="Stop voice output">
                            ⏹ Stop Speech
                        </button>
                    )}
                    {lastSpokenText && !isSpeaking && (
                        <button type="button" className="btn-action" onClick={() => speakText(lastSpokenText)} title="Repeat last read aloud">
                            🔁 Repeat Audio
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn-action clear-btn"
                        onClick={() => setShowConfirmClear(true)}
                        title="Clear conversation history"
                    >
                        🗑 Clear Chat
                    </button>
                </div>
            </div>

            {/* Code Context Banner */}
            <div className="context-indicator-bar">
                <label className="context-toggle-label">
                    <input
                        type="checkbox"
                        checked={includeCodeContext}
                        onChange={(e) => setIncludeCodeContext(e.target.checked)}
                    />
                    <span>
                        Attach active editor code ({language || 'code'}
                        {code.trim() ? ` · ${code.length} chars` : ' · empty'}
                        {diagnostics.length > 0 ? ` · ${diagnostics.length} diagnostics` : ''})
                    </span>
                </label>
                {includeCodeContext && code.trim() && (
                    <span className="context-badge">Code Attached</span>
                )}
            </div>

            {/* Error notifications */}
            {speechError && (
                <div className="assistant-alert warning" role="alert">
                    <span>⚠️ {speechError}</span>
                    <button type="button" onClick={() => setSpeechError('')}>✕</button>
                </div>
            )}
            {error && (
                <div className="assistant-alert error" role="alert">
                    <span>❌ {error}</span>
                    <button type="button" onClick={() => setError('')}>✕</button>
                </div>
            )}

            {/* Messages Area */}
            <div className="messages-scroll-area">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                        <div className="message-avatar">
                            {msg.sender === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className="message-content">
                            <div className="message-header-meta">
                                <span className="sender-name">{msg.sender === 'user' ? 'You' : 'AI Assistant'}</span>
                                <span className="message-time">{msg.time}</span>
                                {msg.provider && msg.provider !== 'system' && (
                                    <span className={`provider-pill ${msg.provider}`}>{msg.provider}</span>
                                )}
                            </div>

                            <div className="message-text">
                                {formatMessageWithCode(msg.text, copyToClipboard)}
                            </div>

                            {msg.sender === 'bot' && (
                                <div className="message-footer-tools">
                                    <button
                                        type="button"
                                        className="tool-btn"
                                        onClick={() => copyToClipboard(msg.text)}
                                        title="Copy response"
                                    >
                                        📋 Copy
                                    </button>
                                    <button
                                        type="button"
                                        className="tool-btn"
                                        onClick={() => speakText(msg.text)}
                                        title="Read aloud"
                                    >
                                        🔊 Read Aloud
                                    </button>
                                </div>
                            )}

                            {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                                <div className="suggested-actions">
                                    {msg.suggested_actions.map((act, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className="action-pill"
                                            onClick={() => handleSend(act)}
                                        >
                                            {act}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message-row bot loading-row">
                        <div className="message-avatar">🤖</div>
                        <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Shelf */}
            <div className="suggested-prompts-shelf">
                <span className="shelf-label">Quick Prompts:</span>
                <div className="pills-scroll">
                    {SUGGESTED_PROMPTS.map((p, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className="prompt-pill"
                            onClick={() => handleSend(p)}
                            disabled={loading}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Input Bar */}
            <div className="assistant-input-bar">
                <button
                    type="button"
                    className={`mic-button ${isListening ? 'active' : ''}`}
                    onClick={handleToggleVoiceInput}
                    title={isListening ? 'Stop listening' : 'Speak your question (Voice Input)'}
                >
                    {isListening ? '🔴 Recording...' : '🎙️'}
                </button>

                <textarea
                    className="chat-input"
                    rows={1}
                    placeholder={
                        isListening
                            ? 'Listening to your voice...'
                            : 'Ask about programming, algorithms, Monaco code, or viva questions... (Shift+Enter for new line)'
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    disabled={loading}
                />

                <button
                    type="button"
                    className="send-button"
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                >
                    {loading ? 'Thinking…' : 'Send ➤'}
                </button>
            </div>

            {/* Clear Confirmation Modal */}
            {showConfirmClear && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Clear Conversation History?</h3>
                        <p>This will delete your stored conversation history from MongoDB. Are you sure you want to proceed?</p>
                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={() => setShowConfirmClear(false)}>
                                Cancel
                            </button>
                            <button type="button" className="btn-confirm" onClick={handleClearHistory}>
                                Yes, Clear History
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Markdown and Code Block Formatter
function formatMessageWithCode(text, onCopy) {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
            const lines = part.slice(3, -3).trim().split('\n');
            const lang = lines[0].trim() || 'code';
            const codeBody = lines.slice(lang.length > 0 && !lines[0].includes(' ') ? 1 : 0).join('\n');

            return (
                <div key={index} className="chat-code-block">
                    <div className="code-header">
                        <span className="code-lang">{lang}</span>
                        <button type="button" className="copy-code-btn" onClick={() => onCopy(codeBody)}>
                            Copy code
                        </button>
                    </div>
                    <pre>
                        <code>{codeBody}</code>
                    </pre>
                </div>
            );
        }

        // Render plain text and bullets
        return (
            <div key={index} className="text-paragraph">
                {part.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>
                        {para.split('\n').map((line, lIdx) => (
                            <span key={lIdx}>
                                {renderInlineMarkdown(line)}
                                {lIdx < para.split('\n').length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                ))}
            </div>
        );
    });
}

function renderInlineMarkdown(str) {
    // Bold, inline code, and bullet prefixes
    if (str.startsWith('- ') || str.startsWith('* ')) {
        return (
            <span className="bullet-line">
                <span className="bullet-dot">•</span> {str.slice(2)}
            </span>
        );
    }
    return str;
}
