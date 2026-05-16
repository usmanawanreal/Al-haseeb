import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminLogin as adminLoginRequest } from '../services/api';
import { AuthContext } from './authContext';

const STORAGE_TOKEN = 'adminToken';
const STORAGE_USER = 'adminUser';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN));
  const [user, setUser] = useState(readStoredUser);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const onSignOut = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('admin-auth:sign-out', onSignOut);
    return () => window.removeEventListener('admin-auth:sign-out', onSignOut);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await adminLoginRequest(credentials);
    const nextToken = data.token;
    const nextUser = {
      _id: data._id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };
    localStorage.setItem(STORAGE_TOKEN, nextToken);
    localStorage.setItem(STORAGE_USER, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  /** Store session from `POST /api/auth/login` response (used by unified `/login` page). */
  const applySession = useCallback((data) => {
    const nextToken = data.token;
    const nextUser = {
      _id: data._id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };
    localStorage.setItem(STORAGE_TOKEN, nextToken);
    localStorage.setItem(STORAGE_USER, JSON.stringify(nextUser));
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
      logout,
    }),
    [token, user, login, applySession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
