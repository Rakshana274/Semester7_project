import api from './api';
import { initialPatients } from './mockData';

export const predefinedUsers = [
  { username: 'janushiya', email: 'janushiya@hospital.org', password: 'januxh@19', role: 'admin', name: 'Janushiya (Admin)', id: 999 },
  { username: 'chowz', email: 'chowz@hospital.org', password: '123456', role: 'receptionist', name: 'Chowz (Receptionist)', id: 301 },
  { username: 'mythili', email: 'mythili@hospital.org', password: '123456', role: 'patient', name: 'Mythili (Patient)', id: 201 },
  { username: 'rakshana', email: 'rakshana@hospital.org', password: '123456', role: 'doctor', name: 'Dr. Rakshana', id: 101 }
];

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      console.log('Using Mock Auth Login for credentials:', credentials);
      const input = (credentials.username || credentials.email || '').trim().toLowerCase();
      const pass = (credentials.password || '').trim();

      // Match against predefined credentials
      const matched = predefinedUsers.find(u => 
        (u.username.toLowerCase() === input || u.email.toLowerCase() === input)
      );

      if (matched) {
        if (matched.password !== pass) {
          throw new Error(`Invalid password for user '${matched.username}'.`);
        }
        return {
          token: `mock-jwt-token-${matched.role}-${Date.now()}`,
          user: {
            id: matched.id,
            name: matched.name,
            email: matched.email,
            username: matched.username,
            role: matched.role
          }
        };
      }

      // Dynamic fallback for any email/username format if not in explicit list
      let userRole = credentials.role || 'patient';
      let name = input || 'User';
      let id = 201;

      if (input.includes('admin')) {
        userRole = 'admin';
        name = 'System Administrator';
        id = 999;
      } else if (input.includes('doctor') || input.includes('rakshana')) {
        userRole = 'doctor';
        name = 'Dr. Rakshana';
        id = 101;
      } else if (input.includes('reception') || input.includes('chowz')) {
        userRole = 'receptionist';
        name = 'Chowz (Receptionist)';
        id = 301;
      } else if (input.includes('mythili')) {
        userRole = 'patient';
        name = 'Mythili (Patient)';
        id = 201;
      }

      return {
        token: `mock-jwt-token-${userRole}-${Date.now()}`,
        user: {
          id,
          name,
          email: input.includes('@') ? input : `${input}@hospital.org`,
          username: input,
          role: userRole
        }
      };
    }
  },

  register: async (patientData) => {
    try {
      const response = await api.post('/auth/register', patientData);
      return response.data;
    } catch (err) {
      const newId = Date.now();
      return {
        success: true,
        message: 'Registration successful! You can now log in.',
        user: { id: newId, ...patientData, role: 'patient' }
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore mock logout error
    }
  }
};
