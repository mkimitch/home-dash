import { JSX, useEffect, useState } from 'react';

import { getGreetingByTime } from '../utils/dateUtils';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Greeting component that displays a time-appropriate greeting with the user's name
 */
const Greeting = (): JSX.Element => {
	const { settings } = useSettingsStore();
	const { userName } = settings;
	const [greeting, setGreeting] = useState<string>(getGreetingByTime());

	useEffect(() => {
		// Update greeting every hour
		const updateGreeting = (): void => {
			setGreeting(getGreetingByTime());
		};

		// Initial update
		updateGreeting();

		// Set up interval to update greeting every hour
		const intervalId = setInterval(updateGreeting, 60 * 60 * 1000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className='mt-3 mb-6 text-shadow text-3xl font-light text-white md:text-4xl'>
			{userName ? `${greeting}, ${userName}` : greeting}
		</div>
	);
};

export default Greeting;
