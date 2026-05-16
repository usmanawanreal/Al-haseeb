import axios from 'axios';
import { getPatientToken } from './patientApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'adminToken';
const USER_KEY = 'adminUser';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

/** Public API calls (no auth) — avoids attaching patient or admin tokens. */
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getApiErrorMessage = (error, fallbackMessage = 'Something went wrong. Please try again.') => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.message) return error.message;
  return fallbackMessage;
};

api.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && err.config?.headers?.Authorization) {
      clearAuthStorage();
      window.dispatchEvent(new CustomEvent('admin-auth:sign-out'));
    }
    return Promise.reject(err);
  }
);

export const submitAppointment = (data) => {
  const patientToken = getPatientToken();
  if (patientToken) {
    return publicApi.post('/appointments', data, {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
  }
  return publicApi.post('/appointments', data);
};
export const submitInquiry = (data) => publicApi.post('/inquiries', data);
export const getActiveServices = () => publicApi.get('/services');

/** Unified login + forgot-password (public; never attach tokens). */
export const unifiedLogin = (credentials) => publicApi.post('/auth/login', credentials);

export const sendForgotPasswordOtp = (payload) =>
  publicApi.post('/auth/forgot-password/send-otp', payload);

export const verifyForgotPasswordOtp = (payload) =>
  publicApi.post('/auth/forgot-password/verify-otp', payload);

export const resetForgotPassword = (payload) =>
  publicApi.post('/auth/forgot-password/reset', payload);

export const adminLogin = (credentials) => publicApi.post('/admin/login', credentials);
export const fetchDashboardStats = () => api.get('/dashboard/stats');
export const fetchRecentActivity = () => api.get('/dashboard/recent-activity');

export const getAppointments = () => api.get('/appointments');
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

export const getInquiries = () => api.get('/inquiries');
export const updateInquiry = (id, data) => api.put(`/inquiries/${id}`, data);

export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const removeService = (id) => api.delete(`/services/${id}`);

export default api;
