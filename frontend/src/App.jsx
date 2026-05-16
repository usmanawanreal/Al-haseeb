import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { PatientAuthProvider } from './context/PatientAuthContext.jsx';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import Booking from './pages/Booking';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminLogin from './pages/admin/AdminLogin';
import DashboardOverview from './pages/admin/DashboardOverview';
import AppointmentsManagement from './pages/admin/AppointmentsManagement';
import ServicesManager from './pages/admin/ServicesManager';
import InquiriesManagement from './pages/admin/InquiriesManagement';
import AdminSettings from './pages/admin/AdminSettings';
import PatientDashboard from './pages/PatientDashboard';
import ProtectedPatientRoute from './components/ProtectedPatientRoute';

export default function App() {
  return (
    <AuthProvider>
      <PatientAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="appointments" element={<AppointmentsManagement />} />
            <Route path="inquiries" element={<InquiriesManagement />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/my-appointments"
              element={
                <ProtectedPatientRoute>
                  <PatientDashboard />
                </ProtectedPatientRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </PatientAuthProvider>
    </AuthProvider>
  );
}
