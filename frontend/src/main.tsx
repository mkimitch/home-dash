import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register service worker for PWA
const updateSW = registerSW({
	onNeedRefresh() {
		// You can show a UI prompt here if needed
		if (
			window.confirm(
				'New content available. Reload to update?'
			)
		) {
			updateSW(true);
		}
	},
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
