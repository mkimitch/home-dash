/**
 * Generates a unique ID for use in application objects
 * Uses a combination of timestamp and random string
 */
export const generateId = (): string => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};
