import api from './api';
import { initialNotifications } from './mockData';

let notificationStore = [...initialNotifications];

export const notificationApi = {
  getNotifications: async (userId) => {
    try {
      const response = await api.get(`/notifications?userId=${userId}`);
      return response.data;
    } catch (err) {
      return notificationStore.filter(n => n.userId === Number(userId) || userId === 'all');
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (err) {
      notificationStore = notificationStore.map(n => 
        n.id === id ? { ...n, unread: false } : n
      );
      return { success: true };
    }
  }
};
