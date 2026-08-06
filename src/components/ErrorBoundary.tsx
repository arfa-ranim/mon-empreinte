"use client";

import { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-60 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-earth-800 mb-2">
              Une erreur est survenue
            </h3>
            <p className="text-earth-500 text-sm max-w-md mb-6">
              {this.state.error?.message || "Une erreur inattendue s'est produite."}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              variant="primary"
            >
              <RefreshCw size={18} />
              Réessayer
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}