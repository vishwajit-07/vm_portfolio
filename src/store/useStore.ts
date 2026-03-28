import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isAdminAuth: boolean;
  setAdminAuth: (status: boolean) => void;
  cursorVariant: string;
  setCursorVariant: (variant: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAdminAuth: false,
      setAdminAuth: (status) => set({ isAdminAuth: status }),
      cursorVariant: 'default',
      setCursorVariant: (variant) => set({ cursorVariant: variant }),
    }),
    {
      name: 'portfolio-store',
    }
  )
);
