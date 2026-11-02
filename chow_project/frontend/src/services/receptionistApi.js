import api from './api';
import { initialEmergencies, initialPatients } from './mockData';

let emergenciesStore = [...initialEmergencies];

export const receptionistApi = {
  getEmergencies: async () => {
    try {
      const response = await api.get('/receptionist/emergencies');
      return response.data;
    } catch (err) {
      return emergenciesStore;
    }
  },

  registerWalkin: async (walkinData) => {
    try {
      const response = await api.post('/receptionist/walkin', walkinData);
      return response.data;
    } catch (err) {
      const token = `WALK-${Math.floor(100 + Math.random() * 900)}`;
      return {
        success: true,
        message: 'Walk-in patient registered successfully',
        token,
        consultationTime: '11:15 AM',
        priorityResult: walkinData.isEmergency ? 'Emergency' : 'High'
      };
    }
  },

  searchPatients: async (query) => {
    try {
      const response = await api.get('/receptionist/patients/search', { params: { query } });
      return response.data;
    } catch (err) {
      if (!query) return initialPatients;
      const q = query.toLowerCase();
      return initialPatients.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        String(p.id).includes(q)
      );
    }
  }
};
