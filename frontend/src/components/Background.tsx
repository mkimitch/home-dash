import { useState, useEffect } from 'react';
import { FiRefreshCw, FiInfo } from 'react-icons/fi';
import { Button } from './ui/Button';
import { useBackgroundStore } from '../stores/backgroundStore';

/**
 * Background component displays a full-screen background image
 * and provides controls for refreshing it
 */
const Background = () => {
	const { currentBackground, isLoading, refreshBackground } = useBackgroundStore();
	const [showInfo, setShowInfo] = useState(false);
	const [imgLoaded, setImgLoaded] = useState(false);

	// Preload the image to avoid flicker
	useEffect(() => {
		if (currentBackground?.url) {
			const img = new Image();
			img.src = currentBackground.url;
			img.onload = () => setImgLoaded(true);
			
			return () => {
				img.onload = null;
			};
		}
	}, [currentBackground?.url]);

	if (!currentBackground) {
		return (
			<div className='absolute inset-0 bg-gradient-to-br from-dark-100 to-dark-300' />
		);
	}

	const handleRefresh = () => {
		void refreshBackground();
		setImgLoaded(false);
	};

	return (
		<>
			{/* Background overlay with gradient */}
			<div className='absolute inset-0 bg-black/30 z-0' />

			{/* Background image */}
			{currentBackground.url && (
				<div
					className='absolute inset-0 bg-cover bg-center transition-opacity duration-1000'
					style={{
						backgroundImage: imgLoaded ? `url(${currentBackground.url})` : 'none',
						opacity: imgLoaded ? 1 : 0,
					}}
					role='img'
					aria-label={currentBackground.altDescription}
				/>
			)}

			{/* Controls */}
			<div className='absolute bottom-4 right-4 z-10 flex items-center space-x-2'>
				{/* Image info button */}
				<Button
					variant='ghost'
					size='sm'
					className='rounded-full p-2 bg-dark-200/50 text-white hover:bg-dark-200/70'
					aria-label='Show image information'
					onClick={() => setShowInfo(!showInfo)}
				>
					<FiInfo size={18} />
				</Button>

				{/* Refresh button */}
				<Button
					variant='ghost'
					size='sm'
					className='rounded-full p-2 bg-dark-200/50 text-white hover:bg-dark-200/70'
					onClick={handleRefresh}
					disabled={isLoading}
					aria-label='Refresh background image'
				>
					<FiRefreshCw 
						size={18} 
						className={isLoading ? 'animate-spin' : ''} 
					/>
				</Button>
			</div>

			{/* Photo credit info */}
			{showInfo && currentBackground.credit && (
				<div className='absolute bottom-16 right-4 z-10 p-3 text-sm rounded-lg bg-dark-200/80 backdrop-blur-sm text-white max-w-xs'>
					<p className='font-medium'>Photo by{' '}
						<a 
							href={currentBackground.credit.profileUrl}
							target='_blank'
							rel='noopener noreferrer'
							className='text-primary-400 hover:underline'
						>
							{currentBackground.credit.name}
						</a>
					</p>
					<p className='text-gray-300 text-xs mt-1'>Via Unsplash</p>
				</div>
			)}
		</>
	);
};

export default Background;
