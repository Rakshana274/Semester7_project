import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Authenticating session..." />;
  }

  if (!token || !user) {
    return <Navigate to="/patient/login" state={{ from: location }} replace />;
  }

  return children;
};

export const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking permissions..." />;
  }

  if (!token || !user) {
    // Determine login redirect based on route attempted
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" replace />;
    } else if (location.pathname.startsWith('/doctor')) {
      return <Navigate to="/doctor/login" replace />;
    } else if (location.pathname.startsWith('/receptionist')) {
      return <Navigate to="/receptionist/login" replace />;
    }
    return <Navigate to="/patient/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard if unauthorized for this role route
    const roleDashboards = {
      patient: '/patient/dashboard',
      receptionist: '/receptionist/dashboard',
      doctor: '/doctor/dashboard',
      admin: '/admin/dashboard'
    };
    const redirectUrl = roleDashboards[user.role] || '/patient/dashboard';
    return <Navigate to={redirectUrl} replace />;
  }

  return children;
};
