import { Navigate } from 'react-router-dom';

/** Full pricing table lives on the home landing page (`#pricing`). */
export default function Pricing() {
  return <Navigate to={{ pathname: '/', hash: 'pricing' }} replace />;
}
