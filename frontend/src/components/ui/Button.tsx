import { ButtonHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Button variant types
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';

/**
 * Button size options
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
	isFullWidth?: boolean;
	leadingIcon?: React.ReactNode;
	trailingIcon?: React.ReactNode;
}

/**
 * Button component with various styles and accessibility features
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			children,
			variant = 'primary',
			size = 'md',
			isLoading = false,
			isFullWidth = false,
			disabled,
			leadingIcon,
			trailingIcon,
			type = 'button',
			...props
		},
		ref
	) => {
		// Combine styles based on variant, size, and states
		const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:pointer-events-none disabled:opacity-50';
		
		const variantStyles = {
			primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
			secondary: 'bg-dark-200 text-white hover:bg-dark-300 active:bg-dark-100',
			outline: 'border border-white/20 bg-transparent hover:bg-white/10',
			ghost: 'hover:bg-white/10',
			link: 'text-primary-400 underline-offset-4 hover:underline',
			danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
		};
		
		const sizeStyles = {
			sm: 'h-8 px-3 text-xs',
			md: 'h-10 px-4 py-2',
			lg: 'h-12 px-6 py-3 text-base',
		};
		
		const fullWidthStyles = isFullWidth ? 'w-full' : '';
		
		const classes = twMerge(
			baseStyles,
			variantStyles[variant],
			sizeStyles[size],
			fullWidthStyles,
			className
		);
		
		return (
			<button
				type={type}
				className={classes}
				disabled={disabled || isLoading}
				ref={ref}
				{...props}
			>
				{isLoading && (
					<svg
						className='mr-2 h-4 w-4 animate-spin'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						aria-hidden='true'
					>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
						></circle>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
						></path>
					</svg>
				)}
				{!isLoading && leadingIcon && <span className='mr-2'>{leadingIcon}</span>}
				{children}
				{!isLoading && trailingIcon && <span className='ml-2'>{trailingIcon}</span>}
			</button>
		);
	}
);
