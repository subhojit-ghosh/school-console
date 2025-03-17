import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const AuthenticatedRoutes = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStore.user) {
      navigate('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStore.user]);

  if (!authStore.user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AuthenticatedRoutes;
