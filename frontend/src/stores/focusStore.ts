import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FocusTask } from '../types';
import { generateId } from '../utils/idUtils';
import { isSameDay } from '../utils/dateUtils';

interface FocusState {
	// State
	focusTask: FocusTask | null;
	
	// Actions
	setFocusTask: (text: string) => void;
	toggleComplete: () => void;
	clearFocus: () => void;
	resetFocusIfNewDay: () => void;
}

export const useFocusStore = create<FocusState>()(
	persist(
		(set, get) => ({
			// Initial state
			focusTask: null,
			
			// Actions
			setFocusTask: (text: string) => {
				const newTask: FocusTask = {
					id: generateId(),
					text,
					completed: false,
					date: new Date().toISOString(),
				};
				
				set({ focusTask: newTask });
			},
			
			toggleComplete: () => {
				const currentTask = get().focusTask;
				
				if (!currentTask) return;
				
				set({
					focusTask: {
						...currentTask,
						completed: !currentTask.completed,
					},
				});
			},
			
			clearFocus: () => {
				set({ focusTask: null });
			},
			
			resetFocusIfNewDay: () => {
				const currentTask = get().focusTask;
				
				if (!currentTask) return;
				
				// Check if the current focus task is from today
				if (!isSameDay(new Date(currentTask.date), new Date())) {
					// It's a new day, reset focus
					set({ focusTask: null });
				}
			},
		}),
		{
			name: 'momentum-focus',
		}
	)
);
