'use client';

import { useEffect } from 'react';

type LogEntry = {
  type: string;
  name: string;
  duration: number;
  timestamp: number;
  meta?: Record<string, unknown>;
};

export default function DebugLogger({ logs }: { logs: LogEntry[] }) {
  useEffect(() => {
    if (logs.length > 0) {
      console.groupCollapsed(`[Server Timing] ${logs.length} events`);
      const totalDuration = logs.reduce((acc, log) => acc + log.duration, 0);
      console.log(`Total tracked duration: ${totalDuration.toFixed(2)}ms`);

      console.table(
        logs.map((l) => ({
          Type: l.type,
          Name: l.name,
          'Duration (ms)': l.duration.toFixed(2),
          Timestamp: l.timestamp,
        }))
      );
      console.groupEnd();
    }
  }, [logs]);

  return null;
}
