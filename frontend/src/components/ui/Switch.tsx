import { forwardRef, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Switch component props
 */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	size?: 'sm' | 'md' | 'lg';
	label?: string;
}

/**
 * Accessible toggle switch component
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
	({ checked, onChange, className, size = 'md', disabled, id, label, ...props }, ref) => {
		// Generate unique ID if not provided
		const switchId = id || `switch-${Math.random().toString(36).substring(2, 9)}`;
		
		// Define sizes
		const sizes = {
			sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translateX: 'translate-x-4' },
			md: { track: 'w-10 h-5', thumb: 'w-4 h-4', translateX: 'translate-x-5' },
			lg: { track: 'w-12 h-6', thumb: 'w-5 h-5', translateX: 'translate-x-6' },
		};
		
		// Handle change
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
			onChange?.(e.target.checked);
		};
		
		return (
			<label htmlFor={switchId} className={twMerge('inline-flex items-center', className)}>
				{label && (
					<span className='mr-3 text-sm text-white/80'>{label}</span>
				)}
				<span className='relative inline-flex items-center'>
					<input
						ref={ref}
						id={switchId}
						type='checkbox'
						className='sr-only'
						checked={checked}
						onChange={handleChange}
						disabled={disabled}
						{...props}
					/>
					<span
						className={twMerge(
							'relative rounded-full transition-colors duration-300',
							sizes[size].track,
							checked
								? 'bg-primary-500'
								: 'bg-white/20',
							disabled && 'opacity-50 cursor-not-allowed'
						)}
					>
						<span
							className={twMerge(
								'absolute top-[2px] left-[2px] rounded-full bg-white shadow-sm transition-transform duration-300',
								sizes[size].thumb,
								checked && sizes[size].translateX,
								disabled && 'opacity-80'
							)}
						/>
					</span>
				</span>
			</label>
		);
	}
);
