import { create } from 'zustand'

interface UIState {
  activeSection: string
  mobileMenuOpen: boolean
  selectedProject: number | null
  setActiveSection: (section: string) => void
  toggleMobileMenu: () => void
  setSelectedProject: (id: number | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeSection: 'home',
  mobileMenuOpen: false,
  selectedProject: null,
  setActiveSection: (section) => set({ activeSection: section }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setSelectedProject: (id) => set({ selectedProject: id }),
}))
