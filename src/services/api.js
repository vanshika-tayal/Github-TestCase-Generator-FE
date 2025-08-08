import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth tokens from localStorage
    const githubToken = localStorage.getItem('githubToken');
    const geminiKey = localStorage.getItem('geminiKey');
    
    if (githubToken) {
      config.headers['X-GitHub-Token'] = githubToken;
    }
    if (geminiKey) {
      config.headers['X-Gemini-Key'] = geminiKey;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // If token is not configured, add a helpful message and redirect to settings
    if (error.response?.status === 401) {
      if (message.includes('GitHub') || message.includes('Gemini')) {
        // Only show toast if not already handled by component
        if (!error.config.__isRetryRequest && !window.__toastShown) {
          window.__toastShown = true;
          // Show toast message to guide user
          import('react-hot-toast').then(({ default: toast }) => {
            toast.error(message + '\nRedirecting to API Keys Setup...', {
              duration: 3000,
              icon: '🔐'
            });
          });
          
          // Redirect to settings page after a short delay
          setTimeout(() => {
            window.__toastShown = false;
            if (window.location.pathname !== '/settings') {
              window.location.href = '/settings';
            }
          }, 2000);
        }
      }
    }
    
    return Promise.reject(new Error(message));
  }
);

// Health check
export const healthCheck = () => api.get('/health');

// GitHub API
export const githubAPI = {
  // Get user repositories
  getRepositories: () => api.get('/github/repositories'),
  
  // Get repository files
  getFiles: (owner, repo, path = '') => 
    api.get(`/github/files/${owner}/${repo}`, { params: { path } }),
  
  // Get file content
  getFileContent: (owner, repo, path) => 
    api.get(`/github/file/${owner}/${repo}`, { params: { path } }),
  
  // Create pull request
  createPullRequest: (data) => api.post('/github/create-pr', data),
};

// AI API
export const aiAPI = {
  // Get supported frameworks
  getFrameworks: () => api.get('/ai/frameworks'),
  
  // Generate test case summaries
  generateSummaries: (data) => api.post('/ai/generate-summaries', data),
  
  // Generate detailed test case
  generateTestCase: (data) => api.post('/ai/generate-test-case', data),
};

// Test Cases API
export const testCasesAPI = {
  // Save test case summaries
  saveSummaries: (data) => api.post('/test-cases/summaries', data),
  
  // Get all summaries
  getSummaries: () => api.get('/test-cases/summaries'),
  
  // Get specific summary
  getSummary: (id) => api.get(`/test-cases/summaries/${id}`),
  
  // Save generated test case
  saveTestCase: (data) => api.post('/test-cases/save', data),
  
  // Get all test cases
  getTestCases: () => api.get('/test-cases'),
  
  // Get specific test case
  getTestCase: (id) => api.get(`/test-cases/${id}`),
  
  // Delete test case
  deleteTestCase: (id) => api.delete(`/test-cases/${id}`),
  
  // Delete test case summary
  deleteSummary: (id) => api.delete(`/test-cases/summaries/${id}`),
  
  // Get statistics
  getStats: () => api.get('/test-cases/stats/overview'),
};

export default api; 