import { useContext } from 'react';
import { PatientAuthContext } from '../context/patientAuthContext';

export function usePatientAuth() {
  const ctx = useContext(PatientAuthContext);
  if (!ctx) {
    throw new Error('usePatientAuth must be used within PatientAuthProvider');
  }
  return ctx;
}
