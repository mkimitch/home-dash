import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BackgroundImage } from '../types';
import { fetchUnsplashImage } from '../services/unsplashService';
import { isSameDay } from '../utils/dateUtils';

interface BackgroundState {
	// State
	currentBackground: BackgroundImage | null;
	isLoading: boolean;
	error: string | null;
	
	// Actions
	fetchNewBackground: () => Promise<void>;
	refreshBackground: () => Promise<void>;
	setCustomBackground: (imageUrl: string) => void;
}

export const useBackgroundStore = create<BackgroundState>()(
	persist(
		(set, get) => ({
			// Initial state
			currentBackground: null,
			isLoading: false,
			error: null,
			
			// Actions
			fetchNewBackground: async () => {
				const current = get().currentBackground;
				
				// Check if we should fetch a new image (new day or no image)
				if (current && isSameDay(new Date(current.downloadDate), new Date())) {
					// Still valid for today, don't fetch a new one
					return;
				}
				
				set({ isLoading: true, error: null });
				
				try {
					const newBackground = await fetchUnsplashImage();
					set({ 
						currentBackground: {
							...newBackground,
							downloadDate: new Date().toISOString()
						},
						isLoading: false 
					});
				} catch (error) {
					console.error('Failed to fetch background:', error);
					set({ 
						error: 'Failed to fetch background image', 
						isLoading: false 
					});
				}
			},
			
			refreshBackground: async () => {
				set({ isLoading: true, error: null });
				
				try {
					const newBackground = await fetchUnsplashImage();
					set({ 
						currentBackground: {
							...newBackground,
							downloadDate: new Date().toISOString()
						},
						isLoading: false 
					});
				} catch (error) {
					console.error('Failed to refresh background:', error);
					set({ 
						error: 'Failed to refresh background image', 
						isLoading: false 
					});
				}
			},
			
			setCustomBackground: (imageUrl: string) => {
				// Create a custom background object
				const customBackground: BackgroundImage = {
					id: 'custom-' + Date.now(),
					url: imageUrl,
					thumbnailUrl: imageUrl,
					altDescription: 'Custom user-uploaded background',
					credit: {
						name: 'User Uploaded',
						username: '',
						profileUrl: ''
					},
					downloadDate: new Date().toISOString()
				};
				
				set({ currentBackground: customBackground });
			},
		}),
		{
			name: 'momentum-background',
		}
	)
);
