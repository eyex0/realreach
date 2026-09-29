import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import TokenBridge from './components/TokenBridge.tsx';
import './index.css';

const env = (import.meta as unknown as { env?: Record<string, string> }).env ?? {};
const clerkKey = env.VITE_CLERK_PUBLISHABLE_KEY ?? '';
const rootEl = document.getElementById('root')!;

if (!clerkKey) {
  createRoot(rootEl).render(
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '80px auto', padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Auth is not configured yet</h1>
      <p style={{ marginTop: 8, color: '#4b5563' }}>
        Add your Clerk publishable key to a <code>.env</code> file in the project root:
      </p>
      <pre style={{ marginTop: 12, background: '#f3f4f6', padding: 12, borderRadius: 8, fontSize: 13 }}>
        VITE_CLERK_PUBLISHABLE_KEY=pk_test_…
      </pre>
      <p style={{ marginTop: 8, color: '#4b5563', fontSize: 14 }}>
        Find it in the Clerk dashboard → API keys, then restart the dev server.
      </p>
    </div>,
  );
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <ClerkProvider publishableKey={clerkKey}>
        <TokenBridge />
        <App />
      </ClerkProvider>
    </StrictMode>,
  );
}
