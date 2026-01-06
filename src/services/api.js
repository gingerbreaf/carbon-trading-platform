// API Service Layer
const BASE_URL = 'http://localhost:8080/api/v1';

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async register(companyName, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ companyName, password }),
    });
  }

  // Account & Balance
  async getAccountBalance() {
    return this.request('/account/balance');
  }

  // My Requests (Outgoing)
  async getMyRequests() {
    return this.request('/requests/my');
  }

  async createRequest(requestData) {
    return this.request('/requests/new', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async updateRequest(id, requestData) {
    return this.request(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  }

  async deleteRequest(id) {
    return this.request(`/requests/${id}`, {
      method: 'DELETE',
    });
  }

  // Incoming Requests
  async getIncomingRequests() {
    return this.request('/requests/incoming');
  }

  async updateRequestStatus(id, status) {
    return this.request(`/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async bulkUpdateStatus(ids, status) {
    return this.request('/requests/bulk-action', {
      method: 'POST',
      body: JSON.stringify({ ids, status }),
    });
  }

  async getAlerts() {
    return this.request('/requests/alerts');
  }
}

export default new ApiService();

