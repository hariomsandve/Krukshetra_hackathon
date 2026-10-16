import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TrainerWorkspace } from './components/trainer/TrainerWorkspace';
import { EvaluatorWorkspace } from './components/evaluator/EvaluatorWorkspace';
import { CourseExplorer } from './components/courses/CourseExplorer';
import { ConceptGraphCanvas } from './components/concept-map/ConceptGraphCanvas';
import { ConceptDetailDrawer } from './components/concept-map/ConceptDetailDrawer';
import { AddConceptModal } from './components/concept-map/AddConceptModal';
import { AdaptiveLearningPath } from './components/adaptive/AdaptiveLearningPath';
import { AssessmentRunner } from './components/assessments/AssessmentRunner';
import { CodingWorkspace } from './components/coding/CodingWorkspace';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { VoiceFloatingButton } from './components/voice/VoiceFloatingButton';
import { VoiceTutorModal } from './components/voice/VoiceTutorModal';
import { MentosChatDashboard } from './components/chat/MentosChatDashboard';
import { LoadingPage } from './components/auth/LoadingPage';
import { LoginPage } from './components/auth/LoginPage';
import { api, getStoredRole, setStoredRole } from './services/api';
import { Plus, GitBranch, Layers, Sparkles } from 'lucide-react';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adaptiq_authenticated') === 'true';
  });
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('adaptiq_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState(getStoredRole());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [health, setHealth] = useState(null);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);

  const [showAddConceptModal, setShowAddConceptModal] = useState(false);
  const [addConceptSubmitting, setAddConceptSubmitting] = useState(false);
  const [addConceptError, setAddConceptError] = useState('');

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [showVoiceTutor, setShowVoiceTutor] = useState(false);

  // Poll Health
  const checkBackendHealth = async () => {
    try {
      const data = await api.checkHealth();
      setHealth(data);
    } catch {
      setHealth({ status: 'disconnected' });
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Courses
  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const result = await api.listCourses();
      setCourses(result.data || []);
      if (!selectedCourse && result.data?.length > 0) {
        setSelectedCourse(result.data[0]);
      }
    } catch (err) {
      console.warn("Failed loading courses:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [currentRole]);

  // Load Concept Graph when selectedCourse changes
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchGraph = async () => {
      try {
        const result = await api.getCourseConcepts(selectedCourse.id);
        setGraphData(result.data);
        if (result.data?.nodes?.length > 0) {
          setSelectedConcept(result.data.nodes[0]);
        }
      } catch (err) {
        console.warn("Error fetching DAG:", err);
      }
    };

    fetchGraph();
  }, [selectedCourse]);

  // Toast Notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Role Change
  const handleRoleChange = (newRole) => {
    setStoredRole(newRole);
    setCurrentRole(newRole);
    showToast(`Switched active workspace session to ${newRole.toUpperCase()} role.`);
  };

  // Login handler
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUserProfile(userData);
    localStorage.setItem('adaptiq_authenticated', 'true');
    localStorage.setItem('adaptiq_user', JSON.stringify(userData));
    if (userData.role) {
      handleRoleChange(userData.role);
    }
    showToast(`Signed in as ${userData.name || userData.role}`);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem('adaptiq_authenticated');
    localStorage.removeItem('adaptiq_user');
    showToast("Signed out successfully.");
  };

  // Create Course
  const handleCreateCourse = async (coursePayload) => {
    const created = await api.createCourse(coursePayload);
    await loadCourses();
    setSelectedCourse(created);
    showToast(`Course "${created.title}" successfully created!`);
  };

  // Add Concept
  const handleAddConceptSubmit = async (conceptPayload) => {
    if (!selectedCourse) return;
    setAddConceptSubmitting(true);
    setAddConceptError('');

    try {
      await api.addConcept(selectedCourse.id, conceptPayload);
      const res = await api.getCourseConcepts(selectedCourse.id);
      setGraphData(res.data);
      setShowAddConceptModal(false);
      showToast(`Concept "${conceptPayload.title}" added to DAG!`);
      await loadCourses();
    } catch (err) {
      setAddConceptError(err.message);
    } finally {
      setAddConceptSubmitting(false);
    }
  };

  // Delete Concept
  const handleDeleteConcept = async (conceptId) => {
    if (!window.confirm("Are you sure you want to delete this concept from the DAG?")) return;
    try {
      await api.deleteConcept(conceptId);
      const res = await api.getCourseConcepts(selectedCourse.id);
      setGraphData(res.data);
      setSelectedConcept(null);
      showToast("Concept removed from curriculum.");
      await loadCourses();
    } catch (err) {
      alert(`Deletion rejected: ${err.message}`);
    }
  };

  // Start Learning jump
  const handleStartLearning = (concept) => {
    setActiveTab('coding-workspace');
    showToast(`Loaded coding challenge for concept: ${concept.title}`);
  };

  // 1. Loading Page Screen
  if (isLoading) {
    return <LoadingPage onComplete={() => setIsLoading(false)} />;
  }

  // 2. Authentication Login Screen
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--bg-app)' }}>
      {/* 1. Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        role={currentRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onOpenVoiceTutor={() => setShowVoiceTutor(true)}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar
          health={health}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          activeTab={activeTab}
          selectedCourse={selectedCourse}
          onClearSelectedCourse={() => setSelectedCourse(null)}
          onRefresh={checkBackendHealth}
          onOpenVoiceTutor={() => setShowVoiceTutor(true)}
          userProfile={userProfile}
          onLogout={handleLogout}
        />

        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: '72px',
              right: '24px',
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.9)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 500,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={15} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View Switcher Container */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
          {/* MENTOS AI CHAT DASHBOARD */}
          {activeTab === 'chat' && (
            <MentosChatDashboard
              onNavigate={setActiveTab}
              onOpenVoiceTutor={() => setShowVoiceTutor(true)}
              selectedCourse={selectedCourse}
            />
          )}

          {/* OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            currentRole === 'trainer' ? (
              <TrainerWorkspace
                courses={courses}
                onSelectCourse={(c) => {
                  setSelectedCourse(c);
                  setActiveTab('concept-map');
                }}
                onOpenCreateCourse={() => setActiveTab('courses')}
                onNavigate={setActiveTab}
              />
            ) : currentRole === 'evaluator' ? (
              <EvaluatorWorkspace />
            ) : (
              <StudentDashboard
                onNavigate={setActiveTab}
                courses={courses}
                onSelectCourse={setSelectedCourse}
                onOpenVoiceTutor={() => setShowVoiceTutor(true)}
              />
            )
          )}

          {/* COURSE EXPLORER */}
          {activeTab === 'courses' && (
            <CourseExplorer
              courses={courses}
              onSelectCourse={(c) => {
                setSelectedCourse(c);
                setActiveTab('concept-map');
              }}
              onCreateCourse={handleCreateCourse}
              userRole={currentRole}
              loading={loadingCourses}
            />
          )}

          {/* CONCEPT MAP DAG (Priority Redesign) */}
          {activeTab === 'concept-map' && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                    {selectedCourse?.title || "Curriculum"} • Prerequisite Concept Graph
                  </h1>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Pan, zoom, and inspect directed prerequisite paths. Select a node to view requirements and unlock progression.
                  </p>
                </div>

                {(currentRole === 'trainer' || currentRole === 'admin') && (
                  <button
                    onClick={() => {
                      setShowAddConceptModal(true);
                      setAddConceptError('');
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                  >
                    <Plus size={14} /> Add Concept to DAG
                  </button>
                )}
              </div>

              {/* Graph Canvas + Slide Drawer Layout */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <ConceptGraphCanvas
                    graphData={graphData}
                    selectedConceptId={selectedConcept?.id}
                    onSelectConcept={setSelectedConcept}
                    onStartLearning={handleStartLearning}
                  />
                </div>

                {selectedConcept && (
                  <ConceptDetailDrawer
                    concept={selectedConcept}
                    allNodes={graphData?.nodes || []}
                    edges={graphData?.edges || []}
                    onClose={() => setSelectedConcept(null)}
                    onSelectConcept={setSelectedConcept}
                    onStartLearning={handleStartLearning}
                    onDeleteConcept={handleDeleteConcept}
                    canModify={currentRole === 'trainer' || currentRole === 'admin'}
                    onAskMentos={(concept) => {
                      setSelectedConcept(concept);
                      setActiveTab('chat');
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* ADAPTIVE LEARNING PATH */}
          {activeTab === 'adaptive-path' && (
            <AdaptiveLearningPath
              course={selectedCourse}
              onNavigate={setActiveTab}
            />
          )}

          {/* ASSESSMENTS */}
          {activeTab === 'assessments' && (
            <AssessmentRunner
              onFinishAssessment={() => {
                showToast("Assessment results recorded; mastery telemetry refreshed.");
              }}
              onNavigate={setActiveTab}
            />
          )}

          {/* CODING WORKSPACE */}
          {activeTab === 'coding-workspace' && (
            <CodingWorkspace
              onBack={() => setActiveTab('dashboard')}
              onOpenVoiceTutor={() => setShowVoiceTutor(true)}
            />
          )}

          {/* AI CODE VIVA */}
          {activeTab === 'viva' && (
            <MentosChatDashboard
              onNavigate={setActiveTab}
              onOpenVoiceTutor={() => setShowVoiceTutor(true)}
              selectedCourse={selectedCourse}
            />
          )}

          {/* ANALYTICS */}
          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {/* TRAINER WORKSPACE */}
          {activeTab === 'trainer-workspace' && (
            <TrainerWorkspace
              courses={courses}
              onSelectCourse={(c) => {
                setSelectedCourse(c);
                setActiveTab('concept-map');
              }}
              onOpenCreateCourse={() => setActiveTab('courses')}
              onNavigate={setActiveTab}
            />
          )}

          {/* EVALUATOR WORKSPACE */}
          {activeTab === 'evaluator-workspace' && (
            <EvaluatorWorkspace />
          )}
        </div>
      </div>

      {/* Add Concept Modal */}
      {showAddConceptModal && (
        <AddConceptModal
          allConcepts={graphData?.nodes || []}
          onClose={() => setShowAddConceptModal(false)}
          onSubmit={handleAddConceptSubmit}
          submitting={addConceptSubmitting}
          errorMsg={addConceptError}
        />
      )}

      {/* Floating Voice Tutor Button */}
      <VoiceFloatingButton
        onClick={() => setShowVoiceTutor(true)}
        isActive={showVoiceTutor}
      />

      {/* Gemini Live Multimodal Voice Tutor Modal */}
      <VoiceTutorModal
        isOpen={showVoiceTutor}
        onClose={() => setShowVoiceTutor(false)}
        selectedCourse={selectedCourse}
        selectedConcept={selectedConcept}
        onNotify={showToast}
      />
    </div>
  );
}

export default App;
