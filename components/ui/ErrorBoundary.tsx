"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorState } from "./ErrorState";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  override render() {
    if (this.state.error) {
      return <ErrorState title="Application error" description={this.state.error.message} actionLabel="Reload" onAction={() => window.location.reload()} />;
    }

    return this.props.children;
  }
}