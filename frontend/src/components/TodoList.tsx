import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiCheck, FiTrash2, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useTodoStore } from '../stores/todoStore';
import { useSettingsStore } from '../stores/settingsStore';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Todo } from '../types';

/**
 * TodoList component for managing daily tasks
 */
const TodoList = (): JSX.Element => {
	const { 
		todos, 
		addTodo, 
		toggleTodo, 
		removeTodo, 
		updateTodoText 
	} = useTodoStore();
	const { showTodoList } = useSettingsStore();
	
	const [newTodoText, setNewTodoText] = useState<string>('');
	const [expanded, setExpanded] = useState<boolean>(true);
	const [editingTodo, setEditingTodo] = useState<string | null>(null);
	const [editText, setEditText] = useState<string>('');
	
	const inputRef = useRef<HTMLInputElement>(null);
	const editInputRef = useRef<HTMLInputElement>(null);
	
	// Focus input when editing
	useEffect(() => {
		if (editingTodo && editInputRef.current) {
			editInputRef.current.focus();
		}
	}, [editingTodo]);
	
	if (!showTodoList) return <></>;
	
	// Filter completed and active todos
	const completedTodos = todos.filter(todo => todo.completed);
	const activeTodos = todos.filter(todo => !todo.completed);
	
	// Calculate completion stats
	const totalTodos = todos.length;
	const completedCount = completedTodos.length;
	const completionPercentage = totalTodos > 0
		? Math.round((completedCount / totalTodos) * 100)
		: 0;
		
	/**
	 * Handles adding a new todo
	 */
	const handleAddTodo = (): void => {
		if (newTodoText.trim()) {
			addTodo(newTodoText.trim());
			setNewTodoText('');
			inputRef.current?.focus();
		}
	};
	
	/**
	 * Handles starting to edit a todo
	 */
	const handleStartEdit = (todo: Todo): void => {
		setEditingTodo(todo.id);
		setEditText(todo.text);
	};
	
	/**
	 * Handles saving edits to a todo
	 */
	const handleSaveEdit = (id: string): void => {
		if (editText.trim()) {
			updateTodoText(id, editText.trim());
		}
		setEditingTodo(null);
	};
	
	/**
	 * Handles canceling todo edits
	 */
	const handleCancelEdit = (): void => {
		setEditingTodo(null);
	};
	
	/**
	 * Renders an individual todo item
	 */
	const renderTodoItem = (todo: Todo): JSX.Element => (
		<li 
			key={todo.id}
			className='group flex items-center p-2 hover:bg-white/5 rounded-md transition-colors'
		>
			{editingTodo === todo.id ? (
				<div className='flex-1 flex items-center space-x-2'>
					<Input
						ref={editInputRef}
						value={editText}
						onChange={(e) => setEditText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleSaveEdit(todo.id);
							if (e.key === 'Escape') handleCancelEdit();
						}}
						className='flex-1 py-1 text-sm'
					/>
					<Button
						onClick={() => handleSaveEdit(todo.id)}
						variant='ghost'
						size='sm'
						className='p-1'
						aria-label='Save changes'
					>
						<FiCheck size={16} />
					</Button>
					<Button
						onClick={handleCancelEdit}
						variant='ghost'
						size='sm'
						className='p-1'
						aria-label='Cancel editing'
					>
						<FiX size={16} />
					</Button>
				</div>
			) : (
				<>
					<button
						onClick={() => toggleTodo(todo.id)}
						className={`flex items-center justify-center w-5 h-5 rounded border ${
							todo.completed
								? 'border-primary-400 bg-primary-400/10'
								: 'border-white/30 hover:border-white/50'
						} mr-3`}
						aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
					>
						{todo.completed && <FiCheck size={12} className='text-primary-400' />}
					</button>
					<span 
						className={`flex-1 text-sm ${todo.completed ? 'line-through text-white/60' : 'text-white/90'}`}
						onClick={() => handleStartEdit(todo)}
					>
						{todo.text}
					</span>
					<button
						onClick={() => removeTodo(todo.id)}
						className='p-1 text-white/30 hover:text-white/70 opacity-0 group-hover:opacity-100 transition-opacity'
						aria-label='Delete todo'
					>
						<FiTrash2 size={14} />
					</button>
				</>
			)}
		</li>
	);
	
	return (
		<div className='backdrop-blur-container max-w-xs w-full mx-auto p-4 rounded-lg shadow-lg'>
			{/* Header with expand/collapse button */}
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-lg font-medium text-white'>
					Todo List
				</h2>
				<button
					onClick={() => setExpanded(!expanded)}
					className='p-1 hover:bg-white/10 rounded-full'
					aria-label={expanded ? 'Collapse todo list' : 'Expand todo list'}
				>
					{expanded ? (
						<FiChevronUp size={16} className='text-white/80' />
					) : (
						<FiChevronDown size={16} className='text-white/80' />
					)}
				</button>
			</div>
			
			{/* Statistics bar */}
			<div className='flex items-center justify-between text-xs mb-3'>
				<div className='text-white/70'>
					{completedCount}/{totalTodos} completed
				</div>
				<div className='w-1/2 h-1 bg-white/20 rounded-full overflow-hidden'>
					<div 
						className='h-full bg-primary-400 transition-all duration-500'
						style={{ width: `${completionPercentage}%` }}
					/>
				</div>
			</div>
			
			{expanded && (
				<>
					{/* Add new todo input */}
					<div className='flex items-center space-x-2 mb-4'>
						<Input
							ref={inputRef}
							type='text'
							placeholder='Add new todo...'
							value={newTodoText}
							onChange={(e) => setNewTodoText(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
							leadingIcon={<FiPlus size={16} className='text-white/60' />}
							className='text-sm'
						/>
					</div>
					
					{/* Active todos */}
					{activeTodos.length > 0 && (
						<ul className='space-y-1 mb-3'>
							{activeTodos.map(renderTodoItem)}
						</ul>
					)}
					
					{/* Completed todos */}
					{completedTodos.length > 0 && (
						<>
							<h3 className='text-xs font-medium text-white/50 uppercase tracking-wider mb-1'>
								Completed
							</h3>
							<ul className='space-y-1'>
								{completedTodos.map(renderTodoItem)}
							</ul>
						</>
					)}
					
					{/* Empty state */}
					{todos.length === 0 && (
						<p className='text-center text-white/50 py-4 text-sm'>
							Add a new todo to get started
						</p>
					)}
				</>
			)}
		</div>
	);
};

export default TodoList;
