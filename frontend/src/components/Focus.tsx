import { ChangeEvent, JSX, KeyboardEvent, useEffect, useRef, useState } from 'react';

import { Button } from './ui/Button';
import { FiCheck } from 'react-icons/fi';
import { useFocusStore } from '../stores/focusStore';

/**
 * Focus component for setting and tracking the user's main focus for the day
 */
const Focus = (): JSX.Element => {
	const { focusTask, setFocusTask, toggleComplete, clearFocus, resetFocusIfNewDay } = useFocusStore();
	const [newFocusText, setNewFocusText] = useState<string>('');
	const [isEditing, setIsEditing] = useState<boolean>(!focusTask);
	const inputRef = useRef<HTMLInputElement>(null);

	// Check if we need to reset the focus on a new day
	useEffect(() => {
		resetFocusIfNewDay();
	}, [resetFocusIfNewDay]);

	/**
	 * Handles input change in the focus text field
	 */
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setNewFocusText(e.target.value);
	};

	/**
	 * Handles keyboard input in the focus text field
	 */
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === 'Enter' && newFocusText.trim()) {
			setFocusTask(newFocusText.trim());
			setNewFocusText('');
			setIsEditing(false);
		} else if (e.key === 'Escape') {
			setIsEditing(false);
			setNewFocusText('');
		}
	};

	/**
	 * Handles saving the focus task
	 */
	const handleSave = (): void => {
		if (newFocusText.trim()) {
			setFocusTask(newFocusText.trim());
			setNewFocusText('');
			setIsEditing(false);
		}
	};

	/**
	 * Starts editing the focus task
	 */
	const handleStartEditing = (): void => {
		setIsEditing(true);
		if (focusTask) {
			setNewFocusText(focusTask.text);
		}
	};

	return (
		<div className='relative max-w-lg w-full mx-auto mt-4 px-4'>
			<div className='text-center'>
				<h2 className='text-lg font-medium text-white/90 mb-2'>Today's Focus</h2>
				
				{isEditing ? (
					<div className='flex items-center space-x-2'>
						<input
							aria-label='Set your focus for today'
							className='w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 backdrop-blur-sm'
							onChange={handleInputChange}
							onFocus={(e) => e.target.select()}
							onKeyDown={handleKeyDown}
							placeholder="What's your main focus for today?"
							ref={inputRef}
							type='text'
							value={newFocusText}
						/>
						
						<Button 
							aria-label='Save focus'
							className='min-w-[4rem]'
							disabled={!newFocusText.trim()}
							onClick={handleSave}
							variant='primary'
						>
							<FiCheck size={18} />
						</Button>
					</div>
				) : focusTask ? (
					<div className='flex flex-col items-center'>
						<button
							aria-label={`${focusTask.completed ? 'Mark as incomplete' : 'Mark as complete'}: ${focusTask.text}`}
							className={`text-xl px-2 py-1 rounded-md hover:bg-white/10 ${
								focusTask.completed ? 'line-through text-white/70' : 'text-white'
							}`}
							onClick={() => toggleComplete()}
						>
							{focusTask.text}
						</button>
						
						<div className='flex items-center space-x-4 mt-3'>
							<button
								aria-label='Edit focus'
								className='text-sm text-white/70 hover:text-white underline underline-offset-2'
								onClick={() => handleStartEditing()}
							>
								Edit
							</button>
							
							<button
								aria-label='Clear focus'
								className='text-sm text-white/70 hover:text-white underline underline-offset-2'
								onClick={() => clearFocus()}
							>
								Clear
							</button>
							
							<button
								aria-label={focusTask.completed ? 'Mark as incomplete' : 'Mark as complete'}
								className={`text-sm ${
									focusTask.completed ? 'text-primary-400' : 'text-white/70'
								} hover:text-primary-300`}
								onClick={() => toggleComplete()}
							>
								{focusTask.completed ? 'Completed' : 'Complete'}
							</button>
						</div>
					</div>
				) : (
					<button
						aria-label='Set your focus for today'
						onClick={() => setIsEditing(true)}
						className='px-4 py-2 rounded-md bg-white/10 text-white/80 hover:bg-white/20 transition-colors'
					>
						What's your main focus for today?
					</button>
				)}
			</div>
		</div>
	);
};

export default Focus;
