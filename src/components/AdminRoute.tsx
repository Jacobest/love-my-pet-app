import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminMobileAccessDenied from './AdminMobileAccessDenied';

const MOBILE_BREAKPOINT = 768; // Tailwind's `md` breakpoint

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user || user.role !== 'Admin') {
    // Redirect them to the home page if they are not logged in or not an admin
    return <Navigate to="/" />;
  }

  if (isMobile) {
    return <AdminMobileAccessDenied />;
  }

  return children;
};

export default AdminRoute;