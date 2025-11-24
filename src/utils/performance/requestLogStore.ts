import { cache } from 'react';

export type LogEntry = {
  type: 'supabase' | 'other' | string;
  name: string;
  duration: number;
  timestamp: number;
  meta?: Record<string, unknown>;
};

export const getRequestLogStore = cache(() => {
  return {
    logs: [] as LogEntry[],
  };
});

export const addLog = (entry: LogEntry) => {
  const store = getRequestLogStore();
  store.logs.push(entry);
};
