import { Navigate } from 'react-router-dom';

/** Full About content lives on the home landing page (`#about`). */
export default function About() {
  return <Navigate to={{ pathname: '/', hash: 'about' }} replace />;
}
