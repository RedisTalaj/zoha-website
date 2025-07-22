import axios from 'axios';

// Get the base URL from the environment variables
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- THIS IS THE NEW LINE WE ARE ADDING ---
// This exports the root URL (e.g., "https://zoha-api-1.onrender.com") for image paths
export const BACKEND_URL = VITE_BASE_URL;

// This creates the URL for API calls (e.g., "https://zoha-api-1.onrender.com/api")
const API_URL = `${VITE_BASE_URL}/api`;

const apiClient = axios.create({ baseURL: API_URL });

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

// === Admin Authentication & Endpoints ===
export const setAdminAuth = (username, password) => {
    apiClient.defaults.auth = { username, password };
    localStorage.setItem('isAdmin', 'true');
};

export const clearAdminAuth = () => {
    delete apiClient.defaults.auth;
    localStorage.removeItem('isAdmin');
};

export const isAdminLoggedIn = () => localStorage.getItem('isAdmin') === 'true';

// === Corrected Admin Functions ===
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

export const uploadImages = async (formData) => {
    const response = await apiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; 
};

export const getProjectImages = async (id) => {
    const response = await apiClient.get(`/public/projects/${id}/images`);
    return response.data;
};

export default apiClient;