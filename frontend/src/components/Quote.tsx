import { JSX, useEffect, useState } from 'react';

import { Button } from './ui/Button';
import { FiRefreshCw } from 'react-icons/fi';
import { useDailyQuoteStore } from '../stores/quoteStore';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Quote component displays an inspirational quote with typewriter animation
 */
const Quote = (): JSX.Element => {
	const { dailyQuote, fetchDailyQuote, isLoading } = useDailyQuoteStore();
	const { settings } = useSettingsStore();
	const { showQuotes } = settings;
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const [displayedText, setDisplayedText] = useState<string>('');
	const [showFullQuote, setShowFullQuote] = useState<boolean>(false);
	
	// Handle typewriter animation effect
	useEffect(() => {
		if (!showQuotes || !dailyQuote?.content || isTyping || showFullQuote) return;
		
		// Reset and start new animation when quote changes
		setDisplayedText('');
		setIsTyping(true);
		
		// Type each character with a delay
		let index = 0;
		const text = dailyQuote.content;
		const typingInterval = setInterval(() => {
			if (index < text.length) {
				setDisplayedText(prev => prev + text.charAt(index));
				index++;
			} else {
				clearInterval(typingInterval);
				setIsTyping(false);
			}
		}, 50); // Speed of typewriter effect
		
		return () => {
			clearInterval(typingInterval);
		};
	}, [dailyQuote?.content, showQuotes, isTyping, showFullQuote]);
	
	// Skip animation and show full quote when clicked
	const handleSkipAnimation = (): void => {
		if (dailyQuote?.content) {
			setShowFullQuote(true);
			setDisplayedText(dailyQuote.content);
			setIsTyping(false);
		}
	};
	
	// Handle refreshing the quote
	const handleRefresh = (): void => {
		setShowFullQuote(false);
		void fetchDailyQuote(); // Force refresh
	};
	
	if (!showQuotes) return <></>;
	
	return (
		<div className='w-full max-w-2xl mx-auto mb-4 text-center'>
			<div 
				className='relative min-h-[80px] p-4 flex flex-col items-center justify-center'
				aria-live='polite'
			>
				{isLoading ? (
					<p className='text-white/70 animate-pulse'>Loading quote...</p>
				) : (
					<>
						{dailyQuote ? (
							<div className='flex flex-col items-center'>
								{/* Quote content with typewriter effect */}
								<button className={`text-white/90 text-lg sm:text-xl font-light italic mb-2 ${!showFullQuote && 'cursor-pointer'}`} onClick={handleSkipAnimation} tabIndex={0} aria-label='Skip animation and show full quote' onKeyDown={handleSkipAnimation}>
									{/* Show typewriter cursor only during animation */}
									<span>"{displayedText}</span>
									{isTyping && <span className='animate-typewriter-cursor'>|</span>}
									{displayedText.length > 0 && <span>"</span>}
								</button>
								
								{/* Author attribution with fade-in effect */}
								{(showFullQuote || displayedText === dailyQuote.content) && (
									<p className='text-white/70 text-sm sm:text-base animate-fade-in'>
										― {dailyQuote.author || 'Unknown'}
									</p>
								)}
							</div>
						) : (
							<p className='text-white/70'>No quote available</p>
						)}
					</>
				)}
				
				{/* Refresh button */}
				<Button
					onClick={handleRefresh}
					variant='ghost'
					size='sm'
					className='absolute top-0 right-0 rounded-full p-1 text-white/50 hover:text-white hover:bg-white/10'
					aria-label='Get new quote'
					disabled={isLoading}
				>
					<FiRefreshCw 
						size={16} 
						className={isLoading ? 'animate-spin' : ''} 
					/>
				</Button>
			</div>
		</div>
	);
};

export default Quote;
