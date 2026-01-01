import { StrictMode, Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff4444', background: '#1a1a1a', height: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>⚠️ Application Crashed</h1>
          <div style={{ background: '#000', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{this.state.error?.toString()}</p>
            <pre style={{ fontSize: '12px', color: '#888' }}>{this.state.error?.stack}</pre>
          </div>
          <p style={{ marginTop: '20px', color: '#888' }}>Check the developer console for more details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
