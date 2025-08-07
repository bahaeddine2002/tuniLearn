import api from '../lib/axios';

// Check authentication status
export async function checkAuthStatus() {
  try {
    const res = await api.get('/auth/check');
    return res.data;
  } catch (error) {
    throw error;
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (error) {
    throw error;
  }
}

// Complete user profile
export async function completeProfile(profileData) {
  try {
    const res = await api.post('/auth/complete-profile', profileData);
    return res.data;
  } catch (error) {
    throw error;
  }
}

// Logout user
export async function logout() {
  try {
    const res = await api.post('/auth/logout');
    return res.data;
  } catch (error) {
    throw error;
  }
}

// Get Google OAuth URL
export function getGoogleAuthUrl() {
  return `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
}