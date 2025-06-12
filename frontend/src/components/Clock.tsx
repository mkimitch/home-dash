import { useEffect, useState } from 'react';

import { formatTimeString } from '../utils/dateUtils';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Clock component showing current time
 * Updates every second and respects user's time format preference
 */
const Clock = () => {
	const { settings } = useSettingsStore();
	const { timeFormat, showSeconds } = settings;
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		// Update clock every second
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	// Format time based on user preferences (12h or 24h and whether to show seconds)
	const formattedTime = formatTimeString(time, timeFormat === '24h', showSeconds);

	return (
		<div 
			className='text-center text-white select-none'
			aria-live='polite'
		>
			{/* Use tabular-nums to keep digits the same width and prevent shifting */}
			<h1 className='text-8xl sm:text-9xl font-light tabular-nums text-shadow'>{formattedTime}</h1>
		</div>
	);
};

export default Clock;
