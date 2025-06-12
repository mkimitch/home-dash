/// <reference types="vite/client" />

interface ImportMeta {
	readonly env: {
		readonly [key: string]: string | boolean | undefined;
		readonly VITE_TOMORROW_IO_API_KEY: string;
		readonly MODE: string;
		readonly DEV: boolean;
		readonly PROD: boolean;
		readonly SSR: boolean;
	}
}
