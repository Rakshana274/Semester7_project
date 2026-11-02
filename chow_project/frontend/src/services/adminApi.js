import api from './api';
import { 
  initialDepartments, 
  initialDoctors, 
  initialOPDSessions, 
  initialCapacity, 
  initialWalkinConfig, 
  initialSettings, 
  initialStatistics 
} from './mockData';

let deptStore = [...initialDepartments];
let docStore = [...initialDoctors];
let sessionStore = [...initialOPDSessions];
let capacityStore = { ...initialCapacity };
let walkinStore = { ...initialWalkinConfig };
let settingsStore = { ...initialSettings };

export const adminApi = {
  // Departments
  getDepartments: async () => {
    try {
      const response = await api.get('/admin/departments');
      return response.data;
    } catch (err) {
      return deptStore;
    }
  },

  addDepartment: async (dept) => {
    try {
      const response = await api.post('/admin/departments', dept);
      return response.data;
    } catch (err) {
      const newDept = { id: Date.now(), ...dept, doctorCount: 0, active: true };
      deptStore.push(newDept);
      return newDept;
    }
  },

  updateDepartment: async (id, data) => {
    try {
      const response = await api.put(`/admin/departments/${id}`, data);
      return response.data;
    } catch (err) {
      deptStore = deptStore.map(d => d.id === id ? { ...d, ...data } : d);
      return { success: true, message: 'Department updated' };
    }
  },

  deleteDepartment: async (id) => {
    try {
      await api.delete(`/admin/departments/${id}`);
    } catch (err) {
      deptStore = deptStore.filter(d => d.id !== id);
      return { success: true };
    }
  },

  // Doctors
  getDoctors: async () => {
    try {
      const response = await api.get('/admin/doctors');
      return response.data;
    } catch (err) {
      return docStore;
    }
  },

  addDoctor: async (doc) => {
    try {
      const response = await api.post('/admin/doctors', doc);
      return response.data;
    } catch (err) {
      const newDoc = { id: Date.now(), status: 'Active', ...doc };
      docStore.push(newDoc);
      return newDoc;
    }
  },

  updateDoctor: async (id, data) => {
    try {
      const response = await api.put(`/admin/doctors/${id}`, data);
      return response.data;
    } catch (err) {
      docStore = docStore.map(d => d.id === id ? { ...d, ...data } : d);
      return { success: true, message: 'Doctor updated' };
    }
  },

  deleteDoctor: async (id) => {
    try {
      await api.delete(`/admin/doctors/${id}`);
    } catch (err) {
      docStore = docStore.filter(d => d.id !== id);
      return { success: true };
    }
  },

  // OPD Sessions & Schedules
  getOPDSessions: async () => {
    try {
      const response = await api.get('/admin/opd-sessions');
      return response.data;
    } catch (err) {
      return sessionStore;
    }
  },

  saveOPDSession: async (session) => {
    try {
      const response = await api.post('/admin/opd-sessions', session);
      return response.data;
    } catch (err) {
      const newSession = { id: Date.now(), booked: 0, remaining: session.capacity, status: 'Active', ...session };
      sessionStore.push(newSession);
      return newSession;
    }
  },

  // Capacity & Walk-in settings
  getCapacityConfig: async () => {
    try {
      const response = await api.get('/admin/capacity');
      return response.data;
    } catch (err) {
      return capacityStore;
    }
  },

  updateCapacityConfig: async (data) => {
    try {
      const response = await api.put('/admin/capacity', data);
      return response.data;
    } catch (err) {
      capacityStore = { ...capacityStore, ...data };
      return capacityStore;
    }
  },

  getWalkinConfig: async () => {
    try {
      const response = await api.get('/admin/walkins');
      return response.data;
    } catch (err) {
      return walkinStore;
    }
  },

  updateWalkinConfig: async (data) => {
    try {
      const response = await api.put('/admin/walkins', data);
      return response.data;
    } catch (err) {
      walkinStore = { ...walkinStore, ...data };
      return walkinStore;
    }
  },

  // System Settings & Stats
  getSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (err) {
      return settingsStore;
    }
  },

  updateSettings: async (data) => {
    try {
      const response = await api.put('/admin/settings', data);
      return response.data;
    } catch (err) {
      settingsStore = { ...settingsStore, ...data };
      return settingsStore;
    }
  },

  getStatistics: async () => {
    try {
      const response = await api.get('/admin/statistics');
      return response.data;
    } catch (err) {
      return initialStatistics;
    }
  }
};
