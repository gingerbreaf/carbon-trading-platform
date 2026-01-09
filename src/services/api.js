// API Service Layer
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

class ApiService {
  constructor() {
    // Create axios instance with base configuration
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('API Error:', error);
        const message = error.response?.data?.message || error.message || 'Request failed';
        throw new Error(message);
      }
    );
  }

  // Authentication
  async login(username, password) {
    const data = await this.client.post('/auth/login', { username, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async register(companyName, password) {
    return this.client.post('/auth/register', { username: companyName, password });
  }

  // Account & Balance
  async getAccountBalance() {
    return this.client.get('/account/balance');
  }

  // My Requests (Outgoing)
  async getMyRequests() {
    return this.client.get('/requests/my');
  }

  async createRequest(requestData) {
    return this.client.post('/requests/new', requestData);
  }

  async updateRequest(id, requestData) {
    return this.client.put(`/requests/${id}`, requestData);
  }

  async deleteRequest(id) {
    return this.client.delete(`/requests/${id}`);
  }

  // Incoming Requests
  async getIncomingRequests() {
    return this.client.get('/requests/incoming');
  }

  async updateRequestStatus(id, status) {
    return this.client.patch(`/requests/${id}/status`, { status });
  }

  async bulkUpdateStatus(ids, status) {
    return this.client.post('/requests/bulk-action', { ids, status });
  }

  async getAlerts() {
    return this.client.get('/requests/alerts');
  }
}

export default new ApiService();

