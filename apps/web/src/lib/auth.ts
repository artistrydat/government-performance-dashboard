import { create } from 'zustand';

export type UserRole = 'executive' | 'portfolio_manager' | 'project_officer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>; // eslint-disable-line no-unused-vars
  logout: () => void;
  mockLogin: (role: UserRole) => void; // eslint-disable-line no-unused-vars
}

// Mock users for development
const mockUsers: Record<UserRole, User> = {
  executive: {
    id: 'exec-001',
    email: 'executive@gov.sa',
    name: 'Executive Director',
    role: 'executive',
    department: 'Executive Office',
    avatar: '👨‍💼',
  },
  portfolio_manager: {
    id: 'pm-001',
    email: 'portfolio.manager@gov.sa',
    name: 'Portfolio Manager',
    role: 'portfolio_manager',
    department: 'Project Management Office',
    avatar: '👩‍💼',
  },
  project_officer: {
    id: 'po-001',
    email: 'project.officer@gov.sa',
    name: 'Project Officer',
    role: 'project_officer',
    department: 'Infrastructure Projects',
    avatar: '👨‍🔧',
  },
};

export const useAuth = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });

    // Mock authentication - in production, this would call the government SSO service
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password and assign role based on email
      let role: UserRole = 'project_officer';
      if (email.includes('executive')) role = 'executive';
      else if (email.includes('portfolio')) role = 'portfolio_manager';

      // Validate that password is provided (mock validation)
      if (!password) {
        throw new Error('Password is required');
      }

      const user = mockUsers[role];

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Store in localStorage for persistence
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Authentication failed');
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('auth_user');
  },

  mockLogin: (role: UserRole) => {
    const user = mockUsers[role];
    set({
      user,
      isAuthenticated: true,
    });
    localStorage.setItem('auth_user', JSON.stringify(user));
  },
}));

// Initialize auth state from localStorage (only in browser environment)
if (typeof window !== 'undefined' && window.localStorage) {
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      useAuth.setState({
        user,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem('auth_user');
    }
  }
}
