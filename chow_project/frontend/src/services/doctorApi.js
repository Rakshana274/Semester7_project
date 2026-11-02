import api from './api';
import { initialDoctors, initialOPDSessions } from './mockData';

export const doctorApi = {
  getDoctors: async () => {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (err) {
      return initialDoctors;
    }
  },

  getSchedule: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/schedule`);
      return response.data;
    } catch (err) {
      const session = initialOPDSessions.find(s => s.doctorId === Number(doctorId)) || initialOPDSessions[0];
      return session;
    }
  },

  getQueue: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/queue`);
      return response.data;
    } catch (err) {
      // Mock returned via appointmentApi
      return null;
    }
  }
};
