// Static user context for dev mode, no authentication logic needed.
export function useAuth() {
  return {
    user: {
      id: 2,
      name: 'Static Teacher',
      email: 'teacher@tunilearn.com',
      role: 'TEACHER',
      profileImageUrl: null,
      bio: 'This is a static teacher for development.',
      profileCompleted: true,
    },
    isAuthenticated: true,
    loading: false,
    checkAuth: () => {},
    login: () => {},
    logout: () => {},
    isTeacher: true,
    isStudent: false,
    isAdmin: false,
    profileCompleted: true,
  };
}
