import { Navigate } from 'react-router-dom';

/** @deprecated Use `/login` — kept so old links still work */
export default function AdminLogin() {
  return <Navigate to="/login" replace state={{ from: { pathname: '/admin' } }} />;
}
