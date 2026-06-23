import api from './api';

const aboutService = {
  getAboutInfo: async () => {
    const response = await api.get('/about');
    return response.data;
  },

  getVisiMisi: async () => {
    const response = await api.get('/visi-misi');
    return response.data;
  },
};

export default aboutService;
