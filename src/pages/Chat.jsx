import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { generateCareerAdvice, analyzeSkillGap } from '../services/api';
import './Chat.css';

const STEPS = {
    WELCOME: 0,
    ASK_INTERESTS: 1,
    ASK_SKILLS: 2,
    ASK_EDUCATION: 3,
    GENERATING: 4,
    RESULTS: 5,
    FREE_CHAT: 6
};

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: "Hi there! I'm EduAdvisory. I'm here to help you discover your perfect career path. What are you most passionate about? (e.g., coding, art, science...)"
        }
    ]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState(STEPS.ASK_INTERESTS);
    const [userData, setUserData] = useState({ interests: '', skills: '', education: '' });
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate bot thinking
        setTimeout(async () => {
            let botResponse = '';
            let nextStep = step;

            try {
                if (step === STEPS.ASK_INTERESTS) {
                    setUserData(prev => ({ ...prev, interests: input }));
                    botResponse = "That sounds exciting! Now, tell me a bit about your skills. What are you good at? (e.g., Python, Photoshop, communication)";
                    nextStep = STEPS.ASK_SKILLS;
                } else if (step === STEPS.ASK_SKILLS) {
                    setUserData(prev => ({ ...prev, skills: input }));
                    botResponse = "Great! Lastly, what is your current education level? (e.g., High School, College, Graduate)";
                    nextStep = STEPS.ASK_EDUCATION;
                } else if (step === STEPS.ASK_EDUCATION) {
                    setUserData(prev => ({ ...prev, education: input }));
                    botResponse = "Thanks! I'm analyzing your profile to find the best career matches for you...";
                    nextStep = STEPS.GENERATING;

                    // Trigger generation
                    generateAdvice({ ...userData, education: input });
                }
            } catch (error) {
                botResponse = "Oops, I encountered an error. Please try again.";
            }

            if (nextStep !== STEPS.GENERATING) {
                setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
                setStep(nextStep);
                setIsTyping(false);
            } else {
                setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
                setStep(nextStep);
                // setIsTyping remains true until results come back from generateAdvice
            }
        }, 1000);
    };

    const generateAdvice = async (data) => {
        try {
            const advice = await generateCareerAdvice(data); // Returns object with 'careers' array

            setIsTyping(false);

            const resultMessage = {
                id: Date.now() + 2,
                sender: 'bot',
                type: 'results',
                data: advice
            };

            setMessages(prev => [...prev, resultMessage]);
            setStep(STEPS.RESULTS);

        } catch (err) {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "Sorry, I couldn't generate advice right now." }]);
        }
    };

    const handleSkillGap = async (careerName) => {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: `Analyze my skill gap for ${careerName}` }]);
        setIsTyping(true);

        setTimeout(async () => {
            const gapAnalysis = await analyzeSkillGap(userData.skills, careerName);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: `For ${careerName}, you should focus on: ${gapAnalysis.missing_skills.join(", ")}. ${gapAnalysis.plan}`
            }]);
        }, 1500);
    };

    return (
        <div className="chat-page container">
            <div className="chat-window glass">
                <div className="chat-header">
                    <div className="bot-avatar-large">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h2>Career Assistant</h2>
                        <p className="status-text">Online • AI Powered</p>
                    </div>
                </div>

                <div className="messages-area">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
                            >
                                {msg.sender === 'bot' && (
                                    <div className="message-avatar bot">
                                        <Bot size={18} />
                                    </div>
                                )}

                                <div className={`message-bubble ${msg.sender} ${msg.type === 'results' ? 'results-bubble' : ''}`}>
                                    {msg.type === 'results' ? (
                                        <ResultsDisplay data={msg.data} onAnalyze={handleSkillGap} />
                                    ) : (
                                        <p>{msg.text}</p>
                                    )}
                                </div>

                                {msg.sender === 'user' && (
                                    <div className="message-avatar user">
                                        <User size={18} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="message-row bot-row"
                        >
                            <div className="message-avatar bot">
                                <Bot size={18} />
                            </div>
                            <div className="typing-indicator glass">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="input-area glass">
                    <input
                        type="text"
                        placeholder="Type your answer..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={step === STEPS.GENERATING || step === STEPS.RESULTS}
                    />
                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={!input.trim() || step === STEPS.GENERATING}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ResultsDisplay = ({ data, onAnalyze }) => {
    return (
        <div className="results-container">
            <h3>We found clear paths for you!</h3>
            <div className="careers-grid">
                {data.careers.map((career) => (
                    <div key={career.id} className="career-card glass-card">
                        <div className="career-header">
                            <h4>{career.career}</h4>
                            <span className="match-badge">{career.match_percentage}% Match</span>
                        </div>
                        <p className="career-desc">{career.description}</p>

                        <div className="career-section">
                            <h5>Skills Needed</h5>
                            <div className="tags">
                                {career.skills_needed.map((skill, i) => (
                                    <span key={i} className="tag">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="career-section">
                            <h5>Resources</h5>
                            <ul>
                                {career.resources.map((res, i) => (
                                    <li key={i}><a href={res.url} className="resource-link">{res.name}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div className="tip-box">
                            <Sparkles size={14} className="tip-icon" />
                            <p>"{career.motivation_tip}"</p>
                        </div>

                        <div className="card-actions" style={{ marginTop: '16px' }}>
                            <button
                                className="btn-secondary small"
                                onClick={() => onAnalyze(career.career)}
                                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                            >
                                Analyze Skill Gap
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="feedback-actions">
                <button className="btn-secondary small">Refine Search</button>
                <button className="btn-secondary small">Save Results</button>
            </div>
        </div>
    );
};

export default Chat;
