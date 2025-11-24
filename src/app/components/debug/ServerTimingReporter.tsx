import { getRequestLogStore } from '@/utils/performance/requestLogStore';
import DebugLogger from '@/app/components/debug/DebugLogger';

export default function ServerTimingReporter() {
  if (process.env.NODE_ENV === 'production') {
    // Optional: Hide in production or keep it? The user asked for observability.
    // For now, let's keep it but maybe we can guard it later.
    // The user's request is to find bottlenecks, likely in dev or staging, but they have Proxmox deployment.
    // Let's enable it always for now as requested "Trick is fine".
  }

  const store = getRequestLogStore();
  // We need to pass the logs to the client component.
  // Since this is a Server Component, it reads the *current* state of the store.
  // IMPORTANT: This component must be placed at the END of the layout so that
  // all prior server component rendering (which populates the store) is complete.

  return <DebugLogger logs={store.logs} />;
}
