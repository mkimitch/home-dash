import { Bookmark } from '../types';
import { create } from 'zustand';
import { generateId } from '@/utils/idUtils';
import { persist } from 'zustand/middleware';

interface BookmarkState {
	// State
	bookmarks: Bookmark[];
	isLoading: boolean;
	error: string | null;
	// Actions
	addBookmark: (title: string, url: string, favicon?: string) => void;
	deleteBookmark: (id: string) => void;
	editBookmark: (id: string, title: string, url: string) => void;
	fetchBookmarks: () => Promise<void>;
	reorderBookmarks: (draggedId: string, targetId: string) => void;
	syncBookmarks: () => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>()(
	persist(
		(set, get) => ({
			// Initial state
			bookmarks: [],
			isLoading: false,
			error: null,
			
			// Actions
			addBookmark: (title: string, url: string, favicon?: string) => {
				// Ensure URL has proper format
				const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
				
				// Default favicon if not provided
				const defaultFavicon = favicon || `https://www.google.com/s2/favicons?domain=${formattedUrl}&sz=32`;
				
				const newBookmark: Bookmark = {
					id: generateId(),
					title,
					url: formattedUrl,
					favicon: defaultFavicon,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				
				set((state) => ({ 
					bookmarks: [...state.bookmarks, newBookmark]
				}));
			},
			
			deleteBookmark: (id: string) => {
				set((state) => ({
					bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
				}));
			},
			
			editBookmark: (id: string, title: string, url: string) => {
				// Ensure URL has proper format
				const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
				
				set((state) => ({
					bookmarks: state.bookmarks.map((bookmark) => 
						bookmark.id === id
							? { 
								...bookmark, 
								title,
								url: formattedUrl,
								favicon: `https://www.google.com/s2/favicons?domain=${formattedUrl}&sz=32`,
								updatedAt: new Date().toISOString(),
							}
							: bookmark
					),
				}));
			},
			
			fetchBookmarks: async () => {
				// In a real app, this would fetch bookmarks from an API
				// For now, we rely on the persisted store
				set({ isLoading: true, error: null });
				
				try {
					// If we had a backend:
					// const response = await api.getBookmarks();
					// set({ bookmarks: response.data, isLoading: false });
					
					// Simulate API call
					await new Promise((resolve) => setTimeout(resolve, 100));
					set({ isLoading: false });
				} catch (error) {
					console.error('Failed to fetch bookmarks:', error);
					set({ 
						error: 'Failed to fetch bookmarks', 
						isLoading: false 
					});
				}
			},
			
			reorderBookmarks: (draggedId: string, targetId: string) => {
				const bookmarks = [...get().bookmarks];
				const draggedIndex = bookmarks.findIndex((b) => b.id === draggedId);
				const targetIndex = bookmarks.findIndex((b) => b.id === targetId);
				
				if (draggedIndex === -1 || targetIndex === -1) {
					return; // Invalid IDs
				}
				
				// Remove dragged item and insert at target position
				const [draggedItem] = bookmarks.splice(draggedIndex, 1);
				bookmarks.splice(targetIndex, 0, draggedItem);
				
				set({ bookmarks });
			},
			
			syncBookmarks: async () => {
				// In a real app, this would sync bookmarks with the API
				set({ isLoading: true, error: null });
				
				try {
					// If we had a backend:
					// const bookmarks = get().bookmarks;
					// await api.syncBookmarks(bookmarks);
					
					set({ isLoading: false });
				} catch (error) {
					console.error('Failed to sync bookmarks:', error);
					set({ 
						error: 'Failed to sync bookmarks', 
						isLoading: false 
					});
				}
			},
		}),
		{
			name: 'momentum-bookmarks',
		}
	)
);
