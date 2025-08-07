import axios from '../lib/axios';

export const getUser = async (userId) => {
  const res = await axios.get(`/users/${userId}`);
  return res.data;
};

export const updateUser = async (userId, userData) => {
  const res = await axios.put(`/users/${userId}`, userData);
  return res.data;
};
