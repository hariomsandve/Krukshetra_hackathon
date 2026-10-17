/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Plus,
  Folder,
  Box,
  SlidersHorizontal,
  FileText,
  Clock,
  ArrowDown,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2,
  X,
  Minus,
  Square,
  Pencil,
  MoveHorizontal,
  Table as TableIcon,
  CheckSquare,
  List,
  Sparkles,
  Copy,
  Check,
  Send,
  ExternalLink,
  MessageSquare,
  Eye,
  Sliders,
  Printer,
  History,
  Mic,
  MicOff,
  ArrowUp,
  Image as ImageIcon,
  Video,
  VideoOff,
  Music,
  Layout,
  Compass,
  BookOpen,
  Camera,
  Paperclip,
  HardDrive,
  Book,
  MapPin,
  Volume2,
  Smile,
  Activity,
  Upload,
  Radio,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Filter,
  Award,
  Code,
  Code2,
  UserCheck
} from 'lucide-react';

import {
  ActivityItem,
  ActivityType,
  ActivityStatus,
  ChatMessagePayload,
  loadActivities,
  saveActivity,
  updateActivityStatus,
  deleteActivity,
  clearAllActivities,
  formatActivityTime,
  purgeLegacyStorage,
} from './services/historyService';
import SplashScreen from './components/SplashScreen';

interface ArtifactStep {
  stepNumber: number;
  title: string;
  description: string;
}

interface ArtifactTableRow {
  feature: string;
  description: string;
}

interface ArtifactVersion {
  id: string;
  versionNumber: number;
  label: string;
  timestamp: string;
  title: string;
  summary: string;
  tag?: string;
  tableRows: ArtifactTableRow[];
  heading: string;
  subtext: string;
  steps: ArtifactStep[];
}

function parseMessageContent(text: string) {
  const chartRegex = /```json:chart\s*([\s\S]*?)\s*```/;
  const match = text.match(chartRegex);
  if (match) {
    try {
      const chartJson = JSON.parse(match[1]);
      const cleanText = text.replace(chartRegex, '').trim();
      return { cleanText, chart: chartJson };
    } catch {
      return { cleanText: text, chart: null };
    }
  }
  return { cleanText: text, chart: null };
}

function FormattedMessage({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-[13px] sm:text-[13.5px] leading-relaxed text-[#1f2937]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const lineContent = isBullet ? trimmed.substring(2) : line;

        // Parse **bold** and *italic*
        const parts = lineContent.split(/(\*\*.*?\*\*|\*.*?\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} className="font-semibold text-neutral-900">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={pIdx} className="italic text-neutral-800">{part.slice(1, -1)}</em>;
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
              <div>{renderedLine}</div>
            </div>
          );
        }

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        return (
          <div key={idx} className="whitespace-pre-wrap">
            {renderedLine}
          </div>
        );
      })}
    </div>
  );
}

