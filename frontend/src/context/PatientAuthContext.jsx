import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearPatientAuthStorage,
  fetchPatientMe,
  loginPatientAccount,
  PATIENT_TOKEN_KEY,
  PATIENT_USER_KEY,
  registerPatientAccount,
} from '../services/patientApi';
import { PatientAuthContext } from './patientAuthContext';

function readStoredPatient() {
  try {
    const raw = localStorage.getItem(PATIENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function PatientAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(PATIENT_TOKEN_KEY));
  const [user, setUser] = useState(readStoredPatient);

  const logout = useCallback(() => {
    clearPatientAuthStorage();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const onSignOut = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('patient-auth:sign-out', onSignOut);
    return () => window.removeEventListener('patient-auth:sign-out', onSignOut);
  }, []);

  useEffect(() => {
    if (!token) return undefined;

    let cancelled = false;

    (async () => {
      try {
        const { data } = await fetchPatientMe();
        if (!cancelled) setUser(data);
      } catch {
        if (!cancelled) logout();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const login = useCallback(async (credentials) => {
    const { data } = await loginPatientAccount(credentials);
    if (data.role !== 'Patient') {
      const err = new Error('Invalid email or password');
      err.response = { data: { message: 'Invalid email or password' } };
      throw err;
    }
    const nextToken = data.token;
    const nextUser = {
      _id: data._id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
    };
    localStorage.setItem(PATIENT_TOKEN_KEY, nextToken);
    localStorage.setItem(PATIENT_USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  const applySession = useCallback((data) => {
    const nextToken = data.token;
    const nextUser = {
      _id: data._id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
    };
    localStorage.setItem(PATIENT_TOKEN_KEY, nextToken);
    localStorage.setItem(PATIENT_USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await registerPatientAccount(payload);
    const nextToken = data.token;
    const nextUser = {
      _id: data._id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
    };
    localStorage.setItem(PATIENT_TOKEN_KEY, nextToken);
    localStorage.setItem(PATIENT_USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      applySession,
      register,
      logout,
    }),
    [token, user, login, applySession, register, logout]
  );

  return <PatientAuthContext.Provider value={value}>{children}</PatientAuthContext.Provider>;
}
