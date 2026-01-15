import { create } from 'zustand';

export const useUIStore = create((set) => ({
    sidebarCollapsed: false,
    mobileMenuOpen: false,

    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

    openMobileMenu: () => set({ mobileMenuOpen: true }),

    closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
