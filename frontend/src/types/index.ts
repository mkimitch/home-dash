/**
 * Common types used across the application
 */

export interface User {
	createdAt: string;
	email: string;
	id: string;
	name: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type TimeFormat = '12h' | '24h';
export type BackgroundSource = 'unsplash' | 'user';

export interface Settings {
	backgroundSource: BackgroundSource;
	showBookmarks: boolean;
	showFocus: boolean;
	showQuotes: boolean;
	showSeconds: boolean;
	showTodos: boolean;
	showWeather: boolean;
	temperatureUnit: TemperatureUnit;
	theme: ThemeMode;
	timeFormat: TimeFormat;
	userName: string;
}

export interface Todo {
	completed: boolean;
	createdAt: string;
	id: string;
	syncedToCloud?: boolean;
	text: string;
	updatedAt: string;
}

export interface FocusTask {
	completed: boolean;
	date: string;
	id: string;
	text: string;
}

export interface Bookmark {
	createdAt: string;
	favicon?: string;
	id: string;
	title: string;
	updatedAt: string;
	url: string;
}

export interface BackgroundImage {
	blur_hash: string;
	color: string;
	created_at: string;
	description: string;
	exif: {
		aperture: string;
		exposure_time: string;
		focal_length: string;
		iso: number;
		make: string;
		model: string;
	};
	height: number;
	id: string;
	location: {
		city: string;
		country: string;
		name: string;
		position: { latitude: number; longitude: number; };
	};
	urls: {
		full: string;
		thumb: string;
	};
	user: {
		name: string;
		portfolio_url: string;
		username: string;
	};
	width: number;
}

export interface Quote {
	_id: string;
	author: string;
	authorSlug: string;
	content: string;
	date: string;
	dateAdded: string;
	dateModified: string;
	length: number;
	tags: string[];
}

export interface Weather {
	conditions: string;
	coordinates: {
		lat: number;
		lon: number;
	};
	fetchedAt: string;
	high: number;
	humidity: number;
	icon: string;
	location: string;
	low: number;
	temperature: number;
	timezone: string;
	windSpeed: number;
}
