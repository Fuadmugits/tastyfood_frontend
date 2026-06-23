import api from './api';

const contactService = {
  sendContactMessage: async (data) => {
    const response = await api.post('/kontak', data);
    return response.data;
  },

  getContactInfo: async () => {
    const response = await api.get('/kontak/info');
    return response.data;
  },

  getContactMessages: async () => {
    const response = await api.get('/kontak/messages');
    return response.data;
  },

  deleteContactMessage: async (id) => {
    const response = await api.delete(`/kontak/messages/${id}`);
    return response.data;
  },

  markMessageAsRead: async (id) => {
    const response = await api.patch(`/kontak/messages/${id}/read`);
    return response.data;
  },
};

export default contactService;
