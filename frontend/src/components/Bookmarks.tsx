import { FiCheck, FiEdit2, FiMoreVertical, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';

import { Bookmark } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { JSX } from 'react/jsx-runtime';
import { Modal } from './ui/Modal';
import { useBookmarkStore } from '../stores/bookmarkStore';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Bookmarks component for managing quick links
 */
const Bookmarks = (): JSX.Element => {
	const { bookmarks, addBookmark, editBookmark, deleteBookmark } = useBookmarkStore();
	const { showBookmarks } = useSettingsStore();
	
	const [expanded, setExpanded] = useState<boolean>(true);
	const [showAddModal, setShowAddModal] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDropdown, setShowDropdown] = useState<string | null>(null);
	
	const [newTitle, setNewTitle] = useState<string>('');
	const [newURL, setNewURL] = useState<string>('');
	const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
	
	const dropdownRef = useRef<HTMLDivElement>(null);
	
	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent): void => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowDropdown(null);
			}
		};
		
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);
	
	if (!showBookmarks) return <></>;
	
	/**
	 * Validates a URL and adds http/https if missing
	 */
	const validateAndFormatURL = (url: string): string => {
		if (!url) return '';
		
		// Add protocol if missing
		if (!url.match(/^https?:\/\//i)) {
			return `https://${url}`;
		}
		
		return url;
	};
	
	/**
	 * Handles adding a new bookmark
	 */
	const handleAddBookmark = (): void => {
		if (newTitle.trim() && newURL.trim()) {
			const formattedURL = validateAndFormatURL(newURL.trim());
			addBookmark(newTitle.trim(), formattedURL);
			setNewTitle('');
			setNewURL('');
			setShowAddModal(false);
		}
	};
	
	/**
	 * Handles editing a bookmark
	 */
	const handleEditBookmark = (): void => {
		if (editingBookmark && newTitle.trim() && newURL.trim()) {
			const formattedURL = validateAndFormatURL(newURL.trim());
			editBookmark(editingBookmark.id, newTitle.trim(), formattedURL);
			setShowEditModal(false);
		}
	};
	
	/**
	 * Opens edit modal for a bookmark
	 */
	const openEditModal = (bookmark: Bookmark): void => {
		setEditingBookmark(bookmark);
		setNewTitle(bookmark.title);
		setNewURL(bookmark.url);
		setShowEditModal(true);
		setShowDropdown(null);
	};
	
	/**
	 * Gets the favicon for a URL
	 */
	const getFavicon = (url: string): string => {
		try {
			const domain = new URL(url).hostname;
			return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
		} catch (e) {
			// Return default icon if URL parsing fails
			return 'https://www.google.com/s2/favicons?domain=example.com&sz=32';
		}
	};
	
	/**
	 * Gets a display name for a URL
	 */
	const getDisplayDomain = (url: string): string => {
		try {
			const hostname = new URL(url).hostname;
			return hostname.replace(/^www\./, '');
		} catch {
			return url;
		}
	};
	
	return (
		<>
			<div className='backdrop-blur-container p-3 rounded-lg shadow-lg'>
				{/* Header */}
				<div className='flex justify-between items-center mb-3'>
					<h2 className='text-sm font-medium text-white/90'>Bookmarks</h2>
					<div className='flex items-center space-x-2'>
						<button
							onClick={() => setShowAddModal(true)}
							className='p-1 text-white/70 hover:text-white/90 hover:bg-white/10 rounded-full'
							aria-label='Add new bookmark'
						>
							<FiPlus size={16} />
						</button>
						<button
							onClick={() => setExpanded(!expanded)}
							className='p-1 text-white/70 hover:text-white/90 hover:bg-white/10 rounded-full'
							aria-label={expanded ? 'Collapse bookmarks' : 'Expand bookmarks'}
						>
							{expanded ? (
								<FiCheck size={16} />
							) : (
								<FiPlus size={16} />
							)}
						</button>
					</div>
				</div>
				
				{/* Bookmarks list */}
				{expanded && (
					<div className='flex flex-wrap gap-3'>
						{bookmarks.length > 0 ? (
							bookmarks.map((bookmark) => (
								<div key={bookmark.id} className='relative group'>
									<a 
										href={bookmark.url}
										target='_blank'
										rel='noopener noreferrer'
										className='flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors'
										aria-label={`Open ${bookmark.title}`}
									>
										<div className='w-8 h-8 mb-1 flex items-center justify-center'>
											<img 
												src={getFavicon(bookmark.url)} 
												alt='' 
												className='w-5 h-5'
												onError={(e) => {
													// Set default icon if favicon fails to load
													(e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=example.com&sz=32';
												}}
											/>
										</div>
										<span className='text-xs text-white/90 max-w-[80px] truncate'>
											{bookmark.title}
										</span>
										<span className='text-[10px] text-white/50 max-w-[80px] truncate'>
											{getDisplayDomain(bookmark.url)}
										</span>
									</a>
									
									{/* Dropdown menu button */}
									<button
										onClick={() => setShowDropdown(showDropdown === bookmark.id ? null : bookmark.id)}
										className='absolute top-0 right-0 p-1 text-white/0 group-hover:text-white/50 hover:text-white/90 hover:bg-white/10 rounded-full'
										aria-label={`Bookmark options for ${bookmark.title}`}
									>
										<FiMoreVertical size={14} />
									</button>
									
									{/* Dropdown menu */}
									{showDropdown === bookmark.id && (
										<div 
											ref={dropdownRef}
											className='absolute top-8 right-0 z-10 bg-dark-100 border border-white/10 rounded-md shadow-lg py-1 w-32'
										>
											<button
												onClick={() => openEditModal(bookmark)}
												className='flex items-center w-full px-3 py-2 text-sm text-white/90 hover:bg-white/10'
											>
												<FiEdit2 size={14} className='mr-2' />
												Edit
											</button>
											<button
												onClick={() => {
													deleteBookmark(bookmark.id);
													setShowDropdown(null);
												}}
												className='flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-white/10'
											>
												<FiTrash2 size={14} className='mr-2' />
												Delete
											</button>
										</div>
									)}
								</div>
							))
						) : (
							<div className='w-full text-center py-2'>
								<p className='text-sm text-white/50'>
									No bookmarks yet. Click the + to add one.
								</p>
							</div>
						)}
					</div>
				)}
			</div>
			
			{/* Add Bookmark Modal */}
			<Modal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				title='Add New Bookmark'
				size='sm'
			>
				<div className='space-y-4'>
					<Input
						label='Title'
						placeholder='Google'
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
					/>
					<Input
						label='URL'
						placeholder='https://google.com'
						value={newURL}
						onChange={(e) => setNewURL(e.target.value)}
						helpText='URL will be automatically formatted'
					/>
					<div className='flex justify-end space-x-3 mt-6'>
						<Button
							variant='ghost'
							onClick={() => setShowAddModal(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleAddBookmark}
							disabled={!newTitle.trim() || !newURL.trim()}
						>
							Add Bookmark
						</Button>
					</div>
				</div>
			</Modal>
			
			{/* Edit Bookmark Modal */}
			<Modal
				isOpen={showEditModal}
				onClose={() => setShowEditModal(false)}
				title='Edit Bookmark'
				size='sm'
			>
				<div className='space-y-4'>
					<Input
						label='Title'
						placeholder='Google'
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
					/>
					<Input
						label='URL'
						placeholder='https://google.com'
						value={newURL}
						onChange={(e) => setNewURL(e.target.value)}
						helpText='URL will be automatically formatted'
					/>
					<div className='flex justify-end space-x-3 mt-6'>
						<Button
							variant='ghost'
							onClick={() => setShowEditModal(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleEditBookmark}
							disabled={!newTitle.trim() || !newURL.trim()}
						>
							Save Changes
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default Bookmarks;
