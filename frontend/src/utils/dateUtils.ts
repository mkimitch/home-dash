import { format, isSameDay as dateFnsIsSameDay } from 'date-fns';

/**
 * Checks if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
	return dateFnsIsSameDay(date1, date2);
};

/**
 * Checks if a date is older than a specified number of milliseconds
 */
export const isOlderThan = (date: Date, milliseconds: number): boolean => {
	const now = new Date();
	return now.getTime() - date.getTime() > milliseconds;
};

/**
 * Formats a date according to specified format string
 */
export const formatDate = (date: Date, formatStr: string): string => {
	return format(date, formatStr);
};

/**
 * Gets the greeting for the current time of day
 */
export const getGreetingByTime = (date: Date = new Date()): string => {
	const hours = date.getHours();
	
	if (hours < 12) {
		return 'Good morning';
	} else if (hours < 18) {
		return 'Good afternoon';
	} else {
		return 'Good evening';
	}
};

/**
 * Format time string based on user's preferred format
 * @param date - Date object to format
 * @param is24Hour - Whether to use 24-hour format
 * @param showSeconds - Whether to include seconds in the display
 */
export const formatTimeString = (date: Date, is24Hour: boolean, showSeconds = false): string => {
	const formatStr = is24Hour 
		? (showSeconds ? 'HH:mm:ss' : 'HH:mm') 
		: (showSeconds ? 'h:mm:ss a' : 'h:mm a');
	return format(date, formatStr);
};
