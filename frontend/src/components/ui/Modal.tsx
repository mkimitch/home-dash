import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

/**
 * Modal component props
 */
interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	children: ReactNode;
	className?: string;
	initialFocus?: React.MutableRefObject<HTMLElement | null>;
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Accessible modal component using Headless UI
 */
export function Modal({
	isOpen,
	onClose,
	title,
	description,
	children,
	className,
	initialFocus,
	size = 'md',
}: ModalProps) {
	// Dynamically set width based on size prop
	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
	};

	return (
		<Transition show={isOpen} as={Fragment}>
			<Dialog
				initialFocus={initialFocus}
				as='div'
				className='relative z-50'
				onClose={onClose}
				static
			>
				{/* Backdrop */}
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/70' />
				</Transition.Child>

				{/* Modal container */}
				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel
								className={twMerge(
									'w-full transform overflow-hidden rounded-lg bg-dark-200 border border-white/10 p-6 text-left align-middle shadow-xl transition-all',
									sizeClasses[size],
									className
								)}
							>
								{title && (
									<Dialog.Title
										as='h3'
										className='text-lg font-semibold leading-6 text-white'
									>
										{title}
									</Dialog.Title>
								)}

								{description && (
									<Dialog.Description className='mt-2 text-sm text-gray-300'>
										{description}
									</Dialog.Description>
								)}

								<div className={title || description ? 'mt-4' : ''}>{children}</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
