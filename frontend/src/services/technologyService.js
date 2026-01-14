import api from './api';

export const technologyService = {
  getTechnologies: async (params) => {
    const response = await api.get('/technologies', { params });
    return response.data;
  },

  getTechnology: async (id) => {
    const response = await api.get(`/technologies/${id}`);
    return response.data;
  },

  createTechnology: async (data) => {
    const response = await api.post('/technologies', data);
    return response.data;
  },

  updateTechnology: async (id, data) => {
    const response = await api.put(`/technologies/${id}`, data);
    return response.data;
  },

  deleteTechnology: async (id) => {
    const response = await api.delete(`/technologies/${id}`);
    return response.data;
  }
};