function InteractiveChart({ chart }: { chart: any }) {
  if (!chart || !chart.labels || !chart.datasets) return null;

  const title = chart.title || 'Performance Metrics';
  const type = chart.type || 'bar';
  const labels: string[] = chart.labels;
  const datasets = chart.datasets;

  if (type === 'metric') {
    return (
      <div className="bg-[#faf9f6] border border-[#e5e4de] rounded-xl p-3 my-2 space-y-2">
        <div className="text-xs font-bold text-neutral-800">{title}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {labels.map((lbl, idx) => {
            const val = datasets[0]?.data?.[idx] ?? 0;
            return (
              <div key={idx} className="bg-white border border-[#e5e4de] rounded-lg p-2.5 text-center shadow-2xs">
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">{lbl}</div>
                <div className="text-base font-bold text-neutral-900 mt-0.5">{val}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const allValues = datasets.flatMap((d: any) => d.data || []);
  const maxVal = Math.max(...allValues, 10);

  return (
    <div className="bg-[#faf9f6] border border-[#e5e4de] rounded-xl p-3.5 my-2 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-neutral-700" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {datasets.map((d: any, i: number) => (
            <div key={i} className="flex items-center gap-1 text-[10px] text-neutral-600">
              <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-neutral-900' : 'bg-neutral-400'}`} />
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-1">
        {labels.map((lbl, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-[11px] text-neutral-600">
              <span className="font-medium">{lbl}</span>
              <span className="font-mono text-neutral-900 font-semibold">
                {datasets.map((d: any) => d.data?.[idx]).join(' / ')}
              </span>
            </div>
            <div className="flex h-2.5 gap-1 rounded bg-[#eceae4] overflow-hidden p-0.5">
              {datasets.map((d: any, dIdx: number) => {
                const val = d.data?.[idx] || 0;
                const pct = Math.min(100, Math.max(5, (val / maxVal) * 100));
                return (
                  <div
                    key={dIdx}
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-xs transition-all duration-300 ${
                      dIdx === 0 ? 'bg-neutral-900' : 'bg-neutral-400'
                    }`}
                    title={`${d.label}: ${val}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  // Breakpoint states
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;

  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // Navigation & View states
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [activeTabMobile, setActiveTabMobile] = useState<'chat' | 'artifact'>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Real-time Activity History state (Persistent & Deduplicated)
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<'all' | 'chat' | 'task' | 'analysis'>('all');
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [showHistoryFilters, setShowHistoryFilters] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Chat message state
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showProPlanModal, setShowProPlanModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Version History state
  const [artifactList, setArtifactList] = useState<ArtifactVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ArtifactVersion | null>(null);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);

  // Split layout sizing
  const [splitRatio, setSplitRatio] = useState(100); // 100% width for chat panel on startup (artifact panel closed until requested)
  const [isDragging, setIsDragging] = useState(false);
  const [artifactFullscreen, setArtifactFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Tab 1' | 'Code' | 'Overview'>('Tab 1');
  const [artifactMode, setArtifactMode] = useState<'preview' | 'code' | 'table'>('preview');

  // Input message state
  const [newMessage, setNewMessage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Gemini 4 Features & Voice Model State (Light Theme)
  const [geminiMode, setGeminiMode] = useState<'chat' | 'task'>('chat');
  const [geminiFeaturesOpen, setGeminiFeaturesOpen] = useState(false);
  const [isAcademicsMode, setIsAcademicsMode] = useState(false);
  const [isSkillMode, setIsSkillMode] = useState(false);
  const [skillType, setSkillType] = useState<'hard' | 'soft'>('hard');
  const [personalizedDocs, setPersonalizedDocs] = useState<Array<{ id: string; title: string; content: string; date: string }>>([
    { id: 'doc_1', title: 'Data Structures & Algorithms Final Notes', content: 'Balanced BSTs, Graph traversal algorithms, Shortest paths.', date: 'Today' },
    { id: 'doc_2', title: 'Operating Systems Scheduling Summary', content: 'Round robin, SJF, Multilevel queue scheduling notes.', date: 'Yesterday' }
  ]);
  const [geminiLiveOpen, setGeminiLiveOpen] = useState(false);
  const [geminiLiveSpeaking, setGeminiLiveSpeaking] = useState(false);
  const [geminiLiveListening, setGeminiLiveListening] = useState(false);
  const [geminiLiveMuted, setGeminiLiveMuted] = useState(false);
  const [geminiCameraOn, setGeminiCameraOn] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [askGeminiInput, setAskGeminiInput] = useState('');
  const [personalIntelligenceEnabled, setPersonalIntelligenceEnabled] = useState(true);
  const [geminiMessages, setGeminiMessages] = useState<Array<{
    id: string;
    role: 'user' | 'gemini';
    text: string;
    timestamp: string;
    featureTag?: string;
  }>>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Speech synthesis for Gemini Speaking Assistant
  const speakWithGemini = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      setGeminiLiveSpeaking(true);
      setGeminiLiveListening(false);
      utterance.onend = () => {
        setGeminiLiveSpeaking(false);
        setGeminiLiveListening(true);
      };
      utterance.onerror = () => {
        setGeminiLiveSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setGeminiLiveSpeaking(true);
      setTimeout(() => {
        setGeminiLiveSpeaking(false);
        setGeminiLiveListening(true);
      }, 3000);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setGeminiLiveSpeaking(false);
  };

  const openGeminiLive = () => {
    setGeminiLiveOpen(true);
    setGeminiLiveMuted(false);
    showToast('MentOS Voice Assistant activated');
    setTimeout(() => {
      speakWithGemini("Hello Hariom! What would you like to explore or work on today in MentOS?");
    }, 350);
  };

  const closeGeminiLive = () => {
    stopSpeaking();
    setGeminiLiveOpen(false);
    setGeminiLiveSpeaking(false);
    setGeminiLiveListening(false);
  };

  const startVoiceDictation = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      return;
    }
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        setIsVoiceRecording(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setAskGeminiInput(transcript);
        };
        recognition.onend = () => {
          setIsVoiceRecording(false);
        };
        recognition.onerror = () => {
          setIsVoiceRecording(false);
        };
        recognition.start();
      } catch {
        simulateVoiceDictation();
      }
    } else {
      simulateVoiceDictation();
    }
  };

  const simulateVoiceDictation = () => {
    setIsVoiceRecording(true);
    showToast('Listening... Speak into microphone');
    setTimeout(() => {
      setAskGeminiInput('Compare Explain-your-code questions and Monaco editor telemetry in MentOS');
      setIsVoiceRecording(false);
      showToast('Voice transcribed');
    }, 2400);
  };

  // Load genuine activities on mount & purge any legacy mock data (clean sheet startup)
  useEffect(() => {
    let isMounted = true;
    setHistoryLoading(true);
    loadActivities()
      .then((items) => {
        if (isMounted) {
          setActivities(items);
          setHistoryLoading(false);
          // Clean sheet: do not auto-select history or pre-load trial architecture document on startup
        }
      })
      .catch((err) => {
        console.error('Failed to load activities:', err);
        if (isMounted) setHistoryLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectActivity = (activity: ActivityItem) => {
    setActiveActivityId(activity.id);
    setActiveChatId(activity.id);

    if (activity.messages && activity.messages.length > 0) {
      setGeminiMessages(activity.messages);
    } else {
      setGeminiMessages([]);
    }

    if (activity.hasArtifact && activity.artifactData) {
      setSelectedVersion(activity.artifactData);
      setSplitRatio(48);
      setArtifactList((prev) => {
        if (!prev.some((x) => x.id === activity.artifactData.id)) {
          return [activity.artifactData, ...prev];
        }
        return prev;
      });
    } else {
      setSelectedVersion(null);
      setSplitRatio(100);
    }

    if (isMobile) {
      if (activity.hasArtifact) {
        setActiveTabMobile('artifact');
      } else {
        setActiveTabMobile('chat');
      }
      setSidebarOpen(false);
    }

    showToast(`Loaded: ${activity.title}`);
  };

  const handleDeleteActivity = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await deleteActivity(id);
    setActivities((prev) => prev.filter((x) => x.id !== id));
    if (activeActivityId === id) {
      setActiveActivityId(null);
      setActiveChatId(null);
      setGeminiMessages([]);
    }
    showToast('Activity removed from history');
  };

  const handleConfirmClearHistory = async () => {
    await clearAllActivities();
    setActivities([]);
    setActiveActivityId(null);
    setActiveChatId(null);
    setGeminiMessages([]);
    setShowClearHistoryModal(false);
    showToast('All activity history cleared');
  };

  const handleStartSkillChat = () => {
    setActiveActivityId(null);
    setActiveChatId(null);
    setGeminiMessages([]);
    setSelectedVersion(null);
    setSplitRatio(100);
    setIsAcademicsMode(false);
    setIsSkillMode(true);
    setAskGeminiInput('');
    setShowFullPrompt(false);
    if (isMobile) setSidebarOpen(false);
    showToast('Skill Workspace active — Hard & Soft Skills Master Operator');
  };

  const handleStartAcademicsChat = () => {
    setActiveActivityId(null);
    setActiveChatId(null);
    setGeminiMessages([]);
    setSelectedVersion(null);
    setSplitRatio(100);
    setIsAcademicsMode(true);
    setIsSkillMode(false);
    setAskGeminiInput('');
    setShowFullPrompt(false);
    if (isMobile) setSidebarOpen(false);
    showToast('Academics Workspace active — Moodle & Study Center');
  };

  const handleStartNewChat = () => {
    setActiveActivityId(null);
    setActiveChatId(null);
    setGeminiMessages([]);
    setSelectedVersion(null);
    setSplitRatio(100);
    setIsAcademicsMode(false);
    setIsSkillMode(false);
    setAskGeminiInput('');
    setShowFullPrompt(false);
    if (isMobile) setSidebarOpen(false);
    showToast('New activity session started');
  };

  const handleGenerateDocument = async (topicTitle?: string): Promise<ArtifactVersion | null> => {
    const topic = topicTitle || 'MentOS Technical Architecture Specification';
    showToast(`Generating document: ${topic}...`);
    try {
      const res = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          context: 'MentOS developer workspace with adaptive learning, Monaco telemetry, and Docker sandbox'
        })
      });
      const data = await res.json();
      const newVersion: ArtifactVersion = {
        id: `v${artifactList.length + 1}`,
        versionNumber: artifactList.length + 1,
        label: `v${artifactList.length + 1} (${data.title || topic})`,
        tag: 'Generated',
        timestamp: 'Just now',
        title: data.title || topic,
        summary: data.subtext || 'Dynamically generated architecture document',
        tableRows: data.tableRows || [],
        heading: data.heading || 'Architecture & Components',
        subtext: data.subtext || 'System design and integration specifications.',
        steps: data.steps || [],
      };

      const updatedList = [newVersion, ...artifactList.filter(x => x.id !== newVersion.id)];
      setArtifactList(updatedList);
      setSelectedVersion(newVersion);
      setSplitRatio(48);
      if (isMobile) setActiveTabMobile('artifact');

      if (activeActivityId) {
        await updateActivityStatus(activeActivityId, 'completed', {
          hasArtifact: true,
          artifactId: newVersion.id,
          artifactData: newVersion,
          summary: `Generated ${newVersion.title}`
        });
        setActivities((prev) =>
          prev.map((a) =>
            a.id === activeActivityId
              ? {
                  ...a,
                  hasArtifact: true,
                  artifactId: newVersion.id,
                  artifactData: newVersion,
                }
              : a
          )
        );
      }

      showToast(`Generated: ${newVersion.title}`);
      return newVersion;
    } catch (err) {
      console.error('Failed to generate document:', err);
      showToast('Document generation failed');
      return null;
    }
  };

  const handleExecuteTask = async (task: { title: string; desc: string; type: ActivityType; ref: string }) => {
    const actId = 'task_' + Date.now();
    setActiveActivityId(actId);
    setActiveChatId(actId);

    const initialActivity: ActivityItem = {
      id: actId,
      title: task.title,
      type: task.type,
      status: 'in-progress',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      summary: `Running ${task.title}...`,
      reference: task.ref,
      hasArtifact: false,
    };

    setActivities((prev) => [initialActivity, ...prev]);
    await saveActivity(initialActivity);
    showToast(`Started: ${task.title}`);

    setGeminiMode('chat');
    handleSendGemini(`Run analysis: ${task.title} - ${task.desc}`, 'Task', actId);
  };

  const handleSendGemini = async (customPrompt?: string, featureTag?: string, existingActId?: string) => {
    const textToSend = customPrompt || askGeminiInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessagePayload = {
      id: Date.now().toString(),
      role: 'user' as const,
      text: textToSend.trim(),
      timestamp: 'Just now',
      featureTag
    };

    const updatedMessages = [...geminiMessages, userMsg];
    setGeminiMessages(updatedMessages);
    setAskGeminiInput('');
    setIsVoiceRecording(false);
    setGeminiFeaturesOpen(false);

    let currentActId = existingActId || activeActivityId;
    let activityType: ActivityType = 'chat';
    if (featureTag === 'Canvas') activityType = 'canvas';
    else if (featureTag === 'Deep Research') activityType = 'deep-research';
    else if (featureTag === 'Task') activityType = 'task';
    else if (textToSend.toLowerCase().includes('telemetry')) activityType = 'telemetry-audit';
    else if (textToSend.toLowerCase().includes('viva') || textToSend.toLowerCase().includes('code')) activityType = 'code-analysis';

    const shortTitle = textToSend.trim().length > 36 ? textToSend.trim().substring(0, 34) + '...' : textToSend.trim();

    if (!currentActId) {
      currentActId = 'act_' + Date.now();
      setActiveActivityId(currentActId);
      setActiveChatId(currentActId);

      const newActivity: ActivityItem = {
        id: currentActId,
        title: shortTitle,
        type: activityType,
        status: 'in-progress',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        summary: `Evaluating ${activityType}...`,
        reference: featureTag ? `MentOS ${featureTag}` : undefined,
        hasArtifact: false,
        messages: updatedMessages
      };

      setActivities((prev) => [newActivity, ...prev.filter((x) => x.id !== currentActId)]);
      await saveActivity(newActivity);
    } else {
      await updateActivityStatus(currentActId, 'in-progress', {
        messages: updatedMessages,
        summary: `Evaluating: ${shortTitle}`
      });
      setActivities((prev) =>
        prev.map((a) =>
          a.id === currentActId
            ? {
                ...a,
                status: 'in-progress',
                updatedAt: Date.now(),
                messages: updatedMessages,
                summary: `Evaluating: ${shortTitle}`
              }
            : a
        )
      );
    }

    try {
      // Real API call to server-side backend
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          prompt: textToSend.trim(),
          featureTag
        })
      });

      const data = await res.json();
      const reply = data.text || 'Analysis completed.';

      const assistantMsg: ChatMessagePayload = {
        id: (Date.now() + 1).toString(),
        role: 'gemini' as const,
        text: reply,
        timestamp: 'Just now',
        featureTag
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setGeminiMessages(finalMessages);

      // Check if user requested canvas or document generation
      const lower = textToSend.toLowerCase();
      let generatedDoc: ArtifactVersion | null = selectedVersion;
      if (featureTag === 'Canvas' || lower.includes('generate document') || lower.includes('create architecture') || lower.includes('technical spec') || lower.includes('create report')) {
        generatedDoc = await handleGenerateDocument(shortTitle);
      }

      const finalSummary = reply.length > 70 ? reply.substring(0, 68) + '...' : reply;

      if (currentActId) {
        await updateActivityStatus(currentActId, 'completed', {
          messages: finalMessages,
          summary: finalSummary,
          hasArtifact: generatedDoc !== null,
          artifactId: generatedDoc ? generatedDoc.id : undefined,
          artifactData: generatedDoc || undefined
        });
        setActivities((prev) =>
          prev.map((a) =>
            a.id === currentActId
              ? {
                  ...a,
                  status: 'completed',
                  updatedAt: Date.now(),
                  messages: finalMessages,
                  summary: finalSummary,
                  hasArtifact: generatedDoc !== null,
                  artifactId: generatedDoc ? generatedDoc.id : undefined,
                  artifactData: generatedDoc || undefined
                }
              : a
          )
        );
      }

      showToast('MentOS replied');
    } catch (err: any) {
      console.error('Chat API error:', err);
      const fallbackReply = `MentOS processed "${textToSend.trim()}". All core developer modules are active.`;
      const assistantMsg: ChatMessagePayload = {
        id: (Date.now() + 1).toString(),
        role: 'gemini' as const,
        text: fallbackReply,
        timestamp: 'Just now',
        featureTag
      };
      const finalMessages = [...updatedMessages, assistantMsg];
      setGeminiMessages(finalMessages);
      showToast('MentOS completed response');
    }
  };

  // Viewport resize tracking with passive listener
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      if (width < 768) {
        setSidebarOpen(false);
      } else if (width >= 1024) {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered Activities for Recent History
  const filteredActivities = activities.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.summary && item.summary.toLowerCase().includes(q)) ||
      (item.reference && item.reference.toLowerCase().includes(q)) ||
      item.type.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (activityFilter === 'all') return true;
    if (activityFilter === 'chat') return item.type === 'chat' || item.type === 'voice-session';
    if (activityFilter === 'task') return item.type === 'task' || item.type === 'telemetry-audit';
    if (activityFilter === 'analysis') {
      return (
        item.type === 'code-analysis' ||
        item.type === 'architecture' ||
        item.type === 'deep-research' ||
        item.type === 'canvas'
      );
    }
    return true;
  });

  // Drag handler for resizable split pane
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || isMobile) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const newRatio = (relativeX / rect.width) * 100;
      if (newRatio >= 22 && newRatio <= 78) {
        setSplitRatio(newRatio);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMobile]);

  // Helper to generate formatted markdown for any artifact version
  const generateMarkdownForVersion = (ver: ArtifactVersion) => {
    let md = `# ${ver.title}\n\n`;
    md += `| Feature / Module | Description |\n|---|---|\n`;
    ver.tableRows.forEach(row => {
      md += `| ${row.feature} | ${row.description} |\n`;
    });
    md += `\n## ${ver.heading}\n${ver.subtext}\n\n`;
    ver.steps.forEach(s => {
      md += `${s.stepNumber}. **${s.title}** ${s.description}\n`;
    });
    return md;
  };

  // Function to save/download artifact directly
  const saveArtifactFile = async () => {
    if (!selectedVersion) {
      showToast('No active document to save');
      return;
    }
    const markdownContent = generateMarkdownForVersion(selectedVersion);
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mentos-architecture-v${selectedVersion.versionNumber}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Record authentic activity in Recent History
    const actId = 'art_' + Date.now();
    const exportActivity: ActivityItem = {
      id: actId,
      title: `Saved ${selectedVersion.title}`,
      type: 'architecture',
      status: 'completed',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      summary: `Exported ${selectedVersion.id} architecture markdown document`,
      reference: `mentos-architecture-v${selectedVersion.versionNumber}.md`,
      hasArtifact: true,
      artifactId: selectedVersion.id,
      artifactData: selectedVersion
    };
    setActivities((prev) => [exportActivity, ...prev]);
    await saveActivity(exportActivity);

    showToast(`Saved mentos-architecture-v${selectedVersion.versionNumber}.md (Ctrl+S)`);
  };

  const copyArtifactMarkdown = () => {
    if (!selectedVersion) {
      showToast('No active document to copy');
      return;
    }
    const markdownContent = generateMarkdownForVersion(selectedVersion);
    navigator.clipboard.writeText(markdownContent);
    setCopiedExport(true);
    showToast(`Copied Version ${selectedVersion.versionNumber} to clipboard`);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  // Dedicated Artifact Print Handler
  const handlePrintArtifact = () => {
    // Dismiss open modals before printing so backdrop doesn't interfere
    setShowMemoryModal(false);
    setShowProPlanModal(false);
    setShowExportModal(false);
    showToast('Opening clean print document...');
    setTimeout(() => {
      window.print();
    }, 120);
  };

  // Global Keyboard Shortcuts (Ctrl+K, Ctrl+S, Ctrl+P, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;

      // 1. Ctrl+K / Cmd+K: Focus Search
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSidebarOpen(true);
        setTimeout(() => {
          const searchInput = document.getElementById('search-sidebar-input') as HTMLInputElement | null;
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        }, 80);
        return;
      }

      // 2. Ctrl+S / Cmd+S: Save Artifact
      if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveArtifactFile();
        return;
      }

      // 3. Ctrl+P / Cmd+P: Print Artifact
      if (isCmdOrCtrl && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrintArtifact();
        return;
      }

      // 4. Esc: Close Gemini voice/features, version dropdown, open modals, or sidebar
      if (e.key === 'Escape') {
        if (geminiLiveOpen) {
          closeGeminiLive();
          showToast('Voice Assistant closed (Esc)');
          return;
        }
        if (geminiFeaturesOpen) {
          setGeminiFeaturesOpen(false);
          return;
        }
        if (showVersionDropdown) {
          setShowVersionDropdown(false);
          showToast('Version menu closed (Esc)');
          return;
        }
        if (showClearHistoryModal) {
          setShowClearHistoryModal(false);
          showToast('Modal closed (Esc)');
          return;
        }
        if (showMemoryModal || showProPlanModal || showExportModal) {
          setShowMemoryModal(false);
          setShowProPlanModal(false);
          setShowExportModal(false);
          showToast('Modal closed (Esc)');
        } else if (sidebarOpen) {
          setSidebarOpen(false);
          showToast('Sidebar closed (Esc)');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showClearHistoryModal, showMemoryModal, showProPlanModal, showExportModal, sidebarOpen, showVersionDropdown, selectedVersion, geminiLiveOpen, geminiFeaturesOpen]);

  const scrollToBottom = () => {
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-screen overflow-hidden bg-[#ffffff] text-[#1b1b1b] font-sans antialiased relative">
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-60 bg-neutral-900 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Window Chrome Bar */}
      <header className="h-10 bg-[#fbfbfa] border-b border-[#e9e9e7] px-2 sm:px-3 flex items-center justify-between shrink-0 text-[#404040] z-20">
        {/* Left Chrome Controls: Three lines + MentOS at the corner, buttons kept aside */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Three lines menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            className="p-1.5 rounded-md hover:bg-[#eae9e5] active:bg-[#dedcd6] transition-colors text-[#525252] flex items-center justify-center cursor-pointer"
            aria-label="Toggle navigation"
          >
            <Menu className="w-4 h-4 stroke-[1.8]" />
          </button>

          {/* MentOS dropdown right at the corner aside of three lines */}
          <div className="flex items-center gap-1 text-sm font-semibold text-[#1f1f1f] cursor-pointer hover:bg-[#efeee9] px-2 py-1 rounded-md transition-colors ml-0.5">
            <span>MentOS</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#73716c] stroke-[2.2] shrink-0" />
          </div>

          {/* Div 1 buttons kept a little bit aside on tablet & desktop */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 ml-2 sm:ml-4 pl-2 sm:pl-3 border-l border-[#e4e3de]">
            {/* Desktop sidebar toggle icon */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Sidebar Layout"
              className="inline-flex p-1.5 rounded-md hover:bg-[#eae9e5] transition-colors text-[#525252] cursor-pointer"
            >
              <PanelLeft className="w-4 h-4 stroke-[1.8]" />
            </button>

            {/* History navigation */}
            <div className="hidden md:flex items-center gap-0.5 ml-0.5">
              <button
                title="Back"
                className="p-1.5 rounded-md hover:bg-[#eae9e5] transition-colors text-[#525252]"
              >
                <ChevronLeft className="w-4 h-4 stroke-[1.8]" />
              </button>
              <button
                title="Forward"
                disabled
                className="p-1.5 rounded-md text-[#b4b4b4] cursor-default"
              >
                <ChevronRight className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>

            <div className="flex items-center gap-1 ml-0.5 sm:ml-1.5">
              <button
                onClick={() => {
                  setSidebarOpen(true);
                  setTimeout(() => {
                    document.getElementById('search-sidebar-input')?.focus();
                  }, 120);
                }}
                className="p-1.5 rounded-md hover:bg-[#eae9e5] transition-colors text-[#525252]"
                title="Search (Ctrl+K)"
              >
                <Search className="w-4 h-4 stroke-[1.8]" />
              </button>
              <button
                onClick={() => {
                  if (isMobile) {
                    setActiveTabMobile(activeTabMobile === 'chat' ? 'artifact' : 'chat');
                  } else {
                    setArtifactMode(artifactMode === 'code' ? 'preview' : 'code');
                  }
                }}
                className={`p-1.5 rounded-md transition-colors ${
                  artifactMode === 'code' && !isMobile
                    ? 'bg-[#e5e4de] text-[#1a1a1a]'
                    : 'hover:bg-[#eae9e5] text-[#525252]'
                }`}
                title="Toggle Code / Markdown"
              >
                <Code2 className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>
          </div>
        </div>

        {/* Center Section: Mobile segmented view switcher or clean spacing on desktop */}
        <div className="flex items-center justify-center min-w-0 px-1">
          {isMobile && (
            <div className="flex items-center bg-[#eae8e1] p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveTabMobile('chat')}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTabMobile === 'chat'
                    ? 'bg-white text-[#1f1f1f] shadow-xs font-semibold'
                    : 'text-[#66645e] hover:text-[#1f1f1f]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setActiveTabMobile('artifact')}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTabMobile === 'artifact'
                    ? 'bg-white text-[#1f1f1f] shadow-xs font-semibold'
                    : 'text-[#66645e] hover:text-[#1f1f1f]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Artifact</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              </button>
            </div>
          )}
        </div>

        {/* Right Section: Artifact Version History Dropdown, View Toggles & Desktop Window Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Artifact Version History Dropdown in Top Header */}
          <div className="relative">
            {selectedVersion ? (
              <button
                onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                title="Artifact Version History (Esc to close)"
                className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold text-[#383734] hover:bg-[#eae8e1] border border-[#dedcd5] bg-white shadow-2xs transition-colors cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                <span className="font-mono text-neutral-900">{selectedVersion.id}</span>
                <span className="hidden sm:inline font-normal text-neutral-500">
                  {selectedVersion.tag ? `(${selectedVersion.tag})` : ''}
                </span>
                <ChevronDown className={`w-3 h-3 text-neutral-500 transition-transform duration-150 ${showVersionDropdown ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <button
                onClick={() => handleGenerateDocument('Technical Architecture Specification')}
                title="Generate an artifact document"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-[#eae8e1] border border-[#dedcd5] bg-white shadow-2xs transition-colors cursor-pointer"
              >
                <FileText className="w-3 h-3 text-neutral-600" />
                <span>+ Document</span>
              </button>
            )}

            {/* Version History Dropdown Menu */}
            {showVersionDropdown && (
              <>
                <div
                  className="fixed inset-0 z-45"
                  onClick={() => setShowVersionDropdown(false)}
                />
                <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white border border-[#dedcd5] rounded-xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 border-b border-[#f0eee8] flex items-center justify-between mb-1">
                    <div>
                      <div className="text-[11px] font-bold text-neutral-900 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-amber-600" />
                        <span>Artifact Version History</span>
                      </div>
                      <div className="text-[10px] text-neutral-500">Saved states of MentOS</div>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200">
                      Esc
                    </span>
                  </div>

                  <div className="space-y-1 max-h-[280px] overflow-y-auto py-1">
                    {artifactList.length === 0 ? (
                      <div className="py-4 text-center text-xs text-neutral-400">
                        No artifact versions generated yet.
                      </div>
                    ) : (
                      artifactList.map((ver) => {
                        const isSelected = selectedVersion?.id === ver.id;
                        return (
                          <button
                            key={ver.id}
                            onClick={() => {
                              setSelectedVersion(ver);
                              setShowVersionDropdown(false);
                              showToast(`Restored artifact ${ver.label}`);
                            }}
                            className={`w-full text-left p-2 rounded-lg transition-colors cursor-pointer flex items-start gap-2.5 ${
                              isSelected
                                ? 'bg-[#f7f5ee] border border-[#e3dfd3]'
                                : 'hover:bg-[#faf9f6] border border-transparent'
                            }`}
                          >
                            <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-neutral-900 text-white' : 'border border-neutral-300'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-semibold truncate ${isSelected ? 'text-neutral-900' : 'text-neutral-700'}`}>
                                  {ver.label}
                                </span>
                                <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                                  {ver.timestamp}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                                {ver.summary}
                              </p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-2 mt-1 border-t border-[#f0eee8] px-2 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>Ctrl+S to save</span>
                    <button
                      onClick={() => {
                        setShowVersionDropdown(false);
                        handlePrintArtifact();
                      }}
                      className="text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Document</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => {
              if (isMobile) {
                setActiveTabMobile(activeTabMobile === 'chat' ? 'artifact' : 'chat');
              } else {
                setArtifactFullscreen(!artifactFullscreen);
              }
            }}
            title={artifactFullscreen ? 'Restore split layout' : 'Toggle split layout'}
            className="p-1.5 rounded-md hover:bg-[#eae9e5] text-[#525252] transition-colors cursor-pointer"
          >
            <div className="w-3.5 h-3.5 border border-[#525252] rounded-xs flex overflow-hidden">
              <div className="w-2 border-r border-[#525252] bg-transparent" />
              <div className="w-1.5 bg-[#525252]/20" />
            </div>
          </button>

          {/* Desktop-only window controls */}
          <div className="hidden md:flex items-center gap-2 pl-2.5 ml-1.5 border-l border-[#e4e3de]">
            <button
              title="Minimize"
              className="w-4 h-4 flex items-center justify-center text-[#525252] hover:text-[#111]"
            >
              <Minus className="w-3 h-3 stroke-[2]" />
            </button>
            <button
              title="Maximize"
              className="w-4 h-4 flex items-center justify-center text-[#525252] hover:text-[#111]"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
            >
              <Square className="w-2.5 h-2.5 stroke-[2]" />
            </button>
            <button
              title="Close"
              className="w-4 h-4 flex items-center justify-center text-[#525252] hover:text-rose-600"
            >
              <X className="w-3 h-3 stroke-[2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden relative w-full h-[calc(100%-40px)]">
        {/* Mobile Backdrop when Sidebar drawer is active */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-10 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200"
            aria-hidden="true"
          />
        )}

        {/* Sidebar: Slide-over Drawer on Mobile, Smooth Collapsible Panel on Desktop */}
        <aside
          className={`${
            isMobile
              ? `fixed top-10 bottom-0 left-0 z-50 w-[275px] max-w-[85vw] bg-[#faf9f5] shadow-2xl flex flex-col transition-transform duration-250 ease-out ${
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : `${
                  sidebarOpen ? (isTablet ? 'w-[200px]' : 'w-[236px]') : 'w-0'
                } bg-[#faf9f5] border-r border-[#ecebe7] flex flex-col shrink-0 transition-all duration-200 overflow-hidden select-none`
          }`}
        >
          {/* Mobile Drawer Header */}
          {isMobile && (
            <div className="px-3.5 py-2.5 border-b border-[#ecebe7] flex items-center justify-between">
              <span className="text-xs font-bold text-[#353430] tracking-wide">
                Conversations
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md text-[#787671] hover:text-black hover:bg-[#edebe5] transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search Box */}
          <div className="p-2.5 pb-1">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#8f8e8a] pointer-events-none" />
              <input
                id="search-sidebar-input"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent hover:bg-[#f1efe9] focus:bg-white text-xs text-[#2b2b2b] placeholder-[#8f8e8a] pl-8 pr-14 py-1.5 rounded-lg border border-transparent focus:border-[#d7d5cf] focus:outline-none transition-colors"
              />
              <kbd className="absolute right-2 text-[9px] font-mono text-[#8f8e8a] bg-[#ebe9e3] px-1.5 py-0.5 rounded border border-[#dfddd7] pointer-events-none">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Sidebar Action Buttons */}
          <div className="px-2 py-1 space-y-0.5 text-xs font-medium text-[#3b3a36]">
            <button
              onClick={handleStartNewChat}
              className="w-full flex items-center gap-2 px-2.5 py-2 sm:py-1.5 rounded-lg hover:bg-[#eceae4] text-left transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#5e5c56] stroke-[2.2]" />
              <span>New</span>
            </button>
            <button
              onClick={handleStartAcademicsChat}
              className="w-full flex items-center gap-2 px-2.5 py-2 sm:py-1.5 rounded-lg hover:bg-[#eceae4] text-left transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#5e5c56] stroke-[2]" />
              <span>Academics</span>
            </button>
            <button
              onClick={handleStartSkillChat}
              className="w-full flex items-center gap-2 px-2.5 py-2 sm:py-1.5 rounded-lg hover:bg-[#eceae4] text-left transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#5e5c56] stroke-[2]" />
              <span>Skill</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2.5 py-2 sm:py-1.5 rounded-lg hover:bg-[#eceae4] text-left transition-colors cursor-pointer">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#5e5c56] stroke-[2]" />
              <span>Customize</span>
            </button>
          </div>

          {/* Recent History List */}
          <div className="flex-1 overflow-y-auto px-2 pt-3 pb-2 no-scrollbar flex flex-col">
            <div className="flex items-center justify-between px-2.5 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold tracking-wide text-[#73716b]">
                  Recent History
                </span>
                {activities.length > 0 && (
                  <span className="text-[10px] font-mono text-neutral-500 bg-[#ebe9e2] px-1.5 py-0.2 rounded-full font-medium">
                    {filteredActivities.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-0.5">
                {activities.length > 0 && (
                  <button
                    onClick={() => setShowClearHistoryModal(true)}
                    title="Clear All History"
                    className="text-[#8e8d88] hover:text-rose-600 p-1 rounded hover:bg-[#edebe5] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 stroke-[2]" />
                  </button>
                )}
                <button
                  onClick={() => setShowHistoryFilters(!showHistoryFilters)}
                  title="Filter activities"
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    showHistoryFilters || activityFilter !== 'all'
                      ? 'bg-[#e5e3dc] text-neutral-900'
                      : 'text-[#8e8d88] hover:text-[#3e3d39] hover:bg-[#edebe5]'
                  }`}
                >
                  <Filter className="w-3 h-3 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* Filter Chips Bar (when toggled or filtered) */}
            {(showHistoryFilters || activityFilter !== 'all') && (
              <div className="px-2 py-1 mb-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-[#ecebe7]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'chat', label: 'Chats' },
                  { id: 'task', label: 'Tasks' },
                  { id: 'analysis', label: 'Analyses' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActivityFilter(f.id as any)}
                    className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                      activityFilter === f.id
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'bg-[#edebe5] text-neutral-600 hover:text-black'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* Activity List Container */}
            <div className="space-y-1 flex-1">
              {historyLoading ? (
                <div className="py-6 flex items-center justify-center text-neutral-400 gap-1.5 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading history...</span>
                </div>
              ) : activities.length === 0 ? (
                /* Clean MentOS Empty State */
                <div className="py-8 px-3 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#f2f1ec] mx-auto flex items-center justify-center text-neutral-500">
                    <Clock className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-800">No recent activity</div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed mt-1 max-w-[190px] mx-auto">
                      Real-time events and analysis results will appear here as you work in MentOS.
                    </p>
                  </div>
                </div>
              ) : filteredActivities.length === 0 ? (
                /* No Filter/Search Match */
                <div className="py-6 px-3 text-center text-xs text-neutral-500 space-y-1">
                  <p>No activities match your filters.</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-[11px] text-neutral-800 underline font-medium cursor-pointer"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                /* Genuine History Items */
                filteredActivities.map((item) => {
                  const isActive = activeActivityId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectActivity(item)}
                      className={`w-full group relative flex items-start gap-2 p-2 rounded-lg text-xs text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#ecebe6] text-[#1f1e1a] font-medium border border-[#dedcd5]'
                          : 'text-[#44423e] hover:bg-[#f1efe9] border border-transparent'
                      }`}
                    >
                      {/* Status / Type Indicator Icon */}
                      <div className="mt-0.5 shrink-0">
                        {item.status === 'in-progress' ? (
                          <span className="relative flex h-2.5 w-2.5 mt-0.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                          </span>
                        ) : item.status === 'failed' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        ) : item.hasArtifact ? (
                          <FileText className="w-3.5 h-3.5 text-neutral-600" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-neutral-400 group-hover:bg-neutral-800 transition-colors inline-block mt-1" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`truncate text-xs ${isActive ? 'font-semibold text-neutral-900' : 'text-neutral-800'}`}>
                            {item.title}
                          </span>
                        </div>

                        {/* Subtext: time, type, status */}
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-0.5 font-mono">
                          <span>{formatActivityTime(item.createdAt)}</span>
                          <span>•</span>
                          <span className="capitalize">{item.type.replace('-', ' ')}</span>
                          {item.status === 'in-progress' && (
                            <span className="text-amber-700 font-sans font-semibold">• Running</span>
                          )}
                        </div>

                        {/* Short Summary snippet */}
                        {item.summary && (
                          <p className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5 leading-normal">
                            {item.summary}
                          </p>
                        )}
                      </div>

                      {/* Hover Actions: Delete single entry */}
                      <div className="absolute right-1.5 top-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDeleteActivity(item.id, e)}
                          title="Remove from history"
                          className="p-1 rounded hover:bg-[#dedcd6] text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="p-2.5 border-t border-[#ecebe7] flex items-center justify-between text-xs text-[#353430] bg-[#faf9f5]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#cc785c] flex items-center justify-center text-white font-bold text-xs shrink-0">
                S
              </div>
              <div
                onClick={() => setShowProPlanModal(true)}
                className="flex items-center gap-1 font-medium cursor-pointer hover:text-[#000] truncate"
              >
                <span className="truncate">Shivansh</span>
                <span className="text-[#888681]">· Free</span>
                <ChevronDown className="w-3 h-3 text-[#888681] shrink-0" />
              </div>
            </div>

            <button
              title="Settings & Tools"
              onClick={() => showToast('Preferences & settings')}
              className="p-1 rounded hover:bg-[#edebe5] text-[#7d7b76] hover:text-[#333] transition-colors"
            >
              <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                <span className="w-1 h-1 bg-current rounded-xs" />
                <span className="w-1 h-1 bg-current rounded-xs" />
                <span className="w-1 h-1 bg-current rounded-xs" />
                <span className="w-1 h-1 bg-current rounded-xs" />
              </div>
            </button>
          </div>
        </aside>

        {/* Content Viewport (Responsive Split or Mobile Tab views) */}
        <div ref={containerRef} className="flex-1 flex overflow-hidden relative w-full h-full">
          {/* Conversation Panel */}
          <div
            style={{
              width: isMobile
                ? '100%'
                : artifactFullscreen
                ? '0%'
                : `${splitRatio}%`,
              display: isMobile && activeTabMobile !== 'chat' ? 'none' : artifactFullscreen ? 'none' : 'flex',
            }}
            className="chat-pane flex-col h-full bg-[#ffffff] border-r border-[#ecebe7] overflow-hidden min-w-0"
          >
            {/* Scrollable Conversation Content */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6"
            >
              {/* TASK MODE: Task workflow cards */}
              {geminiMessages.length === 0 && geminiMode === 'task' ? (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-1">
                    Active Tasks & Labs
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { title: 'Docker Sandbox Evaluation', desc: 'Run hidden unit tests against inheritance code', icon: Code2, tag: 'Ready' },
                      { title: 'Monaco Telemetry Audit', desc: 'Scan typing replay log for paste events & speed anomalies', icon: Activity, tag: 'Active' },
                      { title: 'AI Viva Questions', desc: 'Generate 2-3 tailored probing questions from student solution', icon: MessageSquare, tag: 'Generated' },
                      { title: 'Batch Mastery Heatmap', desc: 'Evaluate student concepts vs prerequisites graph', icon: TableIcon, tag: 'Updated' },
                    ].map((task, idx) => {
                      const TaskIcon = task.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            handleExecuteTask({
                              title: task.title,
                              desc: task.desc,
                              type: 'task',
                              ref: 'mentos-workspace'
                            });
                          }}
                          className="p-3.5 rounded-xl border border-[#e5e4de] hover:border-neutral-900 bg-white hover:bg-[#faf9f6] transition-all cursor-pointer shadow-2xs group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 rounded-lg bg-[#f4f3ee] group-hover:bg-[#eae8e2] flex items-center justify-center text-neutral-800 transition-colors">
                              <TaskIcon className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-[#f4f3ee] text-neutral-700 border border-[#e5e4de]">
                              {task.tag}
                            </span>
                          </div>
                          <div className="font-semibold text-xs text-[#1f1f1f]">{task.title}</div>
                          <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">{task.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* CHAT MODE: Main Conversation Content */
                geminiMessages.length === 0 ? (
                  <div className="py-12 sm:py-20 text-center space-y-4 max-w-[560px] mx-auto animate-in fade-in duration-300">
                    <h1 className="text-3xl sm:text-4xl font-serif text-[#1f1e1b] font-normal tracking-tight">
                      Hello, Shivansh
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                      Your personalized mentor for academics & future success. How can I help you today?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-4">
                      {[
                        { title: 'Academic Study Notes', desc: 'Summarize lectures, Moodle notes & course materials' },
                        { title: 'Path & Skill Monitor', desc: 'Track curriculum milestones & prerequisite mastery' },
                        { title: 'Docker Sandbox Evaluation', desc: 'Inspect container isolation and unit test execution' },
                        { title: 'Generate System Architecture', desc: 'Produce real-time technical specification document' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendGemini(item.title + ': ' + item.desc)}
                          className="p-3.5 rounded-xl border border-[#e5e4de] hover:border-neutral-900 bg-white hover:bg-[#faf9f6] transition-all cursor-pointer text-left shadow-2xs group"
                        >
                          <div className="text-xs font-semibold text-neutral-900 group-hover:text-black flex items-center justify-between">
                            <span>{item.title}</span>
                            <ArrowUp className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                            {item.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-5">
                    {geminiMessages.map((msg, idx) => {
                      const { cleanText, chart } = parseMessageContent(msg.text);
                      const isUser = msg.role === 'user';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200 w-full`}
                        >
                          {/* Claude-style Source / Context Line for AI */}
                          {!isUser && (
                            <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium px-0.5">
                              <span>Used MentOS Docs, used artifacts</span>
                              <ChevronRight className="w-3 h-3 text-neutral-400" />
                            </div>
                          )}

                          {/* Message Bubble / Content */}
                          <div
                            className={`p-3.5 sm:p-4 rounded-2xl max-w-full sm:max-w-[680px] text-[13px] sm:text-[13.5px] leading-relaxed ${
                              isUser
                                ? 'bg-[#f4f3ef] text-[#2b2a26] border border-[#e5e4de] font-normal rounded-br-xs ml-auto shadow-2xs'
                                : 'text-[#1f2937] space-y-3 bg-transparent p-0 border-0 shadow-none'
                            }`}
                          >
                            <FormattedMessage text={cleanText} />
                            {chart && <InteractiveChart chart={chart} />}

                            {/* Inline Claude-Style Artifact Card (shown on latest AI response if selectedVersion exists) */}
                            {!isUser && selectedVersion && idx === geminiMessages.length - 1 && (
                              <div className="mt-3 p-3 bg-white border border-[#dedcd5] rounded-xl flex items-center justify-between gap-3 shadow-2xs max-w-md">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold text-neutral-900 truncate">
                                      {selectedVersion.title}
                                    </div>
                                    <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                                      <span>MentOS Docs</span>
                                      <span>•</span>
                                      <span className="text-neutral-400">Only you</span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setSplitRatio(48);
                                    if (isMobile) setActiveTabMobile('artifact');
                                    showToast(`Opened: ${selectedVersion.title}`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg border border-[#d2d0c8] bg-white hover:bg-[#f5f4ef] text-xs font-semibold text-neutral-800 shadow-2xs transition-colors cursor-pointer shrink-0"
                                >
                                  Open
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* Scroll Down Floating Indicator */}
              <div className="flex justify-center pt-1">
                <button
                  onClick={scrollToBottom}
                  title="Scroll to bottom"
                  className="w-7 h-7 bg-white border border-[#e3e2dc] rounded-full shadow-xs flex items-center justify-center text-[#5c5b56] hover:bg-[#faf9f5] hover:text-[#111] transition-colors cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>

              {/* Mobile Jump-to-Artifact Banner */}
              {isMobile && selectedVersion && (
                <div className="pt-1">
                  <button
                    onClick={() => setActiveTabMobile('artifact')}
                    className="w-full bg-[#f6f5f0] border border-[#e1dfd7] hover:border-[#cfcdc4] p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-[#2c2b28]">
                      <FileText className="w-4 h-4 text-neutral-600" />
                      <span className="font-semibold">{selectedVersion.title}</span>
                    </div>
                    <span className="text-neutral-500 font-semibold flex items-center gap-0.5">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              )}

            </div>

            {/* Stably Docked Bottom Input Bar & Disclaimer (Fixed Footer matching ChatGPT / Claude / Gemini) */}
            <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-[#ecebe7] px-3.5 sm:px-6 py-3 z-30 space-y-2 shadow-xs">
              <div className="max-w-[720px] mx-auto w-full space-y-2">
                {/* Minimal Single-Line Prompt Helper (Only appears when chat has not started) */}
                {geminiMessages.length === 0 && (
                  <div className="flex items-center justify-between bg-[#f8f7f4] border border-[#e5e4de] rounded-xl px-3 py-1.5 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 text-neutral-800 font-semibold truncate">
                      <Sparkles className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                      <span className="truncate">Look what you can do with MentOS</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setGeminiFeaturesOpen(true)}
                        className="px-3 py-1 rounded-full text-[11px] font-semibold text-neutral-800 bg-white border border-[#dedcd5] shadow-2xs hover:bg-[#f5f4ee] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>Let&apos;s go</span>
                      </button>

                      {/* Chat vs Task Mode Switcher Pill */}
                      <div className="bg-[#ecebe6] p-0.5 rounded-full inline-flex items-center text-[11px] font-medium border border-[#dedcd5]">
                        <button
                          onClick={() => setGeminiMode('chat')}
                          className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                            geminiMode === 'chat'
                              ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                              : 'text-[#63615b] hover:text-neutral-900'
                          }`}
                        >
                          Chat
                        </button>
                        <button
                          onClick={() => setGeminiMode('task')}
                          className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                            geminiMode === 'task'
                              ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                              : 'text-[#63615b] hover:text-neutral-900'
                          }`}
                        >
                          Task
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MentOS Docked Floating Input Bar (Monochromatic Theme) */}
                <div>
                  {isVoiceRecording ? (
                    /* Live Animated Waveform Bar while Dictating */
                    <div className="bg-[#f7f6f2] border border-[#dedcd5] rounded-full px-3.5 py-2.5 flex items-center justify-between shadow-2xs animate-in fade-in duration-150">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <button
                          onClick={() => setGeminiFeaturesOpen(true)}
                          className="w-7 h-7 rounded-full bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors shadow-2xs shrink-0 cursor-pointer border border-[#dedcd5]"
                          title="Open Features"
                        >
                          <Plus className="w-4 h-4 stroke-[2]" />
                        </button>

                        {/* Animated Soundwave Bars in MentOS Monochrome */}
                        <div className="flex items-center gap-1 px-1 overflow-hidden">
                          <span className="w-1 h-2.5 bg-neutral-800 rounded-full animate-pulse" />
                          <span className="w-1 h-5 bg-neutral-900 rounded-full animate-bounce delay-75" />
                          <span className="w-1 h-6 bg-neutral-700 rounded-full animate-bounce delay-150" />
                          <span className="w-1 h-3.5 bg-neutral-800 rounded-full animate-pulse" />
                          <span className="w-1 h-5 bg-neutral-900 rounded-full animate-bounce delay-100" />
                          <span className="w-1 h-2 bg-neutral-700 rounded-full animate-pulse" />
                          <span className="w-1 h-4 bg-neutral-900 rounded-full animate-bounce" />
                          <span className="w-1 h-5.5 bg-neutral-800 rounded-full animate-bounce delay-75" />
                          <span className="w-1 h-3 bg-neutral-700 rounded-full animate-pulse" />
                        </div>
                        <span className="text-xs font-semibold text-neutral-800 truncate">Listening to voice...</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setIsVoiceRecording(false)}
                          className="w-7 h-7 rounded-full bg-white border border-[#dedcd5] hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                          title="Cancel recording"
                        >
                          <Square className="w-3 h-3 fill-current" />
                        </button>
                        <button
                          onClick={() => handleSendGemini()}
                          className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-black text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                          title="Submit transcribed prompt"
                        >
                          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Standard MentOS Pill Input Capsule */
                    <div className="bg-[#f7f6f2] hover:bg-[#f2f0ea] focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-400/20 border border-[#dedcd5] rounded-full px-2.5 py-1.5 sm:py-2 flex items-center gap-2 shadow-2xs transition-all">
                      {/* Plus Button: Opens MentOS features drawer */}
                      <button
                        onClick={() => setGeminiFeaturesOpen(!geminiFeaturesOpen)}
                        className="w-8 h-8 rounded-full hover:bg-black/5 active:bg-black/10 flex items-center justify-center text-[#55534e] transition-colors shrink-0 cursor-pointer"
                        title="Tools & Features"
                      >
                        <Plus
                          className={`w-4 h-4 stroke-[2] transition-transform duration-200 ${
                            geminiFeaturesOpen ? 'rotate-45 text-neutral-900' : ''
                          }`}
                        />
                      </button>

                      {/* Ask MentOS Input */}
                      <input
                        type="text"
                        value={askGeminiInput}
                        onChange={(e) => setAskGeminiInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && askGeminiInput.trim()) {
                            handleSendGemini();
                          }
                        }}
                        placeholder="Ask MentOS..."
                        className="flex-1 bg-transparent text-xs sm:text-sm text-[#1f1f1f] placeholder-[#888681] focus:outline-none min-w-0"
                      />

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {askGeminiInput.trim() ? (
                          /* Circular Send Button in MentOS Black */
                          <button
                            onClick={() => handleSendGemini()}
                            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-black text-white flex items-center justify-center shadow-xs cursor-pointer transition-all active:scale-95"
                            title="Send prompt"
                          >
                            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        ) : (
                          <>
                            {/* Microphone Button (Speech Dictation) */}
                            <button
                              onClick={startVoiceDictation}
                              className="p-1.5 rounded-full hover:bg-black/5 text-[#55534e] hover:text-[#111] transition-colors cursor-pointer"
                              title="Dictate with voice"
                            >
                              <Mic className="w-4 h-4" />
                            </button>

                            {/* MentOS Speaking Assistant Pill with Equalizer Bars */}
                            <button
                              onClick={openGeminiLive}
                              className="bg-neutral-900 hover:bg-black text-white px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer group active:scale-95"
                              title="MentOS Speaking Assistant"
                            >
                              <div className="flex items-center gap-0.5 h-3">
                                <span className="w-0.5 h-2 bg-white rounded-full group-hover:animate-bounce" />
                                <span className="w-0.5 h-3.5 bg-white rounded-full group-hover:animate-pulse" />
                                <span className="w-0.5 h-1.5 bg-white rounded-full group-hover:animate-bounce" />
                                <span className="w-0.5 h-2.5 bg-white rounded-full group-hover:animate-pulse" />
                              </div>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-center">
                <p className="text-[10px] text-[#9a9893]">
                  MentOS may display inaccurate info, including about code evaluation, so double-check its responses.
                </p>
              </div>
            </div>
          </div>

          {/* Gemini Features Drawer / Bottom Sheet (Light Theme matching video 00:07 - 00:17) */}
          {geminiFeaturesOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/25 backdrop-blur-2xs transition-opacity"
                onClick={() => setGeminiFeaturesOpen(false)}
              />
              <div className="absolute left-2 right-2 bottom-16 sm:bottom-20 z-50 bg-white border border-[#dedcd5] rounded-3xl shadow-2xl overflow-hidden p-3.5 sm:p-5 max-w-[580px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0eee8] mb-2.5">
                  <div className="text-xs font-bold text-[#1f1f1f] flex items-center gap-2">
                    <span>
                      {isSkillMode
                        ? 'Skill Workspace (Hard & Soft Skills)'
                        : isAcademicsMode
                        ? 'Academics Workspace (Moodle & Study Center)'
                        : 'Master Operator — All Features & Tools'}
                    </span>
                    {isSkillMode && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        Skill Master
                      </span>
                    )}
                    {isAcademicsMode && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                        Academics
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setGeminiFeaturesOpen(false)}
                    className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Hard Skill / Soft Skill Toggle Tabs (Only when in Skill Mode) */}
                {isSkillMode && (
                  <div className="flex items-center gap-2 mb-3 bg-[#f4f3ee] p-1 rounded-xl">
                    <button
                      onClick={() => setSkillType('hard')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        skillType === 'hard' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      Hard Skill
                    </button>
                    <button
                      onClick={() => setSkillType('soft')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        skillType === 'soft' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      Soft Skill
                    </button>
                  </div>
                )}

                {/* Top Quick Circular Icons in MentOS Monochromatic Style */}
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-3 border-b border-[#f0eee8] pt-1">
                  {(isSkillMode || isAcademicsMode ? [
                    { label: 'Files', icon: Paperclip },
                    { label: 'Drive', icon: HardDrive },
                    { label: 'Notebooks', icon: Book },
                    { label: 'Map', icon: MapPin },
                  ] : [
                    { label: 'Photos', icon: ImageIcon },
                    { label: 'Camera', icon: Camera },
                    { label: 'Files', icon: Paperclip },
                    { label: 'Drive', icon: HardDrive },
                    { label: 'Notebooks', icon: Book },
                    { label: 'Map', icon: MapPin },
                  ]).map((tool, idx) => {
                    const ToolIcon = tool.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          showToast(`Opened ${tool.label}`);
                          setGeminiFeaturesOpen(false);
                        }}
                        className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#f7f6f2] hover:bg-[#ebe9e3] border border-[#e5e3dc] flex items-center justify-center transition-all group-hover:scale-105 shadow-2xs">
                          <ToolIcon className="w-5 h-5 text-neutral-700 group-hover:text-neutral-950" />
                        </div>
                        <span className="text-[11px] font-medium text-[#44423e] group-hover:text-black">
                          {tool.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Feature Action List matching MentOS */}
                <div className="py-2 space-y-1 max-h-[300px] overflow-y-auto no-scrollbar">
                  {(isSkillMode
                    ? (skillType === 'hard'
                        ? [
                            {
                              title: 'Path Monitor',
                              subtitle: 'Dependency tracking & path monitoring',
                              icon: Compass,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Path Monitor: Analyze curriculum and prerequisite dependency graph', 'Path Monitor'); }
                            },
                            {
                              title: 'Code Assessment',
                              subtitle: 'Automated code review & unit tests',
                              icon: CheckSquare,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Run automated code assessment and unit tests', 'Code Assessment'); }
                            },
                            {
                              title: 'Data Analyzer',
                              subtitle: 'Performance metrics & data telemetry',
                              icon: Activity,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Analyze execution metrics and learner performance telemetry', 'Data Analyzer'); }
                            },
                            {
                              title: 'VS Code Analyzer',
                              subtitle: 'Editor cadence & keystroke telemetry',
                              icon: Code,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('VS Code Analyzer: Review keystroke cadence and diff replays', 'VS Code Analyzer'); }
                            },
                            {
                              title: 'Architecture Explainer',
                              subtitle: 'System design & component diagrams',
                              icon: Layout,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Architecture Explainer: Break down system architecture and modules', 'Architecture Explainer'); }
                            },
                            {
                              title: 'Personalized Language Learning',
                              subtitle: 'Tailored language proficiency modules',
                              icon: Book,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Start personalized language learning session', 'Language Learning'); }
                            },
                            {
                              title: 'Personalized Coding Language Learning',
                              subtitle: 'Targeted syntax and paradigm mastery',
                              icon: Code2,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Personalized coding language proficiency practice', 'Coding Language Learning'); }
                            },
                            {
                              title: 'Personalized Mentor Tracker',
                              subtitle: 'Mentor progress & milestone feedback',
                              icon: UserCheck,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Review mentor tracker notes and milestone feedback', 'Mentor Tracker'); }
                            },
                            {
                              title: 'Task Tracker',
                              subtitle: 'Ephemeral coding tasks & roadmap progress',
                              icon: List,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Open task tracker and roadmap progress', 'Task Tracker'); }
                            },
                            {
                              title: 'Create Image',
                              subtitle: 'Visualise hard skill concepts',
                              icon: ImageIcon,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Create hard skill visualization diagram', 'Create Image'); }
                            },
                            {
                              title: 'Deep Research',
                              subtitle: 'Technical documentation & papers',
                              icon: Compass,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Deep Research: Hard skill technical documentation review', 'Deep Research'); }
                            },
                            {
                              title: 'Guided Learning',
                              subtitle: 'Step-by-step coding & engineering tutoring',
                              icon: BookOpen,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Guided learning session for engineering problem solving', 'Guided Learning'); }
                            },
                          ]
                        : [
                            {
                              title: 'Interview Preparation',
                              subtitle: 'Mock technical & behavioral interview practice',
                              icon: MessageSquare,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Start mock technical and behavioral interview preparation session', 'Interview Prep'); }
                            },
                            {
                              title: 'Speaking Skill Section',
                              subtitle: 'Pitch, cadence & communication fluency coaching',
                              icon: Mic,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Speaking Skill Coaching: Pitch, tone, and professional communication', 'Speaking Skill'); }
                            },
                            {
                              title: 'Create Image',
                              subtitle: 'Visualise presentation concepts',
                              icon: ImageIcon,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Create presentation visual aid', 'Create Image'); }
                            },
                            {
                              title: 'Deep Research',
                              subtitle: 'Communication frameworks & leadership research',
                              icon: Compass,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Deep Research: Soft skill leadership frameworks', 'Deep Research'); }
                            },
                            {
                              title: 'Guided Learning',
                              subtitle: 'Executive coaching & interpersonal feedback',
                              icon: BookOpen,
                              action: () => { setGeminiFeaturesOpen(false); handleSendGemini('Guided learning session for executive presence and soft skills', 'Guided Learning'); }
                            },
                          ])
                    : isAcademicsMode
                    ? [
                        {
                          title: 'Academic Notes (Moodle)',
                          subtitle: 'Teacher data, notes & course materials',
                          icon: Book,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Access Moodle teacher notes and course study materials', 'Academic Notes');
                          }
                        },
                        {
                          title: 'Academic Progress Tracker',
                          subtitle: 'Syllabus tracking & grade milestones',
                          icon: Activity,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Open Academic Progress Tracker and syllabus completion status', 'Progress Tracker');
                          }
                        },
                        {
                          title: 'Create Image',
                          subtitle: 'Visualise academic concepts',
                          icon: ImageIcon,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Create academic concept visualization diagram', 'Create Image');
                          }
                        },
                        {
                          title: 'Deep Research',
                          subtitle: 'Course papers & academic literature',
                          icon: Compass,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Deep Research: Academic literature review and citations', 'Deep Research');
                          }
                        },
                        {
                          title: 'Guided Learning',
                          subtitle: 'Step-by-step tutoring & problem sets',
                          icon: BookOpen,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Guided learning session for upcoming exams and problem sets', 'Guided Learning');
                          }
                        },
                      ]
                    : [
                        {
                          title: 'Create images',
                          subtitle: 'Visualise and edit',
                          icon: ImageIcon,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Create architectural visualization for MentOS adaptive portal', 'Create images');
                          }
                        },
                        {
                          title: 'Create videos',
                          subtitle: 'Bring ideas to life',
                          icon: Video,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Create a demonstration video of Monaco editor telemetry logging', 'Create videos');
                          }
                        },
                        {
                          title: 'Canvas',
                          subtitle: 'Code, write or make slides',
                          icon: Layout,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Open Canvas architecture artifact', 'Canvas');
                            if (isMobile) setActiveTabMobile('artifact');
                          }
                        },
                        {
                          title: 'Deep Research',
                          subtitle: 'Get detailed reports',
                          icon: Compass,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Deep Research: Regional language technical learning retention in engineering colleges', 'Deep Research');
                          }
                        },
                        {
                          title: 'Guided Learning',
                          subtitle: 'Get step-by-step help',
                          icon: BookOpen,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Walk through the 9-step MentOS student workflow', 'Guided Learning');
                          }
                        },
                        {
                          title: 'Academic analysis',
                          subtitle: 'Analyze academic progress & course records across modules',
                          icon: Book,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Master Operator: Perform comprehensive academic progress analysis across all courses', 'Academic Analysis');
                          }
                        },
                        {
                          title: 'Skills analysis',
                          subtitle: 'Audit hard/soft skill mastery & mentor telemetry',
                          icon: Award,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Master Operator: Perform comprehensive skills and telemetry mastery audit', 'Skills Analysis');
                          }
                        },
                        {
                          title: 'Master Operator',
                          subtitle: 'Global system audit & cross-app feature access',
                          icon: Sparkles,
                          action: () => {
                            setGeminiFeaturesOpen(false);
                            handleSendGemini('Master Operator: Global system audit and full feature management across MentOS', 'Master Operator');
                          }
                        },
                      ]).map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={item.action}
                        className="w-full flex items-center gap-3.5 p-2 rounded-xl hover:bg-[#f7f6f2] transition-colors text-left cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#f2f0ea] flex items-center justify-center text-neutral-700 group-hover:text-black transition-colors shrink-0">
                          <ItemIcon className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-[13px] font-semibold text-[#1f1f1f]">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#6b7280]">
                            {item.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Dedicated Personalized Documents Folder / Saved Notes Section */}
                  {isAcademicsMode && (
                    <div className="pt-2.5 mt-2 border-t border-[#f0eee8] space-y-1.5">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Personalized Documents Folder</span>
                        </span>
                        <button
                          onClick={() => {
                            const newDoc = {
                              id: 'doc_' + Date.now(),
                              title: `Finalized Notes - ${new Date().toLocaleDateString()}`,
                              content: 'Key takeaways and summaries finalized during chat session.',
                              date: 'Just now'
                            };
                            setPersonalizedDocs([newDoc, ...personalizedDocs]);
                            showToast('Saved current notes to Personalized Documents folder');
                          }}
                          className="text-[11px] font-semibold text-neutral-700 hover:text-black bg-[#f4f3ee] hover:bg-[#eae8e1] px-2 py-0.5 rounded border border-[#dedcd5] cursor-pointer"
                        >
                          + Save Notes Here
                        </button>
                      </div>

                      <div className="space-y-1 max-h-[140px] overflow-y-auto px-1">
                        {personalizedDocs.map((doc) => (
                          <div
                            key={doc.id}
                            onClick={() => {
                              setGeminiFeaturesOpen(false);
                              handleSendGemini(`Review personalized document: ${doc.title} - ${doc.content}`, 'Personalized Document');
                            }}
                            className="p-2 rounded-lg bg-[#faf9f6] hover:bg-[#f2f0ea] border border-[#e5e4de] flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="text-xs font-semibold text-neutral-800 truncate">{doc.title}</div>
                              <div className="text-[10px] text-neutral-500 truncate">{doc.content}</div>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-400 shrink-0">{doc.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Personal Intelligence Labs Toggle */}
                  <div className="pt-2 border-t border-[#f0eee8] mt-1 px-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#1f1f1f]">Personal Intelligence</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#f4f3ee] text-neutral-700 border border-[#e5e3dc]">
                        Labs
                      </span>
                    </div>
                    <button
                      onClick={() => setPersonalIntelligenceEnabled(!personalIntelligenceEnabled)}
                      className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                        personalIntelligenceEnabled ? 'bg-neutral-900' : 'bg-neutral-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                          personalIntelligenceEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* MentOS Voice Assistant Overlay (Monochromatic Light Theme) */}
          {geminiLiveOpen && (
            <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#faf9f6] animate-in fade-in zoom-in-95 duration-200 p-6 sm:p-8">
              {/* Top Bar with Status and Close Button */}
              <div className="flex items-center justify-between w-full max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-neutral-700 font-mono tracking-wide">
                    {geminiLiveSpeaking ? 'MentOS Speaking...' : geminiLiveListening ? 'Listening to voice...' : 'MentOS Voice Assistant Active'}
                  </span>
                </div>
                <button
                  onClick={closeGeminiLive}
                  className="w-8 h-8 rounded-full bg-white border border-[#dedcd5] hover:bg-[#edebe5] flex items-center justify-center text-neutral-700 transition-colors shadow-2xs cursor-pointer"
                  title="Close Speaking Assistant (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Center Area: MentOS Text, Personalized Greeting & Fluid Monochrome Voice Orb */}
              <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
                {/* Personalized Greeting: "What's next, Hariom?" */}
                <div>
                  <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase font-mono mb-2 inline-block">
                    MentOS
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1f1f] tracking-tight">
                    What&apos;s next, Hariom?
                  </h1>
                  <p className="text-xs text-neutral-500 mt-2">
                    MentOS Voice Assistant connected • Ask questions, test concepts, or explore architecture
                  </p>
                </div>

                {/* Tap to Interrupt Status Pill */}
                <button
                  onClick={() => {
                    if (geminiLiveSpeaking) {
                      stopSpeaking();
                      showToast('Interrupted speech');
                    } else {
                      speakWithGemini("I'm listening, Hariom. Ask me anything about your code or architecture.");
                    }
                  }}
                  className="px-4 py-1.5 rounded-full bg-white border border-[#dedcd5] text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-[#f4f3ee] transition-colors cursor-pointer"
                >
                  {geminiLiveSpeaking ? 'Tap to interrupt' : 'Tap to speak with MentOS'}
                </button>

                {/* Animated Liquid Voice Pill in MentOS Theme */}
                <div
                  onClick={() => {
                    if (geminiLiveSpeaking) stopSpeaking();
                    else speakWithGemini("MentOS provides Docker-isolated code testing and Monaco editor telemetry analysis.");
                  }}
                  className="relative w-48 sm:w-56 h-20 rounded-full bg-neutral-950 p-1 shadow-lg hover:scale-102 transition-transform cursor-pointer flex items-center justify-center overflow-hidden border border-neutral-800"
                >
                  <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center gap-1.5 px-6">
                    <span className="w-1.5 h-6 bg-white rounded-full animate-bounce" />
                    <span className="w-1.5 h-10 bg-white rounded-full animate-pulse delay-75" />
                    <span className="w-1.5 h-12 bg-white rounded-full animate-bounce delay-150" />
                    <span className="w-1.5 h-8 bg-white rounded-full animate-pulse delay-100" />
                    <span className="w-1.5 h-11 bg-white rounded-full animate-bounce" />
                    <span className="w-1.5 h-7 bg-white rounded-full animate-pulse delay-75" />
                    <span className="w-1.5 h-5 bg-white rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>

              {/* Bottom Controls Bar (MentOS Monochromatic) */}
              <div className="w-full max-w-md mx-auto flex items-center justify-between pt-4 border-t border-[#dedcd5]">
                {/* Camera Toggle */}
                <button
                  onClick={() => {
                    setGeminiCameraOn(!geminiCameraOn);
                    showToast(geminiCameraOn ? 'Camera turned off' : 'Camera visual input active');
                  }}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                    geminiCameraOn
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-[#dedcd5] hover:bg-[#f5f4ef]'
                  }`}
                  title="Toggle camera input"
                >
                  {geminiCameraOn ? <Camera className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                {/* Upload / Share Screen */}
                <button
                  onClick={() => showToast('Share screen / file active')}
                  className="w-11 h-11 rounded-full bg-white text-neutral-700 border border-[#dedcd5] hover:bg-[#f5f4ef] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  title="Upload / Share Screen"
                >
                  <Upload className="w-5 h-5" />
                </button>

                {/* Center Audio Live Pill in MentOS Obsidian */}
                <div className="px-5 py-2.5 rounded-full bg-neutral-900 text-white flex items-center gap-1.5 shadow-sm border border-neutral-800">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse mr-0.5" />
                  <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                  <span className="w-1 h-4 bg-white rounded-full animate-bounce" />
                  <span className="w-1 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs font-semibold ml-1">Live</span>
                </div>

                {/* Mic Mute / Unmute */}
                <button
                  onClick={() => {
                    setGeminiLiveMuted(!geminiLiveMuted);
                    showToast(geminiLiveMuted ? 'Microphone unmuted' : 'Microphone muted');
                  }}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                    geminiLiveMuted
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-white text-neutral-700 border-[#dedcd5] hover:bg-[#f5f4ef]'
                  }`}
                  title="Mute microphone"
                >
                  {geminiLiveMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={closeGeminiLive}
                  className="w-11 h-11 rounded-full bg-white text-neutral-700 border border-[#dedcd5] hover:bg-[#f5f4ef] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  title="Exit Voice Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Draggable Divider Handle (Desktop/Tablet Only) */}
          {!isMobile && !artifactFullscreen && (
            <div
              onMouseDown={() => setIsDragging(true)}
              className="drag-divider w-2.5 -ml-1 h-full z-10 cursor-col-resize flex items-center justify-center group select-none hover:bg-neutral-200/50 transition-colors"
              title="Drag to resize split pane"
            >
              <div className="w-[3px] h-9 bg-[#d2d0c8] rounded-full group-hover:bg-[#8e8c85] transition-colors" />
            </div>
          )}

          {/* Right Artifact Panel */}
          <div
            style={{
              width: isMobile
                ? '100%'
                : artifactFullscreen
                ? '100%'
                : `${100 - splitRatio}%`,
              display: isMobile && activeTabMobile !== 'artifact' ? 'none' : 'flex',
            }}
            className="artifact-panel flex-col h-full bg-[#ffffff] overflow-hidden min-w-0"
          >
            {/* Artifact Top Header */}
            <div className="artifact-header h-11 sm:h-12 border-b border-[#ecebe7] px-3 sm:px-4 flex items-center justify-between shrink-0 bg-[#ffffff] gap-2">
              <div
                onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                className="flex items-center gap-1.5 cursor-pointer hover:bg-[#f6f5f2] px-1 sm:px-2 py-1 rounded-md transition-colors min-w-0 flex-1"
                title="Click to toggle artifact version history"
              >
                <h2 className="text-[12px] sm:text-[13px] font-semibold text-[#1e1d1a] truncate">
                  {selectedVersion ? selectedVersion.title : 'Clean Sheet (No Document)'}
                </h2>
                {selectedVersion && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold shrink-0">
                    {selectedVersion.id}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-[#73716c] shrink-0 transition-transform duration-150 ${showVersionDropdown ? 'rotate-180' : ''}`} />
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  title="Reload artifact"
                  className="p-1.5 rounded-md hover:bg-[#f0eee9] text-[#55534e] transition-colors cursor-pointer"
                  onClick={() => showToast('Artifact refreshed')}
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2]" />
                </button>

                <button
                  onClick={() => setShowExportModal(true)}
                  title="Export / Save Artifact (Ctrl+S)"
                  className="bg-[#141414] hover:bg-[#2b2b2b] text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3 stroke-[2.2]" />
                  <span className="hidden xs:inline">Export</span>
                  <span className="hidden sm:inline-block text-[9px] font-mono text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded border border-neutral-700">Ctrl+S</span>
                </button>

                {!isMobile && (
                  <button
                    onClick={() => setArtifactFullscreen(!artifactFullscreen)}
                    title={artifactFullscreen ? 'Restore split view' : 'Maximize artifact'}
                    className="p-1.5 rounded-md hover:bg-[#f0eee9] text-[#55534e] transition-colors cursor-pointer"
                  >
                    {artifactFullscreen ? (
                      <Minimize2 className="w-3.5 h-3.5 stroke-[2]" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5 stroke-[2]" />
                    )}
                  </button>
                )}

                <button
                  title="Close artifact"
                  onClick={() => {
                    if (isMobile) {
                      setActiveTabMobile('chat');
                    } else {
                      setSplitRatio(100);
                    }
                  }}
                  className="p-1.5 rounded-md hover:bg-[#f0eee9] text-[#55534e] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* Artifact Secondary Sub-Toolbar with Smooth Touch Scroll */}
            <div className="artifact-toolbar h-9 border-b border-[#ecebe7] px-3 sm:px-4 flex items-center justify-between text-xs text-[#52504b] shrink-0 bg-[#fdfcf9] overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 sm:gap-3 min-w-max">
                <div
                  onClick={() => showToast('Active tab: Tab 1')}
                  className="flex items-center gap-1 cursor-pointer font-medium hover:text-[#111]"
                >
                  <span>{activeTab}</span>
                  <ChevronDown className="w-3 h-3" />
                </div>

                <div className="h-3.5 w-[1px] bg-[#e1dfd8]" />

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setArtifactMode(artifactMode === 'preview' ? 'code' : 'preview')}
                    title="Edit Markdown / Source"
                    className={`p-1 rounded hover:bg-[#eae8e1] transition-colors cursor-pointer ${
                      artifactMode === 'code' ? 'bg-[#e5e3db] text-[#111]' : ''
                    }`}
                  >
                    <Pencil className="w-3.5 h-3.5 stroke-[1.8]" />
                  </button>

                  {!isMobile && (
                    <button
                      onClick={() => {
                        if (splitRatio === 48) setSplitRatio(32);
                        else setSplitRatio(48);
                      }}
                      title="Adjust Width"
                      className="p-1 rounded hover:bg-[#eae8e1] transition-colors cursor-pointer"
                    >
                      <MoveHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>
                  )}

                  <button
                    onClick={() => setArtifactMode('table')}
                    title="Table View"
                    className={`p-1 rounded hover:bg-[#eae8e1] transition-colors cursor-pointer ${
                      artifactMode === 'table' ? 'bg-[#e5e3db] text-[#111]' : ''
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5 stroke-[1.8]" />
                  </button>

                  <button
                    title="Checklist View"
                    onClick={() => showToast('Checklist view')}
                    className="p-1 rounded hover:bg-[#eae8e1] transition-colors cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5 stroke-[1.8]" />
                  </button>

                  <button
                    onClick={() => setArtifactMode('preview')}
                    title="Document View"
                    className={`p-1 rounded hover:bg-[#eae8e1] transition-colors cursor-pointer ${
                      artifactMode === 'preview' ? 'bg-[#e5e3db] text-[#111]' : ''
                    }`}
                  >
                    <List className="w-3.5 h-3.5 stroke-[1.8]" />
                  </button>

                  <button
                    onClick={handlePrintArtifact}
                    title="Print Clean Document (Ctrl+P)"
                    className="p-1 rounded hover:bg-[#eae8e1] transition-colors cursor-pointer text-[#52504b] hover:text-[#111]"
                  >
                    <Printer className="w-3.5 h-3.5 stroke-[1.8]" />
                  </button>

                  <div
                    onClick={() => showToast('Add new tab or block')}
                    className="flex items-center gap-0.5 cursor-pointer hover:bg-[#eae8e1] px-1 py-0.5 rounded transition-colors"
                  >
                    <Plus className="w-3 h-3 stroke-[2.2]" />
                    <ChevronDown className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Artifact Scrollable Content */}
            <div className="artifact-scroll-container flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 bg-[#ffffff]">
              {!selectedVersion ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#f4f3ee] flex items-center justify-center text-neutral-400">
                    <FileText className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-800">Clean Sheet — No Active Document</div>
                    <p className="text-[11px] text-neutral-500 max-w-[240px] mt-1 leading-relaxed">
                      Generated architecture specifications, code summaries, and technical reports will appear here when requested in chat.
                    </p>
                  </div>
                  <button
                    onClick={() => handleGenerateDocument('Technical Architecture Specification')}
                    className="mt-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Generate Document</span>
                  </button>
                </div>
              ) : artifactMode === 'code' ? (
                /* Source Code / Markdown view */
                <div className="font-mono text-xs text-[#292825] bg-[#f9f8f5] p-3 sm:p-4 rounded-xl border border-[#e5e3dc] leading-relaxed overflow-x-auto">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-[#e5e3dc]">
                    <span className="font-semibold text-neutral-500">Mentos_Architecture_{selectedVersion.id}.md</span>
                    <button
                      onClick={copyArtifactMarkdown}
                      className="flex items-center gap-1 text-[11px] bg-white border border-[#d8d6cf] px-2 py-0.5 rounded hover:bg-neutral-100 cursor-pointer"
                    >
                      {copiedExport ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedExport ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap">{generateMarkdownForVersion(selectedVersion)}</pre>
                </div>
              ) : (
                /* Document & Table Preview View */
                <div className="printable-document max-w-[760px] mx-auto space-y-5 sm:space-y-6">
                  {/* Clean Dedicated Print-Only Header */}
                  <div className="hidden print-header mb-6 pb-4 border-b-2 border-neutral-300">
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                      <span>MentOS Technical Document — {selectedVersion.label}</span>
                      <span>Version {selectedVersion.versionNumber} • {selectedVersion.timestamp}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                      {selectedVersion.title}
                    </h1>
                    <p className="text-xs text-neutral-600 mt-1">
                      {selectedVersion.summary}
                    </p>
                  </div>

                  {/* Responsive Table Container with Horizontal Scroll & Visual Border */}
                  <div className="border border-[#e7e6e0] rounded-lg overflow-x-auto shadow-2xs bg-white">
                    <table className="w-full text-left text-[12px] sm:text-[13px] border-collapse min-w-[340px] sm:min-w-[480px]">
                      <tbody>
                        {selectedVersion.tableRows.map((row, idx) => (
                          <tr
                            key={idx}
                            className={`${idx < selectedVersion.tableRows.length - 1 ? 'border-b border-[#e7e6e0]' : ''} hover:bg-[#faf9f6] transition-colors`}
                          >
                            <td className="py-2.5 px-3 sm:px-4 font-normal text-[#1e1d1a] w-[38%] sm:w-[35%] align-top border-r border-[#e7e6e0]">
                              {row.feature}
                            </td>
                            <td className="py-2.5 px-3 sm:px-4 text-[#2f2e2a] leading-relaxed align-top">
                              {row.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Horizontal Scroll Pill matching original screenshot */}
                  <div className="screen-only w-[180px] sm:w-[260px] h-[6px] sm:h-[7px] bg-[#d7d5ce] rounded-full my-4 sm:my-6 opacity-80" />

                  {/* Marathi Documentation Workflow */}
                  <div className="space-y-3.5 sm:space-y-4 pt-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#141412] tracking-tight">
                      {selectedVersion.heading}
                    </h2>

                    <p className="text-[13px] sm:text-[13.5px] text-[#3b3a36] leading-relaxed">
                      {selectedVersion.subtext}
                    </p>

                    <ol className="space-y-3 text-[13px] sm:text-[13.5px] text-[#2c2b28] leading-relaxed pl-1">
                      {selectedVersion.steps.map((step) => (
                        <li key={step.stepNumber} className="flex items-start gap-1.5">
                          <span className="font-semibold text-[#1a1916] shrink-0">{step.stepNumber}.</span>
                          <p>
                            <strong className="font-semibold text-[#1a1916]">{step.title}</strong>{' '}
                            {step.description}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Memory Details Modal */}
      {showMemoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e2e0d8] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-[#eee] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-[#1f1e1b]">Updated Memory</h3>
              </div>
              <button
                onClick={() => setShowMemoryModal(false)}
                title="Close (Esc)"
                className="text-neutral-400 hover:text-neutral-700 p-1 flex items-center gap-1 cursor-pointer"
              >
                <kbd className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200">Esc</kbd>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-5 text-xs text-[#333] space-y-3">
              <p className="text-neutral-600">
                MentOS updated its project memory based on your MentOS adaptive learning prompt:
              </p>
              <div className="bg-[#f8f7f4] border border-[#e8e6df] rounded-xl p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-1 shrink-0" />
                  <p>
                    <span className="font-semibold text-[#111]">MentOS Core Architecture:</span> Focuses on
                    adaptive concept hierarchy, Dockerized code evaluation, and Monaco editor telemetry.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-1 shrink-0" />
                  <p>
                    <span className="font-semibold text-[#111]">Explain-Your-Code:</span> Generates 2-3 tailored
                    probing questions from student submissions to guarantee authentic comprehension.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-1 shrink-0" />
                  <p>
                    <span className="font-semibold text-[#111]">Language Context:</span> Marathi documentation
                    and workflow representation for regional technical education portals.
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowMemoryModal(false)}
                  className="bg-[#1f1e1b] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pro Plan Modal */}
      {showProPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e2e0d8] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#eee] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1a1916]">MentOS Pro</h3>
                <p className="text-xs text-neutral-500">Supercharge your developer workspace with MentOS</p>
              </div>
              <button
                onClick={() => setShowProPlanModal(false)}
                title="Close (Esc)"
                className="text-neutral-400 hover:text-neutral-700 p-1 flex items-center gap-1 cursor-pointer"
              >
                <kbd className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200">Esc</kbd>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-[#f6f5f0] border border-[#e5e3db] rounded-xl p-3.5 sm:p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-neutral-500">Current Plan</div>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5">Free Tier</div>
                  <div className="text-xs text-neutral-600 mt-1">Unlimited basic workspace access</div>
                </div>
                <span className="text-xs font-semibold bg-white border border-[#dedcd5] px-2.5 py-1 rounded-full text-neutral-700">
                  Active
                </span>
              </div>

              <div className="border border-neutral-900 rounded-xl p-4 relative bg-neutral-950 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-neutral-300">RECOMMENDED</span>
                    <h4 className="text-lg font-bold mt-1">MentOS Pro</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Extended compute and real-time telemetry</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold">$20</span>
                    <span className="text-xs text-neutral-400"> / month</span>
                  </div>
                </div>

                <ul className="space-y-2 mt-4 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Access to Docker-isolated testing & Monaco replay audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Instant automated Viva question generation from solution AST</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Artifact creation, interactive previews, and code generation</span>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    showToast('Pro plan upgraded!');
                    setShowProPlanModal(false);
                  }}
                  className="w-full mt-5 bg-white text-neutral-900 hover:bg-neutral-100 font-bold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Upgrade to MentOS Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-[#e2e0d8] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-[#eee] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1f1e1b]">Export Artifact</h3>
                <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                  Ctrl+S to Quick Save
                </span>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                title="Close (Esc)"
                className="text-neutral-400 hover:text-neutral-700 p-1 flex items-center gap-1 cursor-pointer"
              >
                <kbd className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200">Esc</kbd>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={copyArtifactMarkdown}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f6f5f1] transition-colors border border-transparent hover:border-[#e3e1d8] text-left text-xs cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Copy className="w-4 h-4 text-neutral-600" />
                  <div>
                    <div className="font-semibold text-neutral-900">Copy to Clipboard</div>
                    <div className="text-[11px] text-neutral-500">Copy markdown text directly</div>
                  </div>
                </div>
                {copiedExport && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => {
                  saveArtifactFile();
                  setShowExportModal(false);
                }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#f6f5f1] transition-colors border border-transparent hover:border-[#e3e1d8] text-left text-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-neutral-600" />
                <div>
                  <div className="font-semibold text-neutral-900">Download .MD file</div>
                  <div className="text-[11px] text-neutral-500">
                    {selectedVersion ? `Save ${selectedVersion.id} as formatted Markdown` : 'Save document as Markdown'}
                  </div>
                </div>
              </button>

              <button
                onClick={handlePrintArtifact}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f6f5f1] transition-colors border border-transparent hover:border-[#e3e1d8] text-left text-xs cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-neutral-600" />
                  <div>
                    <div className="font-semibold text-neutral-900">Print or Save as PDF</div>
                    <div className="text-[11px] text-neutral-500">Dedicated clean document print layout</div>
                  </div>
                </div>
                <kbd className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200">
                  Ctrl+P
                </kbd>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Activity History Confirmation Modal */}
      {showClearHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-[#dedcd5] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-[#f0eee8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-[#1f1e1b]">Clear Activity History</h3>
              </div>
              <button
                onClick={() => setShowClearHistoryModal(false)}
                title="Close (Esc)"
                className="text-neutral-400 hover:text-neutral-700 p-1 flex items-center gap-1 cursor-pointer"
              >
                <kbd className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200">Esc</kbd>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-xs text-neutral-600 space-y-3">
              <p>
                Are you sure you want to clear your entire activity history? This will permanently delete{' '}
                <span className="font-semibold text-neutral-900">{activities.length} recorded {activities.length === 1 ? 'activity' : 'activities'}</span>{' '}
                from your local workspace and persistent IndexedDB storage.
              </p>
              <div className="bg-[#faf9f6] border border-[#e8e6df] rounded-xl p-3 text-[11px] text-neutral-500">
                This action is immediate and cannot be undone. Fresh activities will continue to be recorded as you use MentOS.
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowClearHistoryModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#dedcd5] text-neutral-700 hover:bg-[#f6f5f0] font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClearHistory}
                  className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Clear All History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
