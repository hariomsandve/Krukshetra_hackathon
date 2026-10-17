import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  Award,
  ChevronRight,
  FileText,
  FileCode,
  Share2,
  Check,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export interface StageResource {
  title: string;
  url: string;
  type: string;
}

export interface RoadmapStage {
  id: string;
  order: number;
  title: string;
  description: string;
  estimated_hours: number;
  prerequisites: string[];
  skills: string[];
  resources: StageResource[];
}

export interface RoadmapItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  estimated_duration: string;
  stage_count: number;
  skills: string[];
  stages?: RoadmapStage[];
}

interface RoadmapExplorerProps {
  onAskMentos?: (prompt: string) => void;
  onOpenCodingWorkspace?: (conceptName?: string) => void;
}

const CATEGORIES = [
  'All',
  'Web & App Development',
  'Backend & Cloud',
  'Computer Science Core',
  'AI & Data Science',
  'Web3 & Security'
];

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const RoadmapExplorer: React.FC<RoadmapExplorerProps> = ({
  onAskMentos,
  onOpenCodingWorkspace
}) => {
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  // Persistent progress tracking
  const [completedStages, setCompletedStages] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('mentos_roadmap_completed_stages');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all roadmaps
  useEffect(() => {
    const fetchRoadmaps = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/roadmaps');
        if (res.ok) {
          const json = await res.json();
          const list = json.data || json;
          setRoadmaps(Array.isArray(list) ? list : []);
          if (list.length > 0 && !selectedRoadmap) {
            // Default select the first one
            loadRoadmapDetails(list[0].id || list[0].slug);
          }
        }
      } catch (err) {
        console.error('Failed to fetch roadmaps:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  // Fetch full details of a single roadmap (with all stages & resources)
  const loadRoadmapDetails = async (idOrSlug: string) => {
    try {
      const res = await fetch(`/api/v1/roadmaps/${idOrSlug}`);
      if (res.ok) {
        const full = await res.json();
        setSelectedRoadmap(full);
        if (full.stages && full.stages.length > 0) {
          setActiveStageId(full.stages[0].id);
        }
      }
    } catch (err) {
      console.error('Failed loading roadmap detail:', err);
    }
  };

  const handleToggleStageCompletion = (roadmapId: string, stageId: string) => {
    setCompletedStages((prev) => {
      const currentList = prev[roadmapId] || [];
      const updatedList = currentList.includes(stageId)
        ? currentList.filter((id) => id !== stageId)
        : [...currentList, stageId];

      const next = { ...prev, [roadmapId]: updatedList };
      try {
        localStorage.setItem('mentos_roadmap_completed_stages', JSON.stringify(next));
      } catch {}

      // Background sync with backend if token available
      fetch(`/api/v1/roadmaps/${roadmapId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage_id: stageId,
          completed: !currentList.includes(stageId)
        })
      }).catch(() => {});

      return next;
    });
  };

  const handleDownload = async (format: 'markdown' | 'json' | 'pdf') => {
    if (!selectedRoadmap) return;
    setDownloadingFormat(format);

    try {
      if (format === 'pdf') {
        window.print();
        showToast('Generated printable PDF document');
        setDownloadingFormat(null);
        return;
      }

      const res = await fetch(`/api/v1/roadmaps/${selectedRoadmap.id}/export/${format}`);
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedRoadmap.slug}-roadmap.${format === 'markdown' ? 'md' : 'json'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast(`Downloaded ${selectedRoadmap.title} as ${format.toUpperCase()}`);
    } catch (err) {
      showToast(`Export failed: ${String(err)}`);
    } finally {
      setDownloadingFormat(null);
    }
  };

  // Filter roadmaps
  const filteredRoadmaps = roadmaps.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.skills && r.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      selectedCategory === 'All' || r.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDifficulty =
      selectedDifficulty === 'All' || r.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const currentCompleted = selectedRoadmap ? completedStages[selectedRoadmap.id] || [] : [];
  const progressPercent =
    selectedRoadmap && selectedRoadmap.stages && selectedRoadmap.stages.length > 0
      ? Math.round((currentCompleted.length / selectedRoadmap.stages.length) * 100)
      : 0;

  const activeStage = selectedRoadmap?.stages?.find((s) => s.id === activeStageId);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#faf9f5] overflow-hidden text-neutral-900 select-none">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 px-4 py-2 bg-neutral-900 text-white text-xs rounded-xl shadow-xl flex items-center gap-2 border border-neutral-700 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-[#ecebe7] flex flex-wrap items-center justify-between gap-3 bg-[#faf9f5] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
              MentOS Domain Learning Roadmaps
            </h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              18 Curated Tracks
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Structured step-by-step career tracks with milestones, resources, and one-click PDF/MD/JSON exports.
          </p>
        </div>

        {/* Export and Action buttons */}
        {selectedRoadmap && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload('markdown')}
              disabled={downloadingFormat !== null}
              className="px-2.5 py-1.5 rounded-lg border border-[#dedcd5] hover:bg-[#edebe5] text-xs font-medium text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-600" />
              <span>Markdown</span>
            </button>
            <button
              onClick={() => handleDownload('json')}
              disabled={downloadingFormat !== null}
              className="px-2.5 py-1.5 rounded-lg border border-[#dedcd5] hover:bg-[#edebe5] text-xs font-medium text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-neutral-600" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloadingFormat !== null}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Two-Column Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Catalogue Panel */}
        <div className="w-[320px] sm:w-[360px] border-r border-[#ecebe7] flex flex-col shrink-0 bg-[#faf9f5]">
          {/* Search & Category Filter */}
          <div className="p-3 border-b border-[#ecebe7] space-y-2">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search domains or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs text-neutral-900 placeholder-neutral-400 pl-8 pr-3 py-1.5 rounded-lg border border-[#dedcd5] focus:border-neutral-900 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'bg-[#edebe5] text-neutral-600 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Roadmaps List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
            {loading ? (
              <div className="py-12 text-center text-xs text-neutral-400">Loading roadmaps...</div>
            ) : filteredRoadmaps.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500">No matching domains found.</div>
            ) : (
              filteredRoadmaps.map((item) => {
                const isSelected = selectedRoadmap?.id === item.id;
                const completedCount = (completedStages[item.id] || []).length;
                const pct =
                  item.stage_count > 0 ? Math.round((completedCount / item.stage_count) * 100) : 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => loadRoadmapDetails(item.id || item.slug)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-neutral-900 shadow-xs'
                        : 'bg-[#f7f6f1] hover:bg-white border-[#e5e3dc] hover:border-[#dedcd5]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-xs text-neutral-900">{item.title}</div>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full shrink-0 font-semibold uppercase ${
                          item.difficulty === 'beginner'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.difficulty === 'intermediate'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2 font-mono">
                      <span>{item.estimated_duration}</span>
                      <span>•</span>
                      <span>{item.stage_count} stages</span>
                      {pct > 0 && (
                        <span className="text-emerald-700 font-semibold">• {pct}% done</span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#ecebe7] h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        {selectedRoadmap ? (
          <div className="flex-1 flex flex-col overflow-y-auto bg-white p-6 no-scrollbar">
            {/* Roadmap Header Card */}
            <div className="p-5 rounded-2xl bg-[#faf9f5] border border-[#ecebe7] space-y-3 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                      {selectedRoadmap.title}
                    </h2>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 font-bold">
                      {selectedRoadmap.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed mt-1.5 max-w-2xl">
                    {selectedRoadmap.description}
                  </p>
                </div>

                {/* Progress Metric Ring/Card */}
                <div className="p-3 bg-white rounded-xl border border-[#dedcd5] text-center min-w-[120px] shadow-2xs">
                  <div className="text-lg font-bold text-neutral-900">{progressPercent}%</div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    {currentCompleted.length} / {selectedRoadmap.stages?.length || 0} Stages
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-neutral-500 font-semibold mr-1">Key Competencies:</span>
                {selectedRoadmap.skills?.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#edebe5] text-neutral-700 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Stage Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Chronological Progression Stages
                </h3>
                <span className="text-xs text-neutral-400">Click a stage to inspect details & resources</span>
              </div>

              <div className="space-y-3">
                {selectedRoadmap.stages?.map((st, idx) => {
                  const isDone = currentCompleted.includes(st.id);
                  const isActive = activeStageId === st.id;

                  return (
                    <div
                      key={st.id}
                      className={`rounded-xl border transition-all ${
                        isActive
                          ? 'border-neutral-900 bg-[#faf9f5] shadow-xs'
                          : 'border-[#ecebe7] hover:border-[#dedcd5] bg-white'
                      }`}
                    >
                      <div
                        onClick={() => setActiveStageId(st.id)}
                        className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Completion Checkbox */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStageCompletion(selectedRoadmap.id, st.id);
                            }}
                            className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-neutral-300" />
                            )}
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono font-bold text-neutral-400">
                                Stage {st.order}
                              </span>
                              <span className={`text-sm font-bold ${isDone ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
                                {st.title}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                              {st.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-neutral-500">
                            ~{st.estimated_hours}h
                          </span>
                          <ChevronRight
                            className={`w-4 h-4 text-neutral-400 transition-transform ${
                              isActive ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* Expanded Stage Drawer */}
                      {isActive && (
                        <div className="px-4 pb-4 pt-2 border-t border-[#ecebe7] space-y-3 bg-white rounded-b-xl">
                          <p className="text-xs text-neutral-700 leading-relaxed">
                            {st.description}
                          </p>

                          {/* Prerequisites */}
                          {st.prerequisites && st.prerequisites.length > 0 && (
                            <div>
                              <span className="text-[11px] font-semibold text-neutral-500">Prerequisites:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {st.prerequisites.map((p, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700"
                                  >
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Resources Links */}
                          {st.resources && st.resources.length > 0 && (
                            <div>
                              <span className="text-[11px] font-semibold text-neutral-500">Curated Learning Resources:</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                                {st.resources.map((res, rIdx) => (
                                  <a
                                    key={rIdx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 rounded-lg border border-[#ecebe7] hover:border-neutral-900 hover:bg-[#faf9f5] flex items-center justify-between text-xs text-neutral-800 transition-colors group"
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <BookOpen className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
                                      <span className="truncate font-medium">{res.title}</span>
                                    </div>
                                    <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-black shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons for MentOS Companion */}
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            {onAskMentos && (
                              <button
                                onClick={() =>
                                  onAskMentos(
                                    `MentOS Mentor: Guide me through Stage ${st.order} of the ${selectedRoadmap.title} roadmap: "${st.title}". What are the core mental models and edge cases I should master?`
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>Ask MentOS for Guidance</span>
                              </button>
                            )}

                            {onOpenCodingWorkspace && (
                              <button
                                onClick={() => onOpenCodingWorkspace(st.title)}
                                className="px-3 py-1.5 rounded-lg border border-[#dedcd5] hover:bg-[#edebe5] text-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span>Practice in Coding Sandbox</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-neutral-400">
            Select a domain roadmap to view its curriculum.
          </div>
        )}
      </div>
    </div>
  );
};
