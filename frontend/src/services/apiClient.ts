import axios from 'axios';

// Create base axios instance for API requests
const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('auth_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle specific error cases
		if (error.response?.status === 401) {
			// Handle unauthorized (e.g., redirect to login)
			localStorage.removeItem('auth_token');
		}
		
		return Promise.reject(error);
	}
);

export default apiClient;
