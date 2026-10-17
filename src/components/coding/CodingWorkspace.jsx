import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft,
  Play,
  CloudUpload,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Mic,
  Copy,
  Terminal,
  ChevronDown,
  Layers,
  Cpu,
  Check
} from 'lucide-react';
import { mockData } from '../../data/mockData';

export const CodingWorkspace = ({ onBack, onOpenVoiceTutor, onStartViva }) => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('assessment-two-sum');
  const [language, setLanguage] = useState('java');
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeBottomTab, setActiveBottomTab] = useState('results');
  const [selectedCase, setSelectedCase] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [testStatus, setTestStatus] = useState('passed');

  const assessments = [
    {
      id: 'assessment-two-sum',
      title: '1. Two Sum',
      difficulty: 'Easy',
      totalPoints: 100,
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
      hint: 'A HashMap can look up complements in O(1) average time. Traverse the array and store indices of elements seen so far.',
      starterCode: {
        java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) {
                return new int[]{seen.get(need), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
        python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            need = target - num
            if need in seen:
                return [seen[need], i]
            seen[num] = i
        return []`
      },
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]' },
        { input: 'nums = [3,2,4], target = 6', output: '[1, 2]' }
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        'Only one valid answer exists.'
      ],
      testCases: [
        { id: 1, label: 'Case 1: Standard [2,7,11,15]', time: '2ms', status: 'Passed', input: '[2,7,11,15], 9', expected: '[0,1]' },
        { id: 2, label: 'Case 2: Middle [3,2,4]', time: '3ms', status: 'Passed', input: '[3,2,4], 6', expected: '[1,2]' },
        { id: 3, label: 'Case 3: Duplicates [3,3]', time: '2ms', status: 'Passed', input: '[3,3], 6', expected: '[0,1]' }
      ]
    },
    {
      id: 'assessment-reverse-list',
      title: '206. Reverse Linked List',
      difficulty: 'Easy',
      totalPoints: 100,
      description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
      hint: 'Maintain three pointers: prev, curr, and next. In each step, invert the curr.next reference to point to prev.',
      starterCode: {
        java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`,
        python: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        return prev`
      },
      examples: [
        { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
        { input: 'head = [1,2]', output: '[2,1]' }
      ],
      constraints: [
        'The number of nodes in the list is in range [0, 5000].',
        '-5000 <= Node.val <= 5000',
        'Follow up: Can you do it iteratively and recursively?'
      ],
      testCases: [
        { id: 1, label: 'Case 1: [1,2,3,4,5]', time: '1ms', status: 'Passed', input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
        { id: 2, label: 'Case 2: Empty List []', time: '1ms', status: 'Passed', input: '[]', expected: '[]' }
      ]
    },
    {
      id: 'assessment-lru-cache',
      title: '146. LRU Cache (Doubly-Linked Sentinel)',
      difficulty: 'Medium',
      totalPoints: 100,
      description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement LRUCache with O(1) average time complexity for both get and put operations.',
      hint: 'A Doubly Linked List enables O(1) node extraction and insertion at head/tail. Combine with a hash map to achieve pointer lookup in strict constant time.',
      starterCode: {
        java: `import java.util.*;

class LRUCache {
    private static class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { this.key = k; this.val = v; }
    }

    private final int capacity;
    private final Map<Integer, Node> map;
    private final Node head, tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.head = new Node(-1, -1);
        this.tail = new Node(-1, -1);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        insertHead(node);
        return node.val;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            remove(map.get(key));
        }
        if (map.size() == capacity) {
            Node lru = tail.prev;
            remove(lru);
            map.remove(lru.key);
        }
        Node node = new Node(key, value);
        insertHead(node);
        map.put(key, node);
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insertHead(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }
}`,
        python: `class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.map = {}
        self.head = Node(-1, -1)
        self.tail = Node(-1, -1)
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: int) -> int:
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._insert_head(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.map:
            self._remove(self.map[key])
        elif len(self.map) >= self.capacity:
            lru = self.tail.prev
            self._remove(lru)
            del self.map[lru.key]
        node = Node(key, value)
        self._insert_head(node)
        self.map[key] = node

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert_head(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node`
      },
      examples: [
        { input: '["LRUCache", "put", "put", "get"] [[2], [1, 1], [2, 2], [1]]', output: '[null, null, null, 1]' }
      ],
      constraints: [
        '1 <= capacity <= 3000',
        '0 <= key <= 10^4',
        '0 <= value <= 10^5',
        'At most 2 * 10^5 calls will be made to get and put.'
      ],
      testCases: [
        { id: 1, label: 'Case 1: Standard sequence', time: '12ms', status: 'Passed', input: 'cap = 2, put(1,1), put(2,2)', expected: 'get(1) => 1' },
        { id: 2, label: 'Case 2: Eviction on overflow', time: '15ms', status: 'Passed', input: 'put(3,3) on full cap', expected: 'evict key 2' },
        { id: 3, label: 'Case 3: Single item cap = 1', time: '11ms', status: 'Passed', input: 'cap = 1', expected: 'evict previous immediately' }
      ]
    }
  ];

  const currentAssessment = assessments.find(a => a.id === selectedAssessmentId) || assessments[0];
  const [code, setCode] = useState(currentAssessment.starterCode[language] || currentAssessment.starterCode.java);

  const handleAssessmentChange = (id) => {
    setSelectedAssessmentId(id);
    const chosen = assessments.find(a => a.id === id) || assessments[0];
    setCode(chosen.starterCode[language] || chosen.starterCode.java);
    setSelectedCase(1);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(currentAssessment.starterCode[newLang] || currentAssessment.starterCode.java);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setActiveBottomTab('results');
    setTimeout(() => {
      setIsRunning(false);
      setTestStatus('passed');
    }, 1200);
  };

  const [editorTheme, setEditorTheme] = useState('vs');

  return (
    <div className="flex flex-col h-full w-full bg-[#faf9f5] overflow-hidden text-neutral-900 select-none">
      {/* 1. Header Toolbar */}
      <div className="h-[52px] px-4 flex items-center justify-between bg-white border-b border-[#ecebe7] shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-[#f0ede6] transition-colors cursor-pointer"
            title="Back to Roadmaps"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Assessment Selector */}
          <select
            value={selectedAssessmentId}
            onChange={(e) => handleAssessmentChange(e.target.value)}
            className="bg-white border border-[#dedcd5] text-neutral-900 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-2xs outline-none cursor-pointer focus:border-neutral-900"
          >
            {assessments.map(a => (
              <option key={a.id} value={a.id} className="bg-white text-neutral-900">
                {a.title} ({a.difficulty})
              </option>
            ))}
          </select>

          {/* Language Selector Dropdown */}
          <button
            onClick={() => handleLanguageChange(language === 'java' ? 'python' : 'java')}
            className="bg-white border border-[#dedcd5] hover:bg-[#edebe5] text-neutral-800 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            title="Toggle Language"
          >
            <span>&lt;&gt; {language === 'java' ? 'Java 17' : 'Python 3.11'}</span>
            <ChevronDown size={12} className="text-neutral-500" />
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Editor Theme Switcher */}
          <button
            onClick={() => setEditorTheme(editorTheme === 'vs' ? 'vs-dark' : 'vs')}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border border-[#dedcd5] hover:bg-[#edebe5] text-neutral-700 bg-white transition-colors cursor-pointer shadow-2xs"
            title="Toggle Code Editor Theme"
          >
            {editorTheme === 'vs' ? '☀️ Editor Light' : '🌙 Editor Dark'}
          </button>

          <button
            onClick={() => setCode(currentAssessment.starterCode[language] || currentAssessment.starterCode.java)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#dedcd5] hover:bg-[#edebe5] text-neutral-700 bg-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            title="Reset code to starter template"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-emerald-300 hover:bg-emerald-50 text-emerald-800 bg-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <Play size={12} className="fill-emerald-800" />
            <span>Run Tests</span>
            <span className="text-[10px] text-emerald-600 font-mono">⌘↵</span>
          </button>

          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <CloudUpload size={13} />
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Pane Split Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[minmax(360px,460px)_1fr] overflow-hidden">
        {/* Left Pane: Problem Spec */}
        <div className="bg-white border-r border-[#ecebe7] flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex px-5 border-b border-[#ecebe7] bg-white">
            <button
              onClick={() => setActiveLeftTab('description')}
              className={`py-2.5 px-1 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
                activeLeftTab === 'description'
                  ? 'border-neutral-900 text-neutral-900 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Description
            </button>
          </div>

          {/* Spec Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {currentAssessment.difficulty}
              </span>
              <span className="text-xs font-semibold text-neutral-500">
                {currentAssessment.totalPoints} Points
              </span>
            </div>

            {/* AI Realtime Guide Box */}
            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <Sparkles size={14} className="text-purple-700" />
                  <span>MentOS Adaptive Co-Pilot</span>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-purple-200">
                  PEDAGOGICAL HINT
                </span>
              </div>
              <p className="text-xs text-purple-950 leading-relaxed font-medium">
                {currentAssessment.hint}
              </p>
            </div>

            {/* Functional Spec */}
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900 mb-2 tracking-tight">
                Specification
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {currentAssessment.description}
              </p>
            </div>

            {/* Examples */}
            <div className="space-y-3 pt-1">
              {currentAssessment.examples.map((ex, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                    EXAMPLE {idx + 1}
                  </h4>
                  <div className="p-3.5 rounded-xl bg-[#faf9f5] border border-[#ecebe7] font-mono text-xs text-neutral-800 leading-relaxed space-y-2 shadow-2xs">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">INPUT</div>
                      <div className="font-semibold text-neutral-900">{ex.input}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">OUTPUT</div>
                      <div className="font-semibold text-emerald-700">{ex.output}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="pt-2">
              <h4 className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-2">
                Constraints
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-600 leading-relaxed font-mono">
                {currentAssessment.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor + Bottom Test Execution Panel */}
        <div className="flex flex-col h-full overflow-hidden bg-white">
          {/* Editor Header Tab */}
          <div className="h-[38px] px-4 flex items-center justify-between bg-[#faf9f5] border-b border-[#ecebe7] text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
              <strong className="text-neutral-900 font-bold">{language === 'java' ? 'Solution.java' : 'solution.py'}</strong>
              <span className="text-neutral-400 font-mono text-[11px]">• UTF-8</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-neutral-500 hover:text-neutral-900 cursor-pointer flex items-center gap-1 transition-colors"
                title="Copy Code"
              >
                <Copy size={12} />
                <span>Copy</span>
              </button>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>{language === 'java' ? 'JDK 17 Language Server' : 'Python 3.11'}</span>
              </span>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-[240px] overflow-hidden bg-white">
            <Editor
              height="100%"
              language={language}
              theme={editorTheme}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 12 },
                tabSize: 4
              }}
            />
          </div>

          {/* Bottom Test Results Panel */}
          <div className="h-[250px] bg-white border-t border-[#ecebe7] flex flex-col relative shrink-0">
            {/* Results Tabs & Metrics */}
            <div className="h-10 px-4 flex items-center justify-between border-b border-[#ecebe7] bg-[#faf9f5] shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveBottomTab('results')}
                  className={`py-2 text-xs font-semibold cursor-pointer border-b-2 flex items-center gap-2 transition-colors ${
                    activeBottomTab === 'results'
                      ? 'border-neutral-900 text-neutral-900 font-bold'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Test Results</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Passed {currentAssessment.testCases.length}/{currentAssessment.testCases.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('console')}
                  className={`py-2 text-xs font-semibold cursor-pointer border-b-2 flex items-center gap-2 transition-colors ${
                    activeBottomTab === 'console'
                      ? 'border-neutral-900 text-neutral-900 font-bold'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <Terminal size={13} />
                  <span>Console Output</span>
                </button>
              </div>

              {/* Performance Metrics */}
              <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                <span>Runtime: <strong className="text-emerald-700 font-bold">2ms</strong> (Faster than 94.2%)</span>
                <span>•</span>
                <span>Memory: <strong className="text-neutral-900 font-bold">42.1 MB</strong></span>
              </div>
            </div>

            {/* Test Cases Sub-body */}
            <div className="flex-1 p-3.5 px-4 flex gap-4 overflow-y-auto bg-white">
              {/* Cases List */}
              <div className="w-[200px] flex flex-col gap-1.5 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                  TEST CASES
                </span>

                {currentAssessment.testCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCase(c.id)}
                    className={`flex items-center justify-between p-2 px-3 rounded-xl border text-xs cursor-pointer transition-colors text-left ${
                      selectedCase === c.id
                        ? 'bg-purple-50 border-purple-200 text-purple-950 font-bold shadow-2xs'
                        : 'bg-[#faf9f5] border-[#ecebe7] text-neutral-700 hover:bg-[#edebe5]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{c.label}</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 shrink-0 ml-1">{c.time}</span>
                  </button>
                ))}
              </div>

              {/* Case Details */}
              <div className="flex-1 bg-[#faf9f5] rounded-xl p-3.5 border border-[#ecebe7] text-xs space-y-2.5">
                {(() => {
                  const activeTc = currentAssessment.testCases.find(tc => tc.id === selectedCase) || currentAssessment.testCases[0];
                  return (
                    <div>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                          PASSED
                        </span>
                        <span className="text-xs text-neutral-500">
                          Runtime: {activeTc.time} • Execution OK
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                        <div className="bg-white border border-[#ecebe7] rounded-lg p-2.5 shadow-2xs">
                          <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">INPUT</div>
                          <div className="text-neutral-900 font-semibold">{activeTc.input}</div>
                        </div>
                        <div className="bg-white border border-[#ecebe7] rounded-lg p-2.5 shadow-2xs">
                          <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">EXPECTED OUTPUT</div>
                          <div className="text-emerald-700 font-semibold">{activeTc.expected}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Floating Live Viva Prompt Box bottom right */}
            <div className="absolute bottom-3 right-4 bg-white/95 backdrop-blur-md border border-purple-200 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                <Sparkles size={14} className="text-purple-600" />
                <span>Ready for viva: MentOS verified logic</span>
              </div>

              <button
                onClick={() => {
                  if (onStartViva) onStartViva();
                  else if (onOpenVoiceTutor) onOpenVoiceTutor();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black text-white flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Mic size={12} />
                <span>Start AI Viva ›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingWorkspace;
