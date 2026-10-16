/**
 * MentOS Activity History Service
 * Provides persistent, real-time activity recording using IndexedDB with localStorage fallback.
 * Automatically purges legacy mock records and tracks authentic user operations.
 */

export type ActivityType =
  | 'chat'
  | 'task'
  | 'code-analysis'
  | 'architecture'
  | 'deep-research'
  | 'canvas'
  | 'voice-session'
  | 'telemetry-audit';

export type ActivityStatus = 'in-progress' | 'completed' | 'failed' | 'cancelled';

export interface ChatMessagePayload {
  id: string;
  role: 'user' | 'gemini';
  text: string;
  timestamp: string;
  featureTag?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: ActivityType;
  status: ActivityStatus;
  createdAt: number;
  updatedAt: number;
  summary: string;
  reference?: string;
  hasArtifact?: boolean;
  artifactId?: string;
  artifactData?: any;
  messages?: ChatMessagePayload[];
  metadata?: Record<string, any>;
}

const DB_NAME = 'MentOS_Workspace_DB';
const DB_VERSION = 1;
const STORE_NAME = 'activity_history';
const LOCAL_STORAGE_KEY = 'mentos_activity_history_v1';
const LEGACY_STORAGE_KEYS = ['recent_chats', 'recents', 'mentos_recents', 'chat_history'];

// Known legacy mock IDs from previous hardcoded list
const LEGACY_MOCK_IDS = new Set([
  'mentos',
  'chatgpt-analysis',
  'farm-support',
  'techhorizon',
  'indianstandard',
  'kabadiwala',
  'ration',
  'analysis-req',
  'grammar-usage',
  'project-analysis',
  'event-planning',
]);

/**
 * Initialize IndexedDB instance
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Safely purge legacy mock data from localStorage
 */
export function purgeLegacyStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    LEGACY_STORAGE_KEYS.forEach((key) => {
      window.localStorage.removeItem(key);
    });

    const localData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      const parsed: ActivityItem[] = JSON.parse(localData);
      if (Array.isArray(parsed)) {
        // Filter out any entries that match legacy mock entries
        const cleaned = parsed.filter((item) => !LEGACY_MOCK_IDS.has(item.id));
        if (cleaned.length !== parsed.length) {
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleaned));
        }
      }
    }
  } catch (err) {
    console.warn('Could not clean legacy storage:', err);
  }
}

/**
 * Load all genuine activities sorted by createdAt descending
 */
export async function loadActivities(): Promise<ActivityItem[]> {
  purgeLegacyStorage();

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records: ActivityItem[] = request.result || [];
        // Filter out any mock records
        const genuine = records
          .filter((item) => item && item.id && !LEGACY_MOCK_IDS.has(item.id))
          .sort((a, b) => b.createdAt - a.createdAt);

        // Sync to localStorage as offline mirror
        try {
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(genuine));
        } catch {
          // ignore localStorage overflow
        }
        resolve(genuine);
      };

      request.onerror = () => {
        // Fallback to localStorage
        resolve(loadFromLocalStorage());
      };
    });
  } catch {
    return loadFromLocalStorage();
  }
}

function loadFromLocalStorage(): ActivityItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const items: ActivityItem[] = JSON.parse(raw);
    if (!Array.isArray(items)) return [];
    return items
      .filter((item) => item && item.id && !LEGACY_MOCK_IDS.has(item.id))
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

/**
 * Save or update a single activity item (upsert)
 */
export async function saveActivity(item: ActivityItem): Promise<void> {
  if (!item || !item.id || LEGACY_MOCK_IDS.has(item.id)) return;

  // 1. Update localStorage mirror
  try {
    const current = loadFromLocalStorage();
    const existingIndex = current.findIndex((x) => x.id === item.id);
    if (existingIndex >= 0) {
      current[existingIndex] = { ...current[existingIndex], ...item, updatedAt: Date.now() };
    } else {
      current.unshift(item);
    }
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }

  // 2. Persist to IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, localStorage retained:', err);
  }
}

/**
 * Update the status, summary, and payload of an existing activity
 */
export async function updateActivityStatus(
  id: string,
  status: ActivityStatus,
  updates?: {
    summary?: string;
    messages?: ChatMessagePayload[];
    metadata?: Record<string, any>;
    hasArtifact?: boolean;
    artifactId?: string;
    artifactData?: any;
  }
): Promise<void> {
  const current = loadFromLocalStorage();
  const existing = current.find((x) => x.id === id);
  if (!existing) return;

  const updated: ActivityItem = {
    ...existing,
    status,
    updatedAt: Date.now(),
    ...(updates?.summary ? { summary: updates.summary } : {}),
    ...(updates?.messages ? { messages: updates.messages } : {}),
    ...(updates?.metadata ? { metadata: { ...existing.metadata, ...updates.metadata } } : {}),
    ...(updates?.hasArtifact !== undefined ? { hasArtifact: updates.hasArtifact } : {}),
    ...(updates?.artifactId ? { artifactId: updates.artifactId } : {}),
    ...(updates?.artifactData ? { artifactData: updates.artifactData } : {}),
  };

  await saveActivity(updated);
}

/**
 * Delete a single activity item by ID
 */
export async function deleteActivity(id: string): Promise<void> {
  // 1. LocalStorage
  try {
    const current = loadFromLocalStorage();
    const filtered = current.filter((x) => x.id !== id);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }

  // 2. IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete failed:', err);
  }
}

/**
 * Clear all activities permanently
 */
export async function clearAllActivities(): Promise<void> {
  try {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB clear failed:', err);
  }
}

/**
 * Format relative timestamp nicely for UI
 */
export function formatActivityTime(timestamp: number): string {
  if (!timestamp) return 'Just now';
  const diff = Math.max(0, Date.now() - timestamp);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 45) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
