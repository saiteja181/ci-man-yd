// client/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making API calls
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Code analysis endpoint
  async analyzeCode(code, language) {
    return await this.makeRequest('/code/analyze', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  }

  // User authentication (placeholder)
  async login(credentials) {
    return await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Get user profile (placeholder)
  async getUserProfile() {
    return await this.makeRequest('/users/profile');
  }

  // Test connection
  async testConnection() {
    try {
      const response = await fetch('http://localhost:5000/');
      return await response.json();
    } catch (error) {
      console.error('Backend connection failed:', error);
      return { error: 'Backend not reachable' };
    }
  }
}

export default new ApiService();