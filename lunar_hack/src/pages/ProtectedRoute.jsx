import React from 'react';
import { Navigate } from 'react-router-dom';



const ProtectedRoute = ({ children }) => {
 


  if (!sessionStorage.getItem('userDetails')) {
    return <Navigate to="/login"  />;
  }


  return children;
};

export default ProtectedRoute;