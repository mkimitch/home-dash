/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				primary: {
					50: "#f0f9ff",
					100: "#e0f2fe",
					200: "#bae6fd",
					300: "#7dd3fc",
					400: "#38bdf8",
					500: "#0ea5e9",
					600: "#0284c7",
					700: "#0369a1",
					800: "#075985",
					900: "#0c4a6e",
					950: "#082f49",
				},
				dark: {
					100: "#0f172a", // slate-900
					200: "#1e293b", // slate-800 
					300: "#334155", // slate-700
				}
			},
			animation: {
				'typewriter': 'typing 3.5s steps(40, end), blink-caret .75s step-end infinite',
				'fade-in': 'fade-in 1.5s ease-in-out',
			},
			keyframes: {
				typing: {
					'from': { width: '0' },
					'to': { width: '100%' }
				},
				'blink-caret': {
					'from, to': { borderColor: 'transparent' },
					'50%': { borderColor: 'currentColor' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				}
			},
		},
	},
	plugins: [],
	darkMode: 'class',
}
