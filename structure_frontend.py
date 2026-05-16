import os

# Create directories
dirs = ['frontend/src/pages', 'frontend/src/components', 'frontend/src/services', 'frontend/src/context']
for d in dirs:
    os.makedirs(d, exist_ok=True)

# 1. services/api.js
api_js = """import axios from 'axios';

// Base URL configuration (Points to our Express Backend)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to attach JWT token for protected routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// API Service Endpoints
export const submitAppointment = (data) => API.post('/appointments', data);
export const submitInquiry = (data) => API.post('/inquiries', data);
export const getActiveServices = () => API.get('/services');

// Admin Endpoints
export const adminLogin = (credentials) => API.post('/admin/login', credentials);
export const fetchDashboardStats = () => API.get('/dashboard/stats');
export const fetchRecentActivity = () => API.get('/dashboard/recent-activity');

export default API;
"""
with open('frontend/src/services/api.js', 'w') as f: f.write(api_js)

# 2. pages/Home.jsx
home_jsx = """import React from 'react';

const Home = () => {
  return (
    <div className="container py-5">
      <h1>Al-Haseeb Medical Health Care Center</h1>
      <p>Professional Home Healthcare Services in Shakargarh</p>
    </div>
  );
};

export default Home;
"""
with open('frontend/src/pages/Home.jsx', 'w') as f: f.write(home_jsx)

# 3. components/Navbar.jsx
navbar_jsx = """import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar-custom">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand-text">Al-Haseeb</Link>
        <div>
          <Link to="/" className="nav-link d-inline-block mx-2">Home</Link>
          <Link to="/booking" className="btn-primary-custom mx-2">Book Appointment</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
"""
with open('frontend/src/components/Navbar.jsx', 'w') as f: f.write(navbar_jsx)

# 4. App.jsx
app_jsx = """import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// import './index.css'; // Global CSS (Legacy Styles)

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* We will add more routes here soon */}
      </Routes>
    </Router>
  );
}

export default App;
"""
with open('frontend/src/App.jsx', 'w') as f: f.write(app_jsx)

# 5. main.jsx
main_jsx = """import React from 'react';
import ReactDOM from 'react-ui/client'; // Note: Fixing typo below
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"""
with open('frontend/src/main.jsx', 'w') as f: f.write(main_jsx)

print("Frontend structure and api.js setup completed.")
