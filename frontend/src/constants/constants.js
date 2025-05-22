export const BASE_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === "development" 
    ? "http://localhost:5000/api"  // Development environment
    : "/api"                       // Production fallback
);