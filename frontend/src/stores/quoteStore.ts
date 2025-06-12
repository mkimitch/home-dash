import { Quote } from '../types';
import { create } from 'zustand';
import { fetchRandomQuote } from '../services/quoteService';
import { isSameDay } from '../utils/dateUtils';
import { persist } from 'zustand/middleware';

interface QuoteState {
	// State
	dailyQuote: Quote | null;
	error: string | null;
	isLoading: boolean;
	
	// Actions
	fetchDailyQuote: () => Promise<void>;
	refreshQuote: () => Promise<void>;
}

export const useDailyQuoteStore = create<QuoteState>()(
	persist(
		(set, get) => ({
			// Initial state
			dailyQuote: null,
			isLoading: false,
			error: null,
			
			// Actions
			fetchDailyQuote: async () => {
				const current = get().dailyQuote;
				
				// Check if we should fetch a new quote (new day or no quote)
				if (current && isSameDay(new Date(current.date), new Date())) {
					// Still valid for today, don't fetch a new one
					return;
				}
				
				set({ isLoading: true, error: null });
				
				try {
					const newQuote = await fetchRandomQuote();
					set({ 
						dailyQuote: {
							...newQuote,
							date: new Date().toISOString()
						},
						isLoading: false 
					});
				} catch (error) {
					console.error('Failed to fetch quote:', error);
					set({ 
						error: 'Failed to fetch daily quote', 
						isLoading: false 
					});
				}
			},
			
			refreshQuote: async () => {
				set({ isLoading: true, error: null });
				
				try {
					const newQuote = await fetchRandomQuote();
					set({ 
						dailyQuote: {
							...newQuote,
							date: new Date().toISOString(),
						},
						isLoading: false 
					});
				} catch (error) {
					console.error('Failed to refresh quote:', error);
					set({ 
						error: 'Failed to refresh quote', 
						isLoading: false 
					});
				}
			},
		}),
		{
			name: 'momentum-quote',
		}
	)
);
