import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  const token = localStorage.getItem('token');

  // If there is no active session state and no token stored in localStorage, redirect to /login
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, user is authenticated; render the nested child component
  return children;
};

export default ProtectedRoute;
