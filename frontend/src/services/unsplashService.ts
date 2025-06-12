import { BackgroundImage } from '../types';

/**
 * Fetches a random image from Unsplash API
 * @returns Promise<BackgroundImage>
 */
export const fetchUnsplashImage = async (): Promise<BackgroundImage> => {
	const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string;
	
	if (!accessKey) {
		throw new Error('Unsplash API key not configured');
	}

	// Collection IDs for nature, landscape, and architecture photos
	const collections = '1319040,317099,3694365,1263731';
	
	const response = await fetch(
		`https://api.unsplash.com/photos/random?collections=${collections}&orientation=landscape&content_filter=high`,
		{
			headers: {
				Authorization: `Client-ID ${accessKey}`,
			},
		}
	);
	
	if (!response.ok) {
		throw new Error('Failed to fetch image from Unsplash');
	}
	
	const data = await response.json() as BackgroundImage;
	
	// Convert the Unsplash response to our BackgroundImage format
	const backgroundImage: BackgroundImage = {
		blur_hash: data.blur_hash,
		color: data.color,
		created_at: data.created_at,
		description: data.description || 'Landscape background image',
		exif: data.exif,
		height: data.height,
		id: data.id,
		location: data.location,
		urls: {
			full: data.urls.full,
			thumb: data.urls.thumb
		},
		user: data.user,
		width: data.width,
	};
	
	return backgroundImage;
};
