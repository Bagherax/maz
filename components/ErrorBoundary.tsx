import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In a real app, you would log this to an error reporting service like Sentry or LogRocket
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // FIX: In a class component, state and props must be accessed from `this`.
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center p-8 m-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
          <h1 className="text-xl font-bold">Something went wrong.</h1>
          <p className="mt-2">We've been notified and are looking into it. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;