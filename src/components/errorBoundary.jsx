import React from "react";
import { Link } from "framework7-react";

/**
 * Props:
 * - fallback?: ReactNode | ((args: { error: Error; reset: () => void }) => ReactNode)
 * - onError?: (error: Error, info: React.ErrorInfo) => void
 * - onReset?: () => void
 * - resetKeys?: any[]       // when these values change, boundary resets automatically
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { error };
  }

  componentDidCatch(error, info) {
    // Optional: log to your error reporting service
    if (this.props.onError) this.props.onError(error, info);
    // console.error("ErrorBoundary caught:", error, info);
  }

  componentDidUpdate(prevProps) {
    // auto-reset if any resetKey changed
    const { resetKeys } = this.props;
    if (!this.state.error || !resetKeys || !resetKeys.length) return;

    const changed = resetKeys.some(
      (key, i) => !Object.is(key, prevProps.resetKeys?.[i])
    );
    if (changed) this.reset();
  }

  reset = () => {
    this.setState({ error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;
    const message = (info) =>
      process.env !== "production"
        ? "Please try again, if issue persist, contact admin"
        : info;

    if (error) {
      if (typeof fallback === "function") {
        return fallback({ error, reset: this.reset });
      }
      // default fallback UI
      return (
        <div style={styles.wrapper}>
          <div style={styles.card}>
            <div style={styles.title}>Something went wrong</div>
            <pre style={styles.pre}>
              Please try again, if issue persist, contact admin
            </pre>
            <button style={styles.btn} onClick={this.reset}>
              Try again
            </button>
            <Link href="/" style={{ ...styles.btn, ...styles.returnBtn }}>
              Go back home
            </Link>
          </div>
        </div>
      );
    }

    return children;
  }
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "rgba(0,0,0,0.04)",
    padding: 16,
  },
  card: {
    width: "min(520px, 95vw)",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  pre: {
    background: "#0b1020",
    color: "#cde3ff",
    padding: 12,
    borderRadius: 8,
    overflowX: "auto",
    maxHeight: 200,
    marginBottom: 12,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 12,
    whiteSpace: "pre-wrap",
    textAlign: "center",
  },
  btn: {
    padding: "15px 14px",
    borderRadius: 8,
    border: "1px solid #d0d7de",
    background: "#0d6efd",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    width: "100%",
  },
  returnBtn: {
    marginTop: 10,
  },
};
