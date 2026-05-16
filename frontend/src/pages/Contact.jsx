import { Navigate } from 'react-router-dom';

/** Contact form and details live on the home landing page (`#contact`). */
export default function Contact() {
  return <Navigate to={{ pathname: '/', hash: 'contact' }} replace />;
}
