import api from './api';
import { initialAppointments, initialDepartments, initialDoctors, getStorageData, setStorageData } from './mockData';

let appointmentStore = getStorageData('appointments', initialAppointments);

const saveAppointments = (data) => {
  appointmentStore = data;
  setStorageData('appointments', data);
};

export const appointmentApi = {
  getAppointments: async (params = {}) => {
    try {
      const response = await api.get('/appointments', { params });
      return response.data;
    } catch (_err) {
      let filtered = [...appointmentStore];
      if (params.patientId) {
        filtered = filtered.filter(a => a.patientId === Number(params.patientId));
      }
      if (params.doctorId) {
        filtered = filtered.filter(a => a.doctorId === Number(params.doctorId));
      }
      if (params.status) {
        filtered = filtered.filter(a => a.status === params.status);
      }
      return filtered;
    }
  },

  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (_err) {
      const found = appointmentStore.find(a => a.id === id) || appointmentStore[0];
      return found;
    }
  },

  createAppointment: async (bookingData) => {
    try {
      const response = await api.post('/appointments', bookingData);
      return response.data;
    } catch (_err) {
      const newId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
      const dept = initialDepartments.find(d => d.id === Number(bookingData.departmentId));
      const doc = initialDoctors.find(d => d.id === Number(bookingData.doctorId));
      
      const newAppointment = {
        id: newId,
        patientId: bookingData.patientId || 201,
        patientName: bookingData.patientName || 'John Doe',
        patientPhone: bookingData.patientPhone || '+1 555-9011',
        patientAge: bookingData.patientAge || 42,
        patientGender: bookingData.patientGender || 'Male',
        doctorId: Number(bookingData.doctorId),
        doctorName: doc ? doc.name : 'Dr. Sarah Jenkins',
        departmentId: Number(bookingData.departmentId),
        departmentName: dept ? dept.name : 'General OPD',
        date: bookingData.date || new Date().toISOString().split('T')[0],
        token: `${dept ? dept.code : 'OPD'}-${Math.floor(100 + Math.random() * 900)}`,
        priority: bookingData.priority || 'Medium',
        priorityScore: bookingData.priorityScore || 65,
        consultationTime: '10:15 AM',
        status: 'Scheduled',
        checkInTime: null,
        symptoms: bookingData.symptoms || 'General discomfort',
        isEmergency: bookingData.isEmergency || false,
        notes: '',
        prescription: ''
      };

      const updated = [newAppointment, ...appointmentStore];
      saveAppointments(updated);
      return newAppointment;
    }
  },

  cancelAppointment: async (id) => {
    try {
      const response = await api.post(`/appointments/${id}/cancel`);
      return response.data;
    } catch (_err) {
      const updated = appointmentStore.map(a => 
        a.id === id ? { ...a, status: 'Cancelled' } : a
      );
      saveAppointments(updated);
      return { success: true, message: 'Appointment cancelled successfully' };
    }
  },

  updateStatus: async (id, status, notes = null, prescription = null) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status, notes, prescription });
      return response.data;
    } catch (_err) {
      const updated = appointmentStore.map(a => {
        if (a.id === id) {
          const u = { ...a, status };
          if (notes !== null) u.notes = notes;
          if (prescription !== null) u.prescription = prescription;
          return u;
        }
        return a;
      });
      saveAppointments(updated);
      return { success: true, message: `Status updated to ${status}` };
    }
  }
};

