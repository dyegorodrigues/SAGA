import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="p-8 m-4 bg-rose-50 border-4 border-rose-200 rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-xl font-black text-rose-600 mb-2">Ops, deu um bugzinho!</h2>
          <p className="text-rose-500 font-medium mb-6">A tela quebrou, mas não tem problema.</p>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              if (this.props.onReset) this.props.onReset();
            }}
            className="px-6 py-3 bg-rose-500 text-white font-black rounded-xl hover:bg-rose-400 active:translate-y-1 transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
