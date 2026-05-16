import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ADMIN_ROLES = ['Admin', 'SuperAdmin'];

export default function ProtectedRoute({ children }) {
  const { token, user } = useAuth();
  const location = useLocation();

  const hasToken = Boolean(token);
  const isAdmin = ADMIN_ROLES.includes(user?.role);

  if (!hasToken || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
