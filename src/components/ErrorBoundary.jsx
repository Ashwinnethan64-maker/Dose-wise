import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-medical-card p-6 text-center">
                    <div className="max-w-md">
                        <h1 className="text-2xl font-bold themed-text mb-4">Something went wrong.</h1>
                        <p className="themed-text-muted mb-6">The application encountered an unexpected error. Please refresh the page.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary-500 text-white px-6 py-3 rounded-xl font-bold shadow-btn hover:bg-primary-600 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
