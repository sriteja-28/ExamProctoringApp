import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { auth, logout } = useContext(AuthContext);

  if (!auth.token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(auth.token);
    if (decoded.exp * 1000 < Date.now()) {
      logout();
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
