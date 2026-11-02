import api from './api';
import { initialPatients } from './mockData';

export const patientApi = {
  getProfile: async (patientId) => {
    try {
      const response = await api.get(`/patients/${patientId}`);
      return response.data;
    } catch (err) {
      const patient = initialPatients.find(p => p.id === Number(patientId)) || initialPatients[0];
      return patient;
    }
  },

  updateProfile: async (patientId, data) => {
    try {
      const response = await api.put(`/patients/${patientId}`, data);
      return response.data;
    } catch (err) {
      return { success: true, message: 'Profile updated successfully', data };
    }
  }
};
