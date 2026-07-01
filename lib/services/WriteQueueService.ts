type QueuedWriteOperation = {
  id: string;
  operation: string;
  payload: unknown;
  error: string;
  queuedAt: string;
  retryCount: number;
};

const WRITE_QUEUE_KEY = "trailhead-write-queue";

function createId() {
  return `write-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readQueue(): QueuedWriteOperation[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WRITE_QUEUE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as QueuedWriteOperation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedWriteOperation[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(WRITE_QUEUE_KEY, JSON.stringify(queue));
}

export function enqueueWrite(operation: string, payload: unknown, error: unknown) {
  const queue = readQueue();
  queue.push({
    id: createId(),
    operation,
    payload,
    error: error instanceof Error ? error.message : String(error),
    queuedAt: new Date().toISOString(),
    retryCount: 0,
  });

  writeQueue(queue);
}

export function getQueuedWrites() {
  return readQueue();
}

export async function executeWriteWithQueueFallback<T>(
  operation: string,
  payload: unknown,
  writeFn: () => Promise<T>,
): Promise<T> {
  try {
    return await writeFn();
  } catch (error) {
    enqueueWrite(operation, payload, error);
    throw error;
  }
}
