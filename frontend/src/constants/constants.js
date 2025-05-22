// Always use the environment variable
export const BASE_URL = process.env.REACT_APP_API_URL;

// In development, fallback to localhost if not set
if (process.env.NODE_ENV === 'development' && !BASE_URL) {
  console.warn('Using default localhost API URL');
  BASE_URL = 'http://localhost:5000/api';
}