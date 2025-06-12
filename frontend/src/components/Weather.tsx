import { convertToCelsius, getWeatherIconUrl } from '../services/tomorrowIoService';
import { useEffect, useState } from 'react';

import { Button } from './ui/Button';
import { FiRefreshCw } from 'react-icons/fi';
import React from 'react';
import { formatDistance } from 'date-fns';
import { useSettingsStore } from '../stores/settingsStore';
import { useWeatherStore } from '../stores/weatherStore';

/**
 * Weather component displays current weather conditions
 */
const Weather = (): React.ReactElement => {
	const { weather, isLoading, fetchWeather, refreshWeather } = useWeatherStore();
	const { temperatureUnit, showWeather } = useSettingsStore();
	const [geoError, setGeoError] = useState<string | null>(null);

	// Request geolocation and fetch weather data on mount
	useEffect(() => {
		if (!showWeather) return;

		const loadWeather = async (): Promise<void> => {
			if (weather?.coordinates) {
				// Use existing coordinates if available
				await fetchWeather(weather.coordinates.lat, weather.coordinates.lon);
			} else {
				// Otherwise request the user's location
				if ('geolocation' in navigator) {
					try {
						const position = await new Promise<GeolocationPosition>((resolve, reject) => {
							navigator.geolocation.getCurrentPosition(resolve, reject, {
								enableHighAccuracy: true,
								timeout: 5000,
								maximumAge: 60000, // 1 minute
							});
						});
						
						const { latitude, longitude } = position.coords;
						await fetchWeather(latitude, longitude);
						setGeoError(null);
					} catch (error) {
						console.error('Geolocation error:', error);
						setGeoError('Unable to access your location. Please enable location services.');
					}
				} else {
					setGeoError('Geolocation is not supported in your browser.');
				}
			}
		};
		
		void loadWeather();
		
		// Set up interval to refresh weather every 15 minutes
		const intervalId = setInterval(() => {
			void refreshWeather();
		}, 15 * 60 * 1000);
		
		return () => clearInterval(intervalId);
	}, [fetchWeather, refreshWeather, weather?.coordinates, showWeather]);
	
	if (!showWeather) return <></>;
	
	// Show error message if we couldn't get the location
	if (geoError) {
		return (
			<div className='backdrop-blur-container p-3 inline-block'>
				<p className='text-sm text-red-300'>{geoError}</p>
				<Button 
					onClick={() => window.location.reload()} 
					className='mt-2 text-xs'
					size='sm'
				>
					Retry
				</Button>
			</div>
		);
	}
	
	// Show loading state
	if (isLoading || !weather) {
		return (
			<div className='backdrop-blur-container p-3 inline-block'>
				<p className='text-sm text-white/80'>Loading weather...</p>
			</div>
		);
	}
	
	// Convert temperature if needed
	const temp = temperatureUnit === 'celsius' 
		? convertToCelsius(weather.temperature)
		: weather.temperature;
	
	const high = temperatureUnit === 'celsius' 
		? convertToCelsius(weather.high)
		: weather.high;
	
	const low = temperatureUnit === 'celsius' 
		? convertToCelsius(weather.low)
		: weather.low;
		
	// Get weather icon URL
	const iconUrl = getWeatherIconUrl(weather.icon);
	
	// Format the last updated time
	const lastUpdated = formatDistance(
		new Date(weather.fetchedAt),
		new Date(),
		{ addSuffix: true }
	);
	
	return (
		<div className='backdrop-blur-container p-3 inline-flex items-center space-x-4 shadow-lg'>
			<div className='flex flex-col items-center'>
				<img 
					src={iconUrl} 
					alt={weather.conditions}
					width='50'
					height='50'
					className='w-12 h-12'
				/>
				<span className='text-xs text-white/70'>{weather.conditions}</span>
			</div>
			
			<div>
				<div className='flex items-baseline'>
					<span className='text-2xl font-light'>{temp}°</span>
					<span className='text-xs ml-1'>{temperatureUnit === 'celsius' ? 'C' : 'F'}</span>
				</div>
				
				<div className='text-xs text-white/80 flex items-center space-x-2'>
					<span className='font-medium'>{weather.location}</span>
					<span>H:{high}° L:{low}°</span>
				</div>
				
				<div className='text-xs text-white/60 flex items-center space-x-1'>
					<span>Updated {lastUpdated}</span>
					<button
						onClick={() => void refreshWeather()}
						aria-label='Refresh weather'
						className='p-1 hover:text-white'
						disabled={isLoading}
					>
						<FiRefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Weather;
