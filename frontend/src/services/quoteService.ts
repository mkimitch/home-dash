import { Quote } from '../types';

/**
 * Fetches a random inspirational quote from the Quotable API
 * @returns Promise<Quote>
 */
export const fetchRandomQuote = async (): Promise<Quote> => {
	try {
		const response = await fetch('http://api.quotable.io/quotes/random?tags=inspirational|wisdom|happiness&limit=1');
		
		if (!response.ok) {
			throw new Error('Failed to fetch quote');
		}
		
		// Assert the response as Quote[]
		const data = await response.json() as Quote[];

		// Convert the API response to our Quote format
		// The API returns an array with a single quote when using /quotes/random
		const quoteData = data[0];
		const quote: Quote = {
			_id: quoteData._id,
			author: quoteData.author,
			authorSlug: quoteData.authorSlug,
			content: quoteData.content,
			date: quoteData.date,
			dateAdded: quoteData.dateAdded,
			dateModified: quoteData.dateModified,
			length: quoteData.length,
			tags: quoteData.tags,
		};
		
		return quote;
	} catch (error) {
		console.error('Error fetching quote:', error);
		
		// Fallback to a default quote if API fails
		return {
			_id: 'default-quote',
			author: 'Abraham Lincoln',
			authorSlug: 'abraham-lincoln',
			content: 'The best way to predict the future is to create it.',
			date: new Date().toISOString(),
			dateAdded: new Date().toISOString(),
			dateModified: new Date().toISOString(),
			length: 91,
			tags: ['Default Quote'],
		};
	}
};
