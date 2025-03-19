import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const RedirectIfAuthenticatedRoutes = () => {
  const authStore = useAuthStore();

  return authStore.user ? <Navigate to="/" /> : <Outlet />;
};

export default RedirectIfAuthenticatedRoutes;
