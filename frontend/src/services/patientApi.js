import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const PATIENT_TOKEN_KEY = 'patientToken';
export const PATIENT_USER_KEY = 'patientUser';

const patientApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const getPatientToken = () => localStorage.getItem(PATIENT_TOKEN_KEY);

export const clearPatientAuthStorage = () => {
  localStorage.removeItem(PATIENT_TOKEN_KEY);
  localStorage.removeItem(PATIENT_USER_KEY);
};

patientApi.interceptors.request.use((req) => {
  const token = getPatientToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

patientApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && err.config?.headers?.Authorization) {
      clearPatientAuthStorage();
      window.dispatchEvent(new CustomEvent('patient-auth:sign-out'));
    }
    return Promise.reject(err);
  }
);

export const registerPatientAccount = (payload) => patientApi.post('/auth/register', payload);
/** Same as public unified login; uses public client when unauthenticated */
export const loginPatientAccount = (payload) => patientApi.post('/auth/login', payload);
export const fetchPatientMe = () => patientApi.get('/auth/me');
export const fetchMyAppointments = () => patientApi.get('/patient/appointments');
export const fetchMyAppointmentStats = () => patientApi.get('/patient/appointments/stats');
export const submitPatientAppointment = (data) => patientApi.post('/appointments', data);

export default patientApi;
