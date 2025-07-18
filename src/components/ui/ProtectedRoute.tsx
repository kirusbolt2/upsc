import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireStudent?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, requireStudent = false }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  console.log('🔍 ProtectedRoute check:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading, 
    userRole: profile?.role 
  });

  // Show loading spinner while auth is being determined
  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading auth state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user or profile
  if (!user || !profile) {
    console.log('🚫 ProtectedRoute: No user or profile, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requireAdmin && profile.role !== 'admin') {
    console.log('🚫 ProtectedRoute: Admin required but user is not admin');
    return <Navigate to="/dashboard" replace />;
  }

  if (requireStudent && profile.role !== 'student') {
    console.log('🚫 ProtectedRoute: Student required but user is not student');
    return <Navigate to="/admin" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
}
