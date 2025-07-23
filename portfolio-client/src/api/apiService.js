import axios from 'axios';

// Get the base URL from the environment variables set in Vercel (or .env.local for development)
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// This correctly creates the URL for API calls (e.g., "https://zoha-api-1.onrender.com/api")
const API_URL = `${VITE_BASE_URL}/api`;

const apiClient = axios.create({ baseURL: API_URL });

// === NEW: PERSISTENT AUTHENTICATION LOGIC ===

/**
 * Checks localStorage for a saved auth token and applies it to the
 * axios client's default headers. This function runs automatically
 * when the app loads, ensuring the user stays logged in across sessions.
 */
const applyAuthToken = () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        // The "Basic " prefix is required for Basic Authentication.
        apiClient.defaults.headers.common['Authorization'] = `Basic ${authToken}`;
    }
};

// Apply the token immediately when the application starts
applyAuthToken();


// === Public Endpoints ===

export const getProjects = async () => {
    const response = await apiClient.get('/public/projects');
    return response.data;
};

export const getProjectById = async (id) => {
    const response = await apiClient.get(`/public/projects/${id}`);
    return response.data;
};

export const createSubmission = (submissionData) => apiClient.post('/public/submissions', submissionData);

export const getProjectImages = async (id) => {
    const response = await apiClient.get(`/public/projects/${id}/images`);
    return response.data;
};


// === Admin Authentication & Endpoints ===

/**
 * Sets the admin authentication by creating a Base64 token from
 * the username and password, storing it in localStorage, and applying
 * it to the current axios instance.
 * @param {string} username - The admin username.
 * @param {string} password - The admin password.
 */
export const setAdminAuth = (username, password) => {
    // btoa() creates a Base64-encoded ASCII string from a string of binary data.
    const token = btoa(`${username}:${password}`); 
    localStorage.setItem('authToken', token);
    applyAuthToken(); // Apply the header immediately
};

/**
 * Clears admin authentication by removing the token from localStorage
 * and deleting the Authorization header from the axios client.
 */
export const clearAdminAuth = () => {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
};

/**
 * Checks if the user is logged in by verifying the existence
 * of the authToken in localStorage.
 * @returns {boolean} - True if the token exists, false otherwise.
 */
export const isAdminLoggedIn = () => !!localStorage.getItem('authToken');


// === Admin Data Functions ===
// These functions will now automatically include the auth header if the user is logged in.

export const getAdminProjects = async () => {
    const response = await apiClient.get('/admin/projects');
    return response.data;
};

export const createProject = (projectData) => apiClient.post('/admin/projects', projectData);

export const deleteProject = (id) => apiClient.delete(`/admin/projects/${id}`);

export const getSubmissions = async () => {
    const response = await apiClient.get('/admin/submissions');
    return response.data;
};

export const deleteSubmission = (id) => apiClient.delete(`/admin/submissions/${id}`);

/**
 * Uploads one or more images to the backend.
 * @param {FormData} formData - The FormData object containing the files.
 * @returns {Promise<object>} - The response data, typically an object with a list of URLs.
 */
export const uploadImages = async (formData) => {
    const response = await apiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; 
};

export default apiClient;