import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo } from '../types';
import { generateId } from '../utils/idUtils';

interface TodoState {
	// State
	todos: Todo[];
	isLoading: boolean;
	error: string | null;
	
	// Actions
	addTodo: (text: string) => void;
	toggleTodo: (id: string) => void;
	editTodo: (id: string, text: string) => void;
	deleteTodo: (id: string) => void;
	fetchTodos: () => Promise<void>;
	syncTodos: () => Promise<void>;
	clearCompletedTodos: () => void;
}

export const useTodoStore = create<TodoState>()(
	persist(
		(set, _get) => ({
			// Initial state
			todos: [],
			isLoading: false,
			error: null,
			
			// Actions
			addTodo: (text: string) => {
				const newTodo: Todo = {
					id: generateId(),
					text,
					completed: false,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					syncedToCloud: false,
				};
				
				set((state) => ({ 
					todos: [...state.todos, newTodo]
				}));
			},
			
			toggleTodo: (id: string) => {
				set((state) => ({
					todos: state.todos.map((todo) => 
						todo.id === id
							? { 
								...todo, 
								completed: !todo.completed, 
								updatedAt: new Date().toISOString(),
								syncedToCloud: false,
							}
							: todo
					),
				}));
			},
			
			editTodo: (id: string, text: string) => {
				set((state) => ({
					todos: state.todos.map((todo) => 
						todo.id === id
							? { 
								...todo, 
								text, 
								updatedAt: new Date().toISOString(),
								syncedToCloud: false,
							}
							: todo
					),
				}));
			},
			
			deleteTodo: (id: string) => {
				set((state) => ({
					todos: state.todos.filter((todo) => todo.id !== id),
				}));
			},
			
			fetchTodos: async () => {
				// In a real app, this would fetch todos from an API
				// For now, we rely on the persisted store
				set({ isLoading: true, error: null });
				
				try {
					// If we had a backend:
					// const response = await api.getTodos();
					// set({ todos: response.data, isLoading: false });
					
					// Simulate API call
					await new Promise((resolve) => setTimeout(resolve, 100));
					set({ isLoading: false });
				} catch (error) {
					console.error('Failed to fetch todos:', error);
					set({ 
						error: 'Failed to fetch todos', 
						isLoading: false 
					});
				}
			},
			
			syncTodos: async () => {
				// In a real app, this would sync todos with the API
				set({ isLoading: true, error: null });
				
				try {
					// If we had a backend:
					// const todos = get().todos;
					// await api.syncTodos(todos);
					
					// Mark all todos as synced
					set((state) => ({
						todos: state.todos.map((todo) => ({
							...todo,
							syncedToCloud: true,
						})),
						isLoading: false,
					}));
				} catch (error) {
					console.error('Failed to sync todos:', error);
					set({ 
						error: 'Failed to sync todos', 
						isLoading: false 
					});
				}
			},
			
			clearCompletedTodos: () => {
				set((state) => ({
					todos: state.todos.filter((todo) => !todo.completed),
				}));
			},
		}),
		{
			name: 'momentum-todos',
		}
	)
);
