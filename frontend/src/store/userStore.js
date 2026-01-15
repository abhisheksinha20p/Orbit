import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useUserStore = create(
    persist(
        (set) => ({
            preferences: {
                theme: 'dark',
                notifications: true,
                emailUpdates: true,
            },

            updatePreferences: (newPreferences) => {
                set((state) => ({
                    preferences: { ...state.preferences, ...newPreferences },
                }));
            },

            resetPreferences: () => {
                set({
                    preferences: {
                        theme: 'dark',
                        notifications: true,
                        emailUpdates: true,
                    },
                });
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
