/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors in child components and displays a fallback UI
 * instead of crashing the entire application.
 */
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details to console (in production, send to error tracking service)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "500px" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#ef4444",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: "#a1a1aa",
                marginBottom: "1.5rem",
                lineHeight: 1.6,
              }}
            >
              We apologize for the inconvenience. Please try refreshing the page
              or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 500,
                color: "#ffffff",
                backgroundColor: "#3b82f6",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
              }}
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre
                style={{
                  marginTop: "2rem",
                  padding: "1rem",
                  backgroundColor: "#18181b",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  color: "#ef4444",
                  overflow: "auto",
                  textAlign: "left",
                }}
              >
                {this.state.error.message}
                {"\n"}
                {this.state.error.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
