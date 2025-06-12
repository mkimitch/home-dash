import { JSX, useState } from 'react';

import { Button } from './ui/Button';
import { FiSettings } from 'react-icons/fi';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { Switch } from './ui/Switch';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Settings component for customizing the dashboard
 */
const Settings = (): JSX.Element => {
	const {
		isSettingsOpen,
		resetSettings,
		toggleSettingsOpen,
		updateSettings,
		settings,
	} = useSettingsStore();

	// Destructure settings for easier access
	const {
		showBookmarks,
		showQuotes,
		showSeconds,
		showTodos,
		showWeather,
		temperatureUnit,
		timeFormat,
		userName,
	} = settings;

	// Local state for form values
	const [name, setName] = useState<string>(userName || '');
	
	/**
	 * Handles saving settings changes
	 */
	const handleSave = (): void => {
		updateSettings({
			userName: name.trim(),
		});
		toggleSettingsOpen();
	};
	
	/**
	 * Handles toggling a boolean setting
	 */
	const handleToggle = (setting: string, value: boolean): void => {
		updateSettings({ [setting]: value });
	};
	
	/**
	 * Handles changing time format 
	 */
	const handleTimeFormatChange = (format: '12h' | '24h'): void => {
		updateSettings({ timeFormat: format });
	};
	
	/**
	 * Handles changing temperature unit
	 */
	const handleTemperatureUnitChange = (unit: 'celsius' | 'fahrenheit'): void => {
		updateSettings({ temperatureUnit: unit });
	};
	
	/**
	 * Resets all settings to defaults
	 */
	const handleResetSettings = (): void => {
		// Confirm with the user before resetting
		if (window.confirm('Reset all settings to default values?')) {
			resetSettings();
			setName('');
		}
	};
	
	return (
		<>
			{/* Settings toggle button */}
			<button
				onClick={toggleSettingsOpen}
				className='fixed bottom-4 left-4 p-2 rounded-full bg-dark-200/50 text-white/70 hover:text-white hover:bg-dark-200/70 z-50 transition-colors'
				aria-label='Open settings'
			>
				<FiSettings size={20} />
			</button>
			
			{/* Settings modal */}
			<Modal
				isOpen={isSettingsOpen}
				onClose={toggleSettingsOpen}
				title='Dashboard Settings'
				size='md'
			>
				<div className='space-y-6'>
					{/* Personal section */}
					<div>
						<h3 className='text-sm font-medium text-white/90 mb-3'>Personalization</h3>
						<div className='space-y-4'>
							<Input
								label='Your Name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='Enter your name'
							/>
						</div>
					</div>
					
					{/* Appearance section */}
					<div>
						<h3 className='text-sm font-medium text-white/90 mb-3'>Appearance</h3>
						<div className='space-y-3'>
							<div className='flex flex-col space-y-2'>
								<span className='text-sm text-white/80'>Time Format</span>
								<div className='flex space-x-3'>
									<label className='flex items-center'>
										<input
											type='radio'
											checked={timeFormat === '12h'}
											onChange={() => handleTimeFormatChange('12h')}
											className='sr-only'
										/>
										<div className={`px-3 py-1 rounded ${
											timeFormat === '12h'
												? 'bg-primary-500 text-white'
												: 'bg-white/10 text-white/70'
										}`}>
											12-hour
										</div>
									</label>
									<label className='flex items-center'>
										<input
											type='radio'
											checked={timeFormat === '24h'}
											onChange={() => handleTimeFormatChange('24h')}
											className='sr-only'
										/>
										<div className={`px-3 py-1 rounded ${
											timeFormat === '24h'
												? 'bg-primary-500 text-white'
												: 'bg-white/10 text-white/70'
										}`}>
											24-hour
										</div>
									</label>
								</div>
							</div>
							
							<div className='flex flex-col space-y-2'>
								<span className='text-sm text-white/80'>Temperature Unit</span>
								<div className='flex space-x-3'>
									<label className='flex items-center'>
										<input
											type='radio'
											checked={temperatureUnit === 'celsius'}
											onChange={() => handleTemperatureUnitChange('celsius')}
											className='sr-only'
										/>
										<div className={`px-3 py-1 rounded ${
											temperatureUnit === 'celsius'
												? 'bg-primary-500 text-white'
												: 'bg-white/10 text-white/70'
										}`}>
											Celsius
										</div>
									</label>
									<label className='flex items-center'>
										<input
											type='radio'
											checked={temperatureUnit === 'fahrenheit'}
											onChange={() => handleTemperatureUnitChange('fahrenheit')}
											className='sr-only'
										/>
										<div className={`px-3 py-1 rounded ${
											temperatureUnit === 'fahrenheit'
												? 'bg-primary-500 text-white'
												: 'bg-white/10 text-white/70'
										}`}>
											Fahrenheit
										</div>
									</label>
								</div>
							</div>
						</div>
					</div>
					
					{/* Widgets section */}
					<div>
						<h3 className='text-sm font-medium text-white/90 mb-3'>Widgets</h3>
						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-white/80'>Weather</span>
								<Switch
									checked={showWeather}
									onChange={(checked) => handleToggle('showWeather', checked)}
								/>
							</div>
							
							<div className='flex items-center justify-between'>
								<span className='text-sm text-white/80'>Show Seconds in Clock</span>
								<Switch
									checked={showSeconds}
									onChange={(checked) => handleToggle('showSeconds', checked)}
								/>
							</div>
							
							<div className='flex items-center justify-between'>
								<span className='text-sm text-white/80'>Quote</span>
								<Switch
									checked={showQuotes}
									onChange={(checked) => handleToggle('showQuotes', checked)}
								/>
							</div>
							
							<div className='flex items-center justify-between'>
								<span className='text-sm text-white/80'>Todo List</span>
								<Switch
									checked={showTodos}
									onChange={(checked) => handleToggle('showTodos', checked)}
								/>
							</div>
							
							<div className='flex items-center justify-between'>
								<span className='text-sm text-white/80'>Bookmarks</span>
								<Switch
									checked={showBookmarks}
									onChange={(checked) => handleToggle('showBookmarks', checked)}
								/>
							</div>
						</div>
					</div>
					
					{/* Action buttons */}
					<div className='flex items-center justify-between pt-4 border-t border-white/10'>
						<Button
							variant='ghost'
							onClick={handleResetSettings}
							className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
						>
							Reset to Default
						</Button>
						
						<div className='flex space-x-3'>
							<Button
								variant='ghost'
								onClick={toggleSettingsOpen}
							>
								Cancel
							</Button>
							
							<Button
								onClick={handleSave}
							>
								Save Changes
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default Settings;
