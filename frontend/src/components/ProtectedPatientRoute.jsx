import { Navigate, useLocation } from 'react-router-dom';
import { usePatientAuth } from '../hooks/usePatientAuth';

export default function ProtectedPatientRoute({ children }) {
  const { isAuthenticated, user } = usePatientAuth();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'Patient') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
