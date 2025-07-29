import api from '../lib/axios';

// Registers a user
export async function registerUser(formData) {
  const res = await api.post('/register', formData);
  return res.data; // only returns data, not the whole response
}


export async function loginUser(formData) {
  const res = await api.post('/login', formData);
  return res.data; // returns the backend response data (token, user)
}