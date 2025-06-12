import { Settings } from '../types';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
	// Combined state
	settings: Settings;
	isSettingsOpen: boolean;
	
	// Actions
	updateSettings: (settings: Partial<Settings>) => void;
	resetSettings: () => void;
	fetchSettings: () => Promise<void>;
	toggleSettingsOpen: () => void;
}

// Default settings
const DEFAULT_SETTINGS: Settings = {
	backgroundSource: 'unsplash',
	showBookmarks: true,
	showFocus: true,
	showQuotes: true,
	showSeconds: false,
	showTodos: true,
	showWeather: true,
	temperatureUnit: 'fahrenheit',
	theme: 'system',
	timeFormat: '12h',
	userName: 'Friend',
};

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set, _get) => ({  
			// Initial state with all settings
			settings: { ...DEFAULT_SETTINGS },
			isSettingsOpen: false,
			
			// Actions
			updateSettings: (newSettings) => 
				set((state) => ({ 
					settings: { ...state.settings, ...newSettings } 
				})),
			
			resetSettings: () => 
				set({ settings: { ...DEFAULT_SETTINGS } }),
			
			fetchSettings: async () => {
				// We could fetch from an API here if the user is authenticated
				// For now, rely on the persisted store or defaults
				// This function exists to maintain API consistency for future implementation
				try {
					// If we had a backend:
					// const response = await api.getSettings();
					// set({ settings: response.data });
				} catch (error) {
					console.error('Failed to fetch settings:', error);
					// Fallback to defaults/local storage
				}
			},
			
			toggleSettingsOpen: () => 
				set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
		}),
		{
			name: 'momentum-settings',
		}
	)
);
