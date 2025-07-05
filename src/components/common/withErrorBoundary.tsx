import React, { ComponentType } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface WithErrorBoundaryProps {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  errorBoundaryProps?: WithErrorBoundaryProps
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
} 