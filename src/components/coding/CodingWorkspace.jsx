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

export const CodingWorkspace = ({ onBack, onOpenVoiceTutor }) => {
  const [language, setLanguage] = useState('java');
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeBottomTab, setActiveBottomTab] = useState('results');
  const [selectedCase, setSelectedCase] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [testStatus, setTestStatus] = useState('passed');

  const javaStarter = `import java.util.*;

// Design an LRU Cache backed by Doubly-Linked Sentinel Nodes + HashMap

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
}`;

  const pythonStarter = `class Node:
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
        self.head.next = node
`;

  const [code, setCode] = useState(javaStarter);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(newLang === 'java' ? javaStarter : pythonStarter);
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
      {/* 1. Header Toolbar (Image 4) */}
      <div
        style={{
          height: '52px',
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

          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
            146. LRU Cache (Least Recently Used)
          </span>

          {/* Language Selector Dropdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: '#c4b5fd',
              cursor: 'pointer'
            }}
            onClick={() => handleLanguageChange(language === 'java' ? 'python' : 'java')}
          >
            <span>&lt; &gt; {language === 'java' ? 'Java (OpenJDK 17)' : 'Python 3.11'}</span>
            <ChevronDown size={12} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setCode(language === 'java' ? javaStarter : pythonStarter)}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '5px 10px', gap: '4px' }}
            title="Reset code to starter template"
          >
            <RotateCcw size={12} /> Default
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
            background: 'var(--bg-surface)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 16px' }}>
            {['description', 'hints', 'submissions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLeftTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeLeftTab === tab ? '2px solid #a855f7' : '2px solid transparent',
                  padding: '12px 14px',
                  color: activeLeftTab === tab ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8125rem',
                  fontWeight: activeLeftTab === tab ? 600 : 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab === 'hints' ? 'Hints (2/3)' : tab === 'submissions' ? 'Submissions (3)' : 'Description'}
              </button>
            ))}
          </div>

          {/* Description Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {/* Mentos Co-Pilot Callout (Image 4) */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#c4b5fd' }}>
                  <Sparkles size={14} color="#a855f7" />
                  <span>Mentos Adaptive Co-Pilot</span>
                </div>
                <span style={{ fontSize: '0.625rem', background: 'rgba(168, 85, 247, 0.25)', color: '#e9d5ff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  REALTIME GUIDE
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                A Doubly Linked List enables <strong>O(1)</strong> node extraction and insertion at head/tail. Combine with a hash map to achieve pointer lookup in strict constant time.
              </p>
            </div>

            {/* Functional Spec */}
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
              Functional Specification
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              Design a data structure that follows the constraints of a <strong>Least Recently Used (LRU) cache</strong>.
            </p>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Implement the <code>LRUCache</code> class:
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78125rem', color: '#cbd5e1', marginBottom: '18px', paddingLeft: '4px', listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><code>LRUCache(int capacity)</code> Initialize the LRU cache with positive size <code>capacity</code>.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><code>int get(int key)</code> Return value of <code>key</code> if it exists, otherwise return <code>-1</code>. Mark as most recently accessed.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><code>void put(int key, int value)</code> Update or insert key-val. When capacity is exceeded, evict the least recently used key.</span>
              </li>
            </ul>

            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: '#c4b5fd',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}
            >
              <Cpu size={14} />
              <span>Goal: <strong>O(1)</strong> average time complexity for both operations.</span>
            </div>

            {/* Example 1 */}
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              EXAMPLE 1
            </h4>
            <div
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#cbd5e1',
                lineHeight: 1.6
              }}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>INPUT EXECUTION SEQUENCE</div>
              <div>["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]</div>
              <div>[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>OUTPUT</div>
              <div>[null, null, null, 1, null, -1, null, -1, 3, 4]</div>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor + Bottom Test Execution Panel (Image 4) */}
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
              <strong style={{ color: '#fff' }}>{language === 'java' ? 'LRUCache.java' : 'lru_cache.py'}</strong>
              <span style={{ color: 'var(--text-muted)' }}>• UTF-8 • Tab Size: 4</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.6875rem' }}>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Copy size={12} /> Copy
              </button>
              <span style={{ color: '#34d399' }}>● {language === 'java' ? 'JDK 17 Language Server' : 'Python Server'}</span>
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

          {/* Bottom Test Results Panel (Image 4) */}
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
                    Passed 3/3
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

                <button
                  onClick={() => setActiveBottomTab('critique')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    color: activeBottomTab === 'critique' ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={13} color="#a855f7" />
                  <span>Viva & Deep Critique</span>
                </button>
              </div>

              {/* Performance Metrics */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                <span>Runtime: <strong style={{ color: '#34d399' }}>12ms</strong> (Faster than 89.4%)</span>
                <span>Memory: <strong style={{ color: '#f8fafc' }}>114.2 MB</strong></span>
              </div>
            </div>

            {/* Test Cases Sub-body */}
            <div style={{ flex: 1, padding: '12px 16px', display: 'flex', gap: '16px', overflowY: 'auto' }}>
              {/* Cases List */}
              <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
                  EXECUTION CASES
                </span>

                {[
                  { id: 1, label: 'Case 1', time: '12ms' },
                  { id: 2, label: 'Case 2 (Eviction)', time: '15ms' },
                  { id: 3, label: 'Case 3 (Cap = 1)', time: '11ms' }
                ].map((c) => (
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
                      <span>{c.label}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>{c.time}</span>
                  </div>
                ))}
              </div>

              {/* Case Details */}
              <div style={{ flex: 1, background: 'rgba(0, 0, 0, 0.25)', borderRadius: '6px', padding: '10px 14px', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700 }}>
                    PASSED
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>Runtime: 12ms • Memory: 48.6 MB</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontFamily: 'monospace' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginBottom: '2px' }}>METHOD INVOCATIONS</div>
                    <div style={{ color: '#cbd5e1' }}>["put", "put", "get", "put", "get", "get"]</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginBottom: '2px' }}>PARAMETERS</div>
                    <div style={{ color: '#cbd5e1' }}>[[1, 1], [2, 2], [1], [3, 3], [2], [3]]</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Live Viva Prompt Box bottom right (Image 4) */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                background: 'rgba(16, 22, 38, 0.95)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 14px rgba(168, 85, 247, 0.25)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <Sparkles size={15} color="#a855f7" />
                <span>Ready for live viva: Mentos is analyzing your eviction pointer logic.</span>
              </div>

              <button
                onClick={onOpenVoiceTutor}
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
