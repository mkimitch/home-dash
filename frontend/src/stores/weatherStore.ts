import { Weather } from '../types';
import { create } from 'zustand';
import { fetchRealtimeWeather } from '../services/tomorrowIoService';
import { isOlderThan } from '../utils/dateUtils';
import { persist } from 'zustand/middleware';

interface WeatherState {
	// State
	weather: Weather | null;
	isLoading: boolean;
	error: string | null;
	
	// Actions
	fetchWeather: (lat?: number, lon?: number) => Promise<void>;
	refreshWeather: () => Promise<void>;
}

// Weather data should be refreshed every 15 minutes
const WEATHER_REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

export const useWeatherStore = create<WeatherState>()(
	persist(
		(set, get) => ({
			// Initial state
			weather: null,
			isLoading: false,
			error: null,
			
			// Actions
			fetchWeather: async (lat?: number, lon?: number) => {
				const current = get().weather;
				
				// Check if we need to fetch new weather data
				// 1. No existing data
				// 2. Data is older than the refresh interval
				if (current && !isOlderThan(new Date(current.fetchedAt), WEATHER_REFRESH_INTERVAL_MS)) {
					// Weather data is still fresh, don't fetch
					return;
				}
				
				set({ isLoading: true, error: null });
				
				try {
					// Use stored coordinates if available and no new ones provided
					const latitude = lat ?? current?.coordinates.lat;
					const longitude = lon ?? current?.coordinates.lon;
					
					// If we don't have coordinates, we'll use geolocation in the Weather component
					if (!latitude || !longitude) {
						set({ isLoading: false });
						return;
					}
					
					const weatherData = await fetchRealtimeWeather(latitude, longitude);
					set({ 
						weather: {
							...weatherData,
							fetchedAt: new Date().toISOString()
						},
						isLoading: false 
					});
				} catch (error) {
					console.error('Failed to fetch weather:', error);
					set({ 
						error: 'Failed to fetch weather data', 
						isLoading: false 
					});
				}
			},
			
			refreshWeather: async () => {
				const current = get().weather;
				
				if (!current) {
					// No existing data, use fetchWeather instead
					await get().fetchWeather();
					return;
				}
				
				set({ isLoading: true, error: null });
				
				try {
					const { lat, lon } = current.coordinates;
					const weatherData = await fetchRealtimeWeather(lat, lon);
					
					set({ 
						weather: {
							...weatherData,
							fetchedAt: new Date().toISOString()
						},
						isLoading: false 
					});
				} catch (error) {
					console.error('Failed to refresh weather:', error);
					set({ 
						error: 'Failed to refresh weather data', 
						isLoading: false 
					});
				}
			},
		}),
		{
			name: 'momentum-weather',
		}
	)
);
