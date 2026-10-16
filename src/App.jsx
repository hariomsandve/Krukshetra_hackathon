import { useState } from 'react';
import PortalHeader from './components/navigation/PortalHeader.jsx';
import VoiceCodingMentor from './components/voice-mentor/VoiceCodingMentor.jsx';
import AIAssistantChat from './components/assistant/AIAssistantChat.jsx';
import AdaptiveDashboard from './components/adaptive/AdaptiveDashboard.jsx';
import VivaAssessment from './components/viva/VivaAssessment.jsx';

const STARTER_CODE = `function greet(name) {
  return "Hello, " + name;
}

console.log(greet("learner"));`;

function App() {
    const [activeTab, setActiveTab] = useState('editor');
    const [code, setCode] = useState(STARTER_CODE);
    const [language, setLanguage] = useState('javascript');
    const [diagnostics, setDiagnostics] = useState([]);
    const [compilerOutput, setCompilerOutput] = useState('');
    const [studentId] = useState('STU001');

    const handleOpenChatWithAction = (prompt) => {
        setActiveTab('chat');
    };

    const handleAskAssistantFromAdaptive = (prompt) => {
        setActiveTab('chat');
    };

    return (
        <div className="portal-app-wrapper">
            <PortalHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                studentId={studentId}
                diagnosticsCount={diagnostics.length}
            />

            <div className="portal-main-content">
                {activeTab === 'editor' && (
                    <VoiceCodingMentor
                        code={code}
                        setCode={setCode}
                        language={language}
                        setLanguage={setLanguage}
                        diagnostics={diagnostics}
                        setDiagnostics={setDiagnostics}
                        compilerOutput={compilerOutput}
                        setCompilerOutput={setCompilerOutput}
                        onOpenChatWithAction={handleOpenChatWithAction}
                        onNavigateToViva={() => setActiveTab('viva')}
                    />
                )}

                {activeTab === 'chat' && (
                    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px clamp(16px, 4vw, 48px)' }}>
                        <AIAssistantChat
                            studentId={studentId}
                            code={code}
                            language={language}
                            diagnostics={diagnostics}
                            compilerOutput={compilerOutput}
                            onNavigateTab={setActiveTab}
                        />
                    </div>
                )}

                {activeTab === 'adaptive' && (
                    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px clamp(16px, 4vw, 48px)' }}>
                        <AdaptiveDashboard
                            studentId={studentId}
                            onAskAssistant={handleAskAssistantFromAdaptive}
                        />
                    </div>
                )}

                {activeTab === 'viva' && (
                    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px clamp(16px, 4vw, 48px)' }}>
                        <VivaAssessment
                            studentId={studentId}
                            code={code}
                            language={language}
                            onNavigateToEditor={() => setActiveTab('editor')}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
