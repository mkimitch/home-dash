import { forwardRef, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Input component props
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: string;
	label?: string;
	helpText?: string;
	leadingIcon?: React.ReactNode;
	trailingIcon?: React.ReactNode;
}

/**
 * Accessible input component with various styling options
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{ className, label, error, helpText, leadingIcon, trailingIcon, id, ...props },
		ref
	) => {
		// Generate a unique ID if not provided
		const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
		
		const errorId = error ? `${inputId}-error` : undefined;
		const helpTextId = helpText ? `${inputId}-helpText` : undefined;
		const descriptionId = [errorId, helpTextId].filter(Boolean).join(' ');
		
		return (
			<div className='w-full'>
				{label && (
					<label
						htmlFor={inputId}
						className='mb-1.5 block text-sm font-medium text-white'
					>
						{label}
					</label>
				)}
				
				<div className='relative'>
					{leadingIcon && (
						<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
							{leadingIcon}
						</div>
					)}
					
					<input
						id={inputId}
						className={twMerge(
							'flex h-10 w-full rounded-md border border-white/20 bg-dark-200 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-50',
							leadingIcon && 'pl-10',
							trailingIcon && 'pr-10',
							error && 'border-red-500 focus:ring-red-500',
							className
						)}
						aria-invalid={error ? true : undefined}
						aria-describedby={descriptionId || undefined}
						ref={ref}
						{...props}
					/>
					
					{trailingIcon && (
						<div className='absolute inset-y-0 right-0 flex items-center pr-3'>
							{trailingIcon}
						</div>
					)}
				</div>
				
				{/* Error message */}
				{error && (
					<p id={errorId} className='mt-1 text-sm text-red-500' role='alert'>
						{error}
					</p>
				)}
				
				{/* Help text */}
				{!error && helpText && (
					<p id={helpTextId} className='mt-1 text-sm text-gray-400'>
						{helpText}
					</p>
				)}
			</div>
		);
	}
);
