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
    setTimeout(() => {
      setIsRunning(false);
      setTestStatus('passed');
      setActiveBottomTab('results');
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'var(--bg-app)', overflow: 'hidden' }}>
      {/* 1. Header Toolbar */}
      <div
        style={{
          height: '54px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 15, 25, 0.95)',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem'
            }}
          >
            <ArrowLeft size={16} />
          </button>

          {/* Assessment Selector */}
          <select
            value={selectedAssessmentId}
            onChange={(e) => handleAssessmentChange(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 700,
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {assessments.map(a => (
              <option key={a.id} value={a.id} style={{ background: '#101827', color: '#fff' }}>
                {a.title} ({a.difficulty})
              </option>
            ))}
          </select>

          {/* Language Selector Dropdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: '#c4b5fd',
              cursor: 'pointer'
            }}
            onClick={() => handleLanguageChange(language === 'java' ? 'python' : 'java')}
          >
            <span>&lt; &gt; {language === 'java' ? 'Java 17' : 'Python 3.11'}</span>
            <ChevronDown size={12} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setCode(currentAssessment.starterCode[language] || currentAssessment.starterCode.java)}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '5px 10px', gap: '4px' }}
            title="Reset code to starter template"
          >
            <RotateCcw size={12} /> Reset
          </button>

          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '5px 12px', gap: '6px' }}
          >
            <Play size={12} fill="currentColor" /> Run Tests <span style={{ color: 'var(--text-muted)' }}>⌘↵</span>
          </button>

          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="btn btn-primary"
            style={{ fontSize: '0.75rem', padding: '5px 14px', gap: '6px' }}
          >
            <CloudUpload size={14} /> Submit Solution
          </button>
        </div>
      </div>

      {/* 2. Main Two-Pane Split Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(340px, 460px) 1fr', overflow: 'hidden' }}>
        {/* Left Pane: Problem Spec */}
        <div
          style={{
            background: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              padding: '0 16px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(0, 0, 0, 0.2)'
            }}
          >
            <button
              onClick={() => setActiveLeftTab('description')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeLeftTab === 'description' ? '2px solid #a855f7' : '2px solid transparent',
                padding: '10px 12px',
                color: activeLeftTab === 'description' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Description
            </button>
          </div>

          {/* Spec Content Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                {currentAssessment.difficulty}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {currentAssessment.totalPoints} Points
              </span>
            </div>

            {/* AI Realtime Guide Box */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                marginBottom: '18px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#c4b5fd' }}>
                  <Sparkles size={14} color="#a855f7" />
                  <span>Mentos Adaptive Co-Pilot</span>
                </div>
                <span style={{ fontSize: '0.625rem', background: 'rgba(168, 85, 247, 0.25)', color: '#e9d5ff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  PEDAGOGICAL HINT
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {currentAssessment.hint}
              </p>
            </div>

            {/* Functional Spec */}
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
              Specification
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              {currentAssessment.description}
            </p>

            {/* Examples */}
            {currentAssessment.examples.map((ex, idx) => (
              <div key={idx} style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px', textTransform: 'uppercase' }}>
                  EXAMPLE {idx + 1}
                </h4>
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: '#cbd5e1',
                    lineHeight: 1.6
                  }}
                >
                  <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>INPUT</div>
                  <div>{ex.input}</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '6px', marginBottom: '2px' }}>OUTPUT</div>
                  <div>{ex.output}</div>
                </div>
              </div>
            ))}

            {/* Constraints */}
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px', textTransform: 'uppercase', marginTop: '16px' }}>
              Constraints
            </h4>
            <ul style={{ paddingLeft: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              {currentAssessment.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Pane: Code Editor + Bottom Test Execution Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Editor Header Tab */}
          <div
            style={{
              height: '38px',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0e1424',
              borderBottom: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#a855f7' }} />
              <strong style={{ color: '#fff' }}>{language === 'java' ? 'Solution.java' : 'solution.py'}</strong>
              <span style={{ color: 'var(--text-muted)' }}>• UTF-8</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.6875rem' }}>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Copy size={12} /> Copy
              </button>
              <span style={{ color: '#34d399' }}>● {language === 'java' ? 'JDK 17 Language Server' : 'Python 3.11'}</span>
            </div>
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1, minHeight: '260px', overflow: 'hidden' }}>
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
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
          <div
            style={{
              height: '240px',
              background: '#0d1322',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Results Tabs & Metrics */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => setActiveBottomTab('results')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeBottomTab === 'results' ? '2px solid #a855f7' : '2px solid transparent',
                    padding: '8px 0',
                    color: activeBottomTab === 'results' ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={13} color="#10b981" />
                  <span>Test Results</span>
                  <span style={{ fontSize: '0.625rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1px 5px', borderRadius: '4px' }}>
                    Passed {currentAssessment.testCases.length}/{currentAssessment.testCases.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('console')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    color: activeBottomTab === 'console' ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Terminal size={13} />
                  <span>Console Output</span>
                </button>
              </div>

              {/* Performance Metrics */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                <span>Runtime: <strong style={{ color: '#34d399' }}>2ms</strong> (Faster than 94.2%)</span>
                <span>Memory: <strong style={{ color: '#f8fafc' }}>42.1 MB</strong></span>
              </div>
            </div>

            {/* Test Cases Sub-body */}
            <div style={{ flex: 1, padding: '12px 16px', display: 'flex', gap: '16px', overflowY: 'auto' }}>
              {/* Cases List */}
              <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
                  TEST CASES
                </span>

                {currentAssessment.testCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedCase === c.id ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: selectedCase === c.id ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>{c.label}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>{c.time}</span>
                  </div>
                ))}
              </div>

              {/* Case Details */}
              <div style={{ flex: 1, background: 'rgba(0, 0, 0, 0.25)', borderRadius: '6px', padding: '10px 14px', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                {(() => {
                  const activeTc = currentAssessment.testCases.find(tc => tc.id === selectedCase) || currentAssessment.testCases[0];
                  return (
                    <div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700 }}>
                          PASSED
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>Runtime: {activeTc.time} • Execution OK</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontFamily: 'monospace' }}>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginBottom: '2px' }}>INPUT</div>
                          <div style={{ color: '#cbd5e1' }}>{activeTc.input}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginBottom: '2px' }}>EXPECTED OUTPUT</div>
                          <div style={{ color: '#cbd5e1' }}>{activeTc.expected}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Floating Live Viva Prompt Box bottom right */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                background: 'rgba(16, 22, 38, 0.95)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 14px rgba(168, 85, 247, 0.25)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <Sparkles size={15} color="#a855f7" />
                <span>Ready for live viva: Mentos is analyzing your algorithmic logic.</span>
              </div>

              <button
                onClick={() => {
                  if (onStartViva) onStartViva();
                  else if (onOpenVoiceTutor) onOpenVoiceTutor();
                }}
                className="btn btn-primary"
                style={{ fontSize: '0.6875rem', padding: '5px 12px', gap: '4px' }}
              >
                <Mic size={12} /> Start 2-min Code Viva ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingWorkspace;
