import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Quiz.css';

const questions = [
    {
        id: 1,
        question: "What do you enjoy doing in your free time?",
        options: [
            { text: "Building things or coding", type: "Tech" },
            { text: "Drawing, painting, or designing", type: "Creative" },
            { text: "Helping people or volunteering", type: "Social" },
            { text: "Analyzing data or solving puzzles", type: "Analytical" }
        ]
    },
    {
        id: 2,
        question: "Which subject do you prefer?",
        options: [
            { text: "Computer Science / Math", type: "Tech" },
            { text: "Art / Design", type: "Creative" },
            { text: "Psychology / History", type: "Social" },
            { text: "Physics / Chemistry", type: "Analytical" }
        ]
    },
    {
        id: 3,
        question: "Ideally, your work environment would be:",
        options: [
            { text: "Innovative and fast-paced", type: "Tech" },
            { text: "Expressive and flexible", type: "Creative" },
            { text: "Collaborative and community-focused", type: "Social" },
            { text: "Structured and research-oriented", type: "Analytical" }
        ]
    },
    {
        id: 4,
        question: "What motivates you most?",
        options: [
            { text: "Creating new technology", type: "Tech" },
            { text: "Measuring beauty and aesthetics", type: "Creative" },
            { text: "Making a social impact", type: "Social" },
            { text: "Finding the truth in data", type: "Analytical" }
        ]
    }
];

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [scores, setScores] = useState({ Tech: 0, Creative: 0, Social: 0, Analytical: 0 });
    const [isFinished, setIsFinished] = useState(false);

    const handleAnswer = (type) => {
        setScores(prev => ({ ...prev, [type]: prev[type] + 1 }));

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const getDominantType = () => {
        return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    };

    return (
        <div className="quiz-container container">
            <AnimatePresence mode='wait'>
                {!isFinished ? (
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="quiz-card glass-card"
                    >
                        <div className="quiz-header">
                            <span>Question {currentQuestion + 1} / {questions.length}</span>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <h2>{questions[currentQuestion].question}</h2>

                        <div className="options-grid">
                            {questions[currentQuestion].options.map((opt, index) => (
                                <button
                                    key={index}
                                    className="quiz-option"
                                    onClick={() => handleAnswer(opt.type)}
                                >
                                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="result-card glass-card"
                    >
                        <Award size={64} className="result-icon" />
                        <h2>Your Career Personality: {getDominantType()}</h2>
                        <p className="result-desc">
                            Based on your answers, you thrive in {getDominantType().toLowerCase()} environments.
                            We recommend exploring careers that leverage your natural strengths.
                        </p>

                        <div className="result-actions">
                            <Link to="/chat" className="btn-primary">
                                Get Detailed Advice <ArrowRight size={20} />
                            </Link>
                            <button onClick={() => window.location.reload()} className="btn-secondary">
                                Retake Quiz
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Quiz;
