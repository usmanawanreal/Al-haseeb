import { Navigate } from 'react-router-dom';

/** Services grid lives on the home landing page (`#services`). */
export default function Services() {
  return <Navigate to={{ pathname: '/', hash: 'services' }} replace />;
}
