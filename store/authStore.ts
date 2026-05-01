import { create } from 'zustand';

interface User {
  phone: string;
  name: string;
  address: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  phone: string;
  setPhone: (phone: string) => void;
  login: (user: User) => void;
  logout: () => void;
  updateAddress: (address: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    phone: '+234 800 000 0000',
    name: 'Glory',
    address: 'Murtomo, zone 6, Line 4, Osun State, Nigeria',
  },
  isAuthenticated: true,
  phone: '',
  setPhone: (phone) => set({ phone }),
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateAddress: (address) =>
    set((state) => ({
      user: state.user ? { ...state.user, address } : null,
    })),
}));
