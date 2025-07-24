import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-50 to-amber-50">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-12 h-40 bg-gradient-to-b from-amber-100 to-amber-200 rounded-sm shadow-lg mx-auto relative">
                <div className="w-full h-2 bg-amber-200 rounded-t-sm"></div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gray-800"></div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-amber-800 mb-4">
              Yahrzeit Tracker
            </h1>
            
            <div className="text-lg text-amber-700 mb-2" dir="rtl">
              ליועלי נשמת חיה שרה לאה בת אורי
            </div>
            
            <p className="text-amber-600 mb-6">
              Something went wrong while loading the memorial application.
            </p>
            
            <button 
              onClick={() => window.location.reload()}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Refresh Page
            </button>
            
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-amber-600 hover:text-amber-700">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs bg-amber-100 p-3 rounded text-amber-800 overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
