import { useEffect, useState } from 'react';

import Background from './components/Background';
import Bookmarks from './components/Bookmarks';
import Clock from './components/Clock';
import Focus from './components/Focus';
import Greeting from './components/Greeting';
import Layout from './components/Layout';
import Quote from './components/Quote';
import Settings from './components/Settings';
import { Toaster } from 'react-hot-toast';
import TodoList from './components/TodoList';
import Weather from './components/Weather';
import { useBackgroundStore } from './stores/backgroundStore';
import { useDailyQuoteStore } from './stores/quoteStore';
import { useSettingsStore } from './stores/settingsStore';
import { useWeatherStore } from './stores/weatherStore';

/**
 * Main App component that renders the dashboard
 */
const App = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { fetchSettings } = useSettingsStore();
	const { fetchDailyQuote } = useDailyQuoteStore();
	const { fetchNewBackground } = useBackgroundStore();
	const { fetchWeather } = useWeatherStore();

	// Initialize app state from local storage or defaults
	useEffect(() => {
		const initializeApp = async () => {
			// Load user settings from localStorage/API
			await fetchSettings?.();
			
			// Fetch daily quote
			await fetchDailyQuote?.();
			
			// Fetch background image if needed
			await fetchNewBackground?.();
			
			// Initialize weather data
			await fetchWeather?.();
			
			// Finish loading
			setIsLoading(false);
		};
		
		void initializeApp();
		
		// Add event listener for keyboard shortcuts
		const handleKeyPress = (e: KeyboardEvent) => {
			// Alt+S to open settings
			if (e.altKey && e.key === 's') {
				useSettingsStore.getState().toggleSettingsOpen();
			}
		};
		
		window.addEventListener('keydown', handleKeyPress);
		
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [fetchSettings, fetchDailyQuote, fetchNewBackground, fetchWeather]);

	// Apply theme class to html element
	useEffect(() => {
		const root = document.documentElement;
		if (useSettingsStore.getState().settings.theme === 'dark') {
			root.classList.add('dark');
		} else if (useSettingsStore.getState().settings.theme === 'light') {
			root.classList.remove('dark');
		} else {
			// System preference
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			if (prefersDark) {
				root.classList.add('dark');
			} else {
				root.classList.remove('dark');
			}
		}
	}, []);

	if (isLoading) {
		return (
			<div className='flex h-screen w-screen items-center justify-center bg-dark-100'>
				<div className='animate-pulse text-2xl font-light text-white'>Loading...</div>
			</div>
		);
	}

	return (
		<>
			<Layout
				// Weather in top right
				topRight={<Weather />}
				
				// Clock, greeting and focus in center
				center={
					<div className='flex flex-col items-center justify-center text-center'>
						<Clock />
						<Greeting />
						<Focus />
					</div>
				}
				
				// Quote at bottom center
				bottomCenter={<Quote />}
				
				// Todo list at bottom right
				bottomRight={<TodoList />}
				
				// Bookmarks at bottom
				bottomLeft={<Bookmarks />}
			>
				{/* Background as full-screen layer */}
				<Background />
			</Layout>
			
			{/* Settings accessible from anywhere */}
			{/* Settings modal */}
			<Settings />

			{/* Toast notifications */}
			<Toaster 
				position='bottom-center'
				toastOptions={{
					className: 'bg-dark-200 text-white border border-white/10',
					duration: 4000,
				}}
			/>
		</>
	);
};

export default App;
