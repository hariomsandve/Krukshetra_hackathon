import React, { useState } from 'react';
import {
  HardDrive,
  Search,
  X,
  FileText,
  Code,
  FileCode,
  FileSpreadsheet,
  Upload,
  Check,
  ExternalLink,
  Clock
} from 'lucide-react';
import { ChatAttachment } from '../../services/historyService';

interface DriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (attachment: ChatAttachment) => void;
}

interface DriveItem {
  id: string;
  name: string;
  type: string;
  size: string;
  sizeBytes: number;
  modified: string;
  courseTag: string;
  snippet?: string;
}

const DEFAULT_DRIVE_FILES: DriveItem[] = [
  {
    id: 'drv_1',
    name: 'DSA_Binary_Search_Trees_Lecture_Notes.pdf',
    type: 'application/pdf',
    size: '1.4 MB',
    sizeBytes: 1468006,
    modified: 'Today, 10:30 AM',
    courseTag: 'Data Structures',
    snippet: 'Complete algorithmic lecture notes on AVL trees, red-black rebalancing, and telemetry traces.'
  },
  {
    id: 'drv_2',
    name: 'Operating_Systems_Process_Scheduling.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: '840 KB',
    sizeBytes: 860160,
    modified: 'Yesterday',
    courseTag: 'Operating Systems',
    snippet: 'Round robin, multi-level feedback queue, and context switching latency benchmarks.'
  },
  {
    id: 'drv_3',
    name: 'Machine_Learning_Gradient_Descent.py',
    type: 'text/x-python',
    size: '12 KB',
    sizeBytes: 12288,
    modified: 'Oct 15, 2026',
    courseTag: 'Machine Learning',
    snippet: 'NumPy vectorized mini-batch gradient descent with momentum and Adam optimizer.'
  },
  {
    id: 'drv_4',
    name: 'MentOS_Hackathon_System_Architecture.pdf',
    type: 'application/pdf',
    size: '2.1 MB',
    sizeBytes: 2202009,
    modified: 'Oct 14, 2026',
    courseTag: 'Software Architecture',
    snippet: 'Complete technical breakdown of Monaco telemetry logging, WebSocket streaming, and Docker sandboxing.'
  },
  {
    id: 'drv_5',
    name: 'Database_Normalization_Schema.sql',
    type: 'application/sql',
    size: '34 KB',
    sizeBytes: 34816,
    modified: 'Oct 12, 2026',
    courseTag: 'DBMS',
    snippet: 'PostgreSQL relational schemas in 3NF and BCNF with composite indexes.'
  },
  {
    id: 'drv_6',
    name: 'Curriculum_Progress_Analytics.csv',
    type: 'text/csv',
    size: '18 KB',
    sizeBytes: 18432,
    modified: 'Oct 10, 2026',
    courseTag: 'Telemetry',
    snippet: 'Student attendance, keystroke cadence, and assignment test score telemetry.'
  }
];

export function DriveModal({ isOpen, onClose, onSelectFile }: DriveModalProps) {
  const [driveFiles, setDriveFiles] = useState<DriveItem[]>(DEFAULT_DRIVE_FILES);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = driveFiles.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.courseTag.toLowerCase().includes(search.toLowerCase())
  );

  const getFileIcon = (name: string) => {
    if (name.endsWith('.pdf')) return <FileText className="w-4 h-4 text-rose-600" />;
    if (name.endsWith('.py') || name.endsWith('.js') || name.endsWith('.sql'))
      return <FileCode className="w-4 h-4 text-blue-600" />;
    if (name.endsWith('.csv')) return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    return <FileText className="w-4 h-4 text-amber-600" />;
  };

  const handleAttachSelected = () => {
    const item = driveFiles.find((f) => f.id === selectedId);
    if (!item) return;

    const attachment: ChatAttachment = {
      id: 'drive_' + Date.now(),
      name: item.name,
      type: item.type,
      size: item.sizeBytes,
      content: item.snippet
    };

    onSelectFile(attachment);
    onClose();
  };

  const handleSimulateDriveUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newItem: DriveItem = {
      id: 'drv_' + Date.now(),
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: `${(file.size / 1024).toFixed(1)} KB`,
      sizeBytes: file.size,
      modified: 'Just now',
      courseTag: 'My Uploads',
      snippet: `Uploaded file ${file.name} ready for MentOS evaluation.`
    };

    setDriveFiles([newItem, ...driveFiles]);
    setSelectedId(newItem.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#dedcd5] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#ecebe7] bg-[#faf9f5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-2xs">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1f1f1f]">Google Drive & Cloud Storage</div>
              <div className="text-[11px] text-[#71717a]">Browse syllabus, assignments & lecture notes</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-200/60 text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-3 border-b border-[#f0eee8] flex items-center gap-2 bg-[#fcfbf9]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Drive by file name or course..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#dedcd5] bg-white text-xs text-[#1f1f1f] focus:outline-none focus:ring-1 focus:ring-neutral-400 placeholder-[#888681]"
            />
          </div>

          <label className="px-3 py-1.5 rounded-lg border border-[#dedcd5] bg-white hover:bg-[#f7f6f2] text-xs font-semibold text-neutral-700 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
            <input type="file" className="hidden" onChange={handleSimulateDriveUpload} />
          </label>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar max-h-[360px]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-400">
              No cloud documents matched "{search}"
            </div>
          ) : (
            filtered.map((file) => {
              const isSelected = selectedId === file.id;
              return (
                <div
                  key={file.id}
                  onClick={() => setSelectedId(file.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#f4f3ee] border-[#dedcd5] shadow-2xs ring-1 ring-neutral-400/40'
                      : 'bg-white hover:bg-[#faf9f6] border-[#ecebe7]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#f7f6f2] border border-[#e5e3dc] flex items-center justify-center shrink-0">
                      {getFileIcon(file.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#1f1f1f] truncate">{file.name}</div>
                      <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium text-neutral-600">{file.courseTag}</span>
                        <span>•</span>
                        <span>{file.size}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-neutral-400">
                          <Clock className="w-2.5 h-2.5" />
                          {file.modified}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#faf9f5] border-t border-[#ecebe7] flex items-center justify-between">
          <div className="text-[11px] text-neutral-500">
            {selectedId ? (
              <span>Selected 1 cloud file to import</span>
            ) : (
              <span>Select a file to attach to MentOS prompt</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#dedcd5] bg-white hover:bg-[#f2f0ea] text-xs font-medium text-neutral-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAttachSelected}
              disabled={!selectedId}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                selectedId
                  ? 'bg-neutral-900 hover:bg-black text-white active:scale-95'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Attach to Prompt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
