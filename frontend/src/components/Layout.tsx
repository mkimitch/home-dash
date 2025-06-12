import { JSX, ReactNode } from 'react';

/**
 * Layout component props
 */
interface LayoutProps {
	bottomCenter?: ReactNode;
	bottomLeft?: ReactNode;
	bottomRight?: ReactNode;
	center?: ReactNode;
	centerLeft?: ReactNode;
	centerRight?: ReactNode;
	children?: ReactNode;
	topCenter?: ReactNode;
	topLeft?: ReactNode;
	topRight?: ReactNode;
}

/**
 * Layout component arranges dashboard elements in a responsive grid
 */
const Layout = ({
	bottomCenter,
	bottomLeft,
	bottomRight,
	center,
	centerLeft,
	centerRight,
	children,
	topCenter,
	topLeft,
	topRight,
}: LayoutProps): JSX.Element => {
	return (
		<div className='relative w-full h-full min-h-screen flex flex-col overflow-hidden'>
			{/* Background content */}
			<div className='absolute inset-0 z-0'>{children}</div>
			
			{/* Main content grid */}
			<div className='relative z-10 w-full h-full min-h-screen grid grid-cols-3 grid-rows-3 p-4'>
				{/* Top row */}
				<div className='flex items-start justify-start'>
					{topLeft}
				</div>
				<div className='flex items-start justify-center'>
					{topCenter}
				</div>
				<div className='flex items-start justify-end'>
					{topRight}
				</div>
				
				{/* Center row */}
				<div className='flex items-center justify-start'>
					{centerLeft}
				</div>
				<div className='flex items-center justify-center'>
					{center}
				</div>
				<div className='flex items-center justify-end'>
					{centerRight}
				</div>
				
				{/* Bottom row */}
				<div className='flex items-end justify-start'>
					{bottomLeft}
				</div>
				<div className='flex items-end justify-center'>
					{bottomCenter}
				</div>
				<div className='flex items-end justify-end'>
					{bottomRight}
				</div>
			</div>
		</div>
	);
};

export default Layout;
