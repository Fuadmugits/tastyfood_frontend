import api from './api';

const newsService = {
  getNews: async (page = 1) => {
    const response = await api.get('/berita', { params: { page } });
    return response.data;
  },

  getNewsById: async (id) => {
    const response = await api.get(`/berita/${id}`);
    return response.data;
  },

  getFeaturedNews: async () => {
    const response = await api.get('/berita/featured');
    return response.data;
  },

  createNews: async (data) => {
    // If sending file, data should be FormData. Axios handles headers automatically.
    const response = await api.post('/berita', data);
    return response.data;
  },

  updateNews: async (id, data) => {
    // If data is FormData and has files, Laravel requires POST with _method=PUT.
    // We can pass data as is, expecting the caller to have appended _method='PUT' if it's FormData.
    const isFormData = data instanceof FormData;
    const response = isFormData 
      ? await api.post(`/berita/${id}`, data)
      : await api.put(`/berita/${id}`, data);
    return response.data;
  },

  deleteNews: async (id) => {
    const response = await api.delete(`/berita/${id}`);
    return response.data;
  },
};

export default newsService;
