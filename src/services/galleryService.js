import api from './api';

const galleryService = {
  getGalleryImages: async (page = 1, category = '') => {
    const params = { page };
    if (category && category !== 'SEMUA') {
      params.category = category;
    }
    const response = await api.get('/galeri', { params });
    return response.data;
  },

  getGalleryCategories: async () => {
    const response = await api.get('/galeri/categories');
    return response.data;
  },

  createGalleryImage: async (data) => {
    const response = await api.post('/galeri', data);
    return response.data;
  },

  updateGalleryImage: async (id, data) => {
    const isFormData = data instanceof FormData;
    const response = isFormData 
      ? await api.post(`/galeri/${id}`, data)
      : await api.put(`/galeri/${id}`, data);
    return response.data;
  },

  deleteGalleryImage: async (id) => {
    const response = await api.delete(`/galeri/${id}`);
    return response.data;
  },
};

export default galleryService;
