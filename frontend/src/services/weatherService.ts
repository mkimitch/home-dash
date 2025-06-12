/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Weather } from '../types';

/**
 * Fetches weather data from OpenWeather API
 * @param lat Latitude coordinate
 * @param lon Longitude coordinate
 * @returns Promise<Weather>
 */
export const fetchWeatherData = async (lat: number, lon: number): Promise<Weather> => {
	const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
	
	if (!apiKey) {
		throw new Error('OpenWeather API key not configured');
	}
	
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
	);
	
	if (!response.ok) {
		throw new Error('Failed to fetch weather data');
	}
	
	const data = await response.json();
	
	// Convert the OpenWeather response to our Weather format
	const weather: Weather = {
		location: data.name,
		temperature: Math.round(data.main.temp),
		conditions: data.weather[0].main,
		icon: data.weather[0].icon,
		high: Math.round(data.main.temp_max),
		low: Math.round(data.main.temp_min),
		windSpeed: Math.round(data.wind.speed),
		humidity: data.main.humidity,
		fetchedAt: new Date().toISOString(),
		timezone: data.timezone,
		coordinates: {
			lat: data.coord.lat,
			lon: data.coord.lon,
		},
	};
	
	return weather;
};

/**
 * Converts temperature from Fahrenheit to Celsius
 * @param fahrenheit Temperature in Fahrenheit
 * @returns Temperature in Celsius (rounded)
 */
export const convertToCelsius = (fahrenheit: number): number => {
	return Math.round((fahrenheit - 32) * 5 / 9);
};

/**
 * Gets the appropriate weather icon URL from the icon code
 * @param iconCode OpenWeather icon code
 * @returns URL to the weather icon
 */
export const getWeatherIconUrl = (iconCode: string): string => {
	return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
