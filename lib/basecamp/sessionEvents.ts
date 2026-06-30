"use client";

import type { Activity } from "@/types/Activity";
import type { WorkflowEvent } from "@/types/Workflow";

const ACTIVITY_KEY = "basecamp_session_activity_events";
const WORKFLOW_KEY = "basecamp_session_workflow_events";

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber());
}

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getSessionActivityEvents() {
  return readArray<Activity>(ACTIVITY_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSessionWorkflowEvents() {
  return readArray<WorkflowEvent>(WORKFLOW_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addSessionActivityEvent(event: Omit<Activity, "id" | "createdAt">) {
  const created: Activity = {
    ...event,
    id: createId("session-activity"),
    createdAt: new Date().toISOString(),
  };

  const all = [created, ...getSessionActivityEvents()];
  writeArray(ACTIVITY_KEY, all);
  notifySubscribers();

  // TODO: Persist this session activity event via Supabase repository once write flows are enabled.
  return created;
}

export function addSessionWorkflowEvent(event: Omit<WorkflowEvent, "id" | "createdAt">) {
  const created: WorkflowEvent = {
    ...event,
    id: createId("session-workflow"),
    createdAt: new Date().toISOString(),
  };

  const all = [created, ...getSessionWorkflowEvents()];
  writeArray(WORKFLOW_KEY, all);
  notifySubscribers();

  // TODO: Persist this session workflow event via Supabase repository once write flows are enabled.
  return created;
}

export function subscribeToSessionEvents(subscriber: Subscriber) {
  subscribers.add(subscriber);
  return () => {
    subscribers.delete(subscriber);
  };
}
