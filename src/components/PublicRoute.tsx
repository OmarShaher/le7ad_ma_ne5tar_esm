import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading spinner while checking auth status
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // User is already authenticated, redirect to home
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
