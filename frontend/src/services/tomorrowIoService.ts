import { Weather } from '../types';

// API key
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const API_KEY = import.meta.env.VITE_TOMORROW_IO_API_KEY as string || 'nhkUagLIXsKrOGf23QE0TQEH5l0G25ic';

// Base URL for Tomorrow.io API
const BASE_URL = 'https://api.tomorrow.io/v4/weather';

/**
 * Interface for Tomorrow.io API realtime weather response
 */
interface TomorrowIoRealtimeResponse {
	data: {
		time: string;
		values: {
			temperature: number;
			temperatureApparent: number;
			humidity: number;
			windSpeed: number;
			pressureSurfaceLevel: number;
			precipitationIntensity: number;
			rainIntensity: number;
			snowIntensity: number;
			weatherCode: number;
			cloudCover: number;
		};
	};
	location: {
		lat: number;
		lon: number;
		name: string;
	};
}

/**
 * Maps Tomorrow.io weather codes to conditions text
 */
const weatherCodeMap: Record<number, string> = {
	0: 'Clear',
	1000: 'Clear',
	1100: 'Mostly Clear',
	1101: 'Partly Cloudy',
	1102: 'Mostly Cloudy',
	1001: 'Cloudy',
	2000: 'Fog',
	2100: 'Light Fog',
	4000: 'Drizzle',
	4001: 'Rain',
	4200: 'Light Rain',
	4201: 'Heavy Rain',
	5000: 'Snow',
	5001: 'Flurries',
	5100: 'Light Snow',
	5101: 'Heavy Snow',
	6000: 'Freezing Drizzle',
	6001: 'Freezing Rain',
	6200: 'Light Freezing Rain',
	6201: 'Heavy Freezing Rain',
	7000: 'Ice Pellets',
	7101: 'Heavy Ice Pellets',
	7102: 'Light Ice Pellets',
	8000: 'Thunderstorm'
};

/**
 * Maps Tomorrow.io weather codes to icon names
 * Note: These are approximations as we need to adapt from Tomorrow.io codes to our icon system
 */
const weatherIconMap: Record<number, string> = {
	0: '01d', // Clear
	1000: '01d', // Clear
	1100: '02d', // Mostly Clear
	1101: '03d', // Partly Cloudy
	1102: '04d', // Mostly Cloudy
	1001: '04d', // Cloudy
	2000: '50d', // Fog
	2100: '50d', // Light Fog
	4000: '09d', // Drizzle
	4001: '10d', // Rain
	4200: '09d', // Light Rain
	4201: '09d', // Heavy Rain
	5000: '13d', // Snow
	5001: '13d', // Flurries
	5100: '13d', // Light Snow
	5101: '13d', // Heavy Snow
	6000: '09d', // Freezing Drizzle
	6001: '13d', // Freezing Rain
	6200: '09d', // Light Freezing Rain
	6201: '09d', // Heavy Freezing Rain
	7000: '13d', // Ice Pellets
	7101: '13d', // Heavy Ice Pellets
	7102: '13d', // Light Ice Pellets
	8000: '11d'  // Thunderstorm
};

// Night versions of the icons (append 'n' instead of 'd')
const isNight = (): boolean => {
	const hours = new Date().getHours();
	return hours >= 18 || hours < 6;
};

/**
 * Gets the appropriate icon code based on weather code and time of day
 */
const getIconCode = (weatherCode: number): string => {
	const iconBase = weatherIconMap[weatherCode] || '01d'; // Default to clear if unknown
	return isNight() ? iconBase.replace('d', 'n') : iconBase;
};

/**
 * Fetches realtime weather data from Tomorrow.io API
 */
export const fetchRealtimeWeather = async (lat: number, lon: number): Promise<Weather> => {
	try {
		const response = await fetch(
			`${BASE_URL}/realtime?location=${lat},${lon}&units=imperial&apikey=${API_KEY}`,
			{
				method: 'GET',
				headers: {
					accept: 'application/json',
					'accept-encoding': 'deflate, gzip, br'
				}
			}
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch weather data: ${response.status}`);
		}

		const data = await response.json() as TomorrowIoRealtimeResponse;
		
		// Convert the Tomorrow.io response to our Weather format
		const weatherCode = data.data.values.weatherCode;
		const weather: Weather = {
			location: data.location.name || `${data.location.lat.toFixed(2)}, ${data.location.lon.toFixed(2)}`,
			temperature: Math.round(data.data.values.temperature),
			conditions: weatherCodeMap[weatherCode] || 'Unknown',
			icon: getIconCode(weatherCode),
			high: Math.round(data.data.values.temperatureApparent + 5), // Approximation
			low: Math.round(data.data.values.temperatureApparent - 5), // Approximation
			windSpeed: Math.round(data.data.values.windSpeed),
			humidity: Math.round(data.data.values.humidity),
			fetchedAt: new Date().toISOString(),
			timezone: '0', // Tomorrow.io doesn't provide timezone in realtime response
			coordinates: {
				lat: data.location.lat,
				lon: data.location.lon,
			},
		};
		
		return weather;
	} catch (error) {
		console.error('Error fetching weather data:', error);
		throw error;
	}
};

/**
 * Converts temperature from Fahrenheit to Celsius
 */
export const convertToCelsius = (fahrenheit: number): number => {
	return Math.round((fahrenheit - 32) * 5 / 9);
};

/**
 * Gets the appropriate weather icon URL from the icon code
 * Note: We're reusing the same icon system as before
 */
export const getWeatherIconUrl = (iconCode: string): string => {
	return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
