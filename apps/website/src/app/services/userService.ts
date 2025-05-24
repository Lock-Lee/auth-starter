import axiosClient from '../lib/axios';
const PATH = '/users';
export const userService = {
  getAll: async () => {
    const res = await axiosClient.get(PATH);
    return res;
  },

  getById: async (id: string) => {
    const res = await axiosClient.get(`${PATH}/${id}`);
    return res;
  },

  create: async (userData: { email: string; name: string; password: string }) => {
    const res = await axiosClient.post(PATH, userData);
    return res;
  },

  update: async (id: string, userData: { name: string }) => {
    try {
      const res = await axiosClient.put(`${PATH}/${id}`, userData);
      return res;
    } catch (error) {
      console.error(error);
    }
  },

  remove: async (id: string) => {
    try {
      const res = await axiosClient.delete(`${PATH}/${id}`);

      return res;
    } catch (error) {
      console.error(error);
    }
  },
};
