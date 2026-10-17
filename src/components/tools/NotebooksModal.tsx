import React, { useState } from 'react';
import {
  Book,
  Plus,
  X,
  FileText,
  Pencil,
  Trash2,
  Check,
  Send,
  Sparkles,
  Copy
} from 'lucide-react';

interface NotebooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertNote: (noteText: string) => void;
}

interface NoteItem {
  id: string;
  title: string;
  tag: string;
  updated: string;
  content: string;
}

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note_1',
    title: 'B-Tree & Indexing Algorithms',
    tag: 'DBMS / DSA',
    updated: 'Today',
    content: `# B-Tree & Indexing Algorithms
- **Order m**: Every internal node has at least ⌈m/2⌉ children.
- **Search Complexity**: O(log n) disk I/O operations.
- **Self-Balancing**: Splits propagate upward upon node overflow.
- **Use Case**: Relational database storage engines (PostgreSQL Heap & GiST).`
  },
  {
    id: 'note_2',
    title: 'Process Synchronization & Semaphores',
    tag: 'Operating Systems',
    updated: 'Yesterday',
    content: `# Process Synchronization & Semaphores
- **Counting vs Binary Semaphore**:
  - Binary Semaphore (Mutex): Values 0 or 1.
  - Counting Semaphore: Manages pool of finite shared resources.
- **Peterson's Algorithm**: Two-process mutual exclusion with flag and turn variables.
- **Dining Philosophers**: Avoid deadlocks via resource hierarchy or asymmetric fork requests.`
  },
  {
    id: 'note_3',
    title: 'MentOS Live Viva Questions & Code Defense',
    tag: 'Oral Evaluation',
    updated: 'Oct 14',
    content: `# MentOS Live Viva Defense Checklist
1. Explain how Monaco Editor telemetry logs typing cadence without leaking code.
2. What are the isolation guarantees of running student code in Docker sub-containers?
3. How does the bidirectional WebSocket stream 16kHz PCM audio to Gemini Live?
4. How do prerequisite directed acyclic graphs (DAG) prevent curriculum deadlocks?`
  }
];

export function NotebooksModal({ isOpen, onClose, onInsertNote }: NotebooksModalProps) {
  const [notes, setNotes] = useState<NoteItem[]>(DEFAULT_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string>(DEFAULT_NOTES[0].id);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTag, setEditTag] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleStartCreate = () => {
    setIsCreating(true);
    setIsEditing(true);
    setEditTitle('');
    setEditTag('Computer Science');
    setEditContent('');
  };

  const handleStartEdit = () => {
    if (!activeNote) return;
    setIsCreating(false);
    setIsEditing(true);
    setEditTitle(activeNote.title);
    setEditTag(activeNote.tag);
    setEditContent(activeNote.content);
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;

    if (isCreating) {
      const newNote: NoteItem = {
        id: 'note_' + Date.now(),
        title: editTitle.trim(),
        tag: editTag.trim() || 'General',
        updated: 'Just now',
        content: editContent.trim()
      };
      setNotes([newNote, ...notes]);
      setActiveNoteId(newNote.id);
    } else {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNoteId
            ? {
                ...n,
                title: editTitle.trim(),
                tag: editTag.trim(),
                content: editContent.trim(),
                updated: 'Just now'
              }
            : n
        )
      );
    }
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    const remaining = notes.filter((n) => n.id !== id);
    if (remaining.length > 0) {
      setNotes(remaining);
      setActiveNoteId(remaining[0].id);
    }
  };

  const handleInsert = () => {
    if (!activeNote) return;
    onInsertNote(`Review notebook "${activeNote.title}":\n\n${activeNote.content}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#dedcd5] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px] max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#ecebe7] bg-[#faf9f5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-2xs">
              <Book className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1f1f1f]">Study Notebooks</div>
              <div className="text-[11px] text-[#71717a]">Manage revision notes & lecture summaries</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartCreate}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#dedcd5] hover:bg-[#f2f0ea] text-xs font-semibold text-neutral-800 flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Note</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-neutral-200/60 text-neutral-500 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content: Left Sidebar + Right Reader/Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* Notes List Column */}
          <div className="w-56 sm:w-64 border-r border-[#ecebe7] bg-[#fbfaf8] flex flex-col overflow-y-auto no-scrollbar p-2 space-y-1">
            {notes.map((note) => {
              const isActive = note.id === activeNoteId && !isCreating;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setActiveNoteId(note.id);
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#dedcd5] shadow-2xs font-semibold text-neutral-950 ring-1 ring-neutral-400/30'
                      : 'bg-transparent hover:bg-white/70 border-transparent text-neutral-700'
                  }`}
                >
                  <div className="text-xs font-semibold truncate text-[#1f1f1f]">{note.title}</div>
                  <div className="text-[10px] text-neutral-400 flex items-center justify-between mt-1">
                    <span className="truncate">{note.tag}</span>
                    <span>{note.updated}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Editor / Reader Column */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {isEditing ? (
              <div className="flex-1 p-4 flex flex-col space-y-3 overflow-y-auto">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="w-full text-sm font-bold text-neutral-900 border-b border-[#dedcd5] pb-2 focus:outline-none placeholder-[#a1a1aa]"
                />
                <input
                  type="text"
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  placeholder="Subject Tag (e.g. DBMS, Algorithms)..."
                  className="w-full text-xs text-neutral-600 border-b border-[#f0eee8] pb-1.5 focus:outline-none placeholder-[#a1a1aa]"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Write your study notes in Markdown..."
                  className="flex-1 w-full text-xs font-mono text-neutral-800 focus:outline-none resize-none leading-relaxed min-h-[220px]"
                />
              </div>
            ) : (
              <div className="flex-1 p-5 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0eee8]">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">{activeNote?.title}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f4f3ee] text-neutral-600 border border-[#dedcd5] mt-1 inline-block">
                      {activeNote?.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleStartEdit}
                      className="p-1.5 rounded-lg border border-[#dedcd5] hover:bg-[#faf9f5] text-neutral-600 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Note"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {notes.length > 1 && (
                      <button
                        onClick={() => handleDelete(activeNote.id)}
                        className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed font-sans bg-[#faf9f6] p-3.5 rounded-xl border border-[#ecebe7]">
                  {activeNote?.content}
                </div>
              </div>
            )}

            {/* Note Bottom Actions */}
            <div className="p-3 border-t border-[#ecebe7] bg-[#faf9f5] flex items-center justify-between">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setIsCreating(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#dedcd5] bg-white hover:bg-[#f2f0ea] text-xs font-medium text-neutral-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!editTitle.trim()}
                    className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="text-[11px] text-neutral-400">
                    Last modified {activeNote?.updated}
                  </div>
                  <button
                    onClick={handleInsert}
                    className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Insert into MentOS Prompt</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
