// Mock API Service - In-memory storage for development/testing
// This simulates the backend API when the real backend is not available

// Mock data storage
let mockRequests = [
  {
    id: 1,
    requestDate: "2026-01-02T09:00:00Z",
    companyName: "Tesla Inc",
    carbonUnitPrice: 55.0,
    carbonQuantity: 200,
    requestReason: "Surplus Credits",
    requestType: "SELL",
    status: "PENDING",
    isOverdue: false
  },
  {
    id: 2,
    requestDate: "2026-01-01T10:00:00Z",
    companyName: "Google LLC",
    carbonUnitPrice: 45.0,
    carbonQuantity: 150,
    requestReason: "Monthly Offset",
    requestType: "BUY",
    status: "ACCEPTED",
    isOverdue: false
  },
  {
    id: 3,
    requestDate: "2025-12-20T08:00:00Z",
    companyName: "Microsoft Corp",
    carbonUnitPrice: 50.0,
    carbonQuantity: 100,
    requestReason: "Q4 Requirements",
    requestType: "SELL",
    status: "PENDING",
    isOverdue: true  // More than 7 days old
  }
];

let nextId = 4;

// Incoming requests from other companies (for RequestsReceived page)
let incomingRequests = [
  {
    id: 101,
    requestDate: "2026-01-03T11:00:00Z",
    companyName: "Apple Inc",
    carbonUnitPrice: 60.0,
    carbonQuantity: 250,
    requestReason: "Carbon Neutral Goal",
    requestType: "BUY",
    status: "PENDING",
    isOverdue: false
  },
  {
    id: 102,
    requestDate: "2026-01-02T14:00:00Z",
    companyName: "Amazon Web Services",
    carbonUnitPrice: 48.0,
    carbonQuantity: 300,
    requestReason: "Data Center Offset",
    requestType: "BUY",
    status: "PENDING",
    isOverdue: false
  },
  {
    id: 103,
    requestDate: "2025-12-25T09:00:00Z",
    companyName: "Meta Platforms",
    carbonUnitPrice: 52.0,
    carbonQuantity: 180,
    requestReason: "Year End Requirements",
    requestType: "BUY",
    status: "PENDING",
    isOverdue: true  // More than 7 days old
  }
];

let nextIncomingId = 104;

class MockApiService {
  constructor() {
    // Simulate network delay
    this.delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentication
  async login(username, password) {
    await this.delay(500);
    
    // Mock: accept any non-empty credentials
    if (!username || !password) {
      throw new Error('Username and password are required');
    }
    
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', token);
    
    return {
      token,
      user: {
        username,
        companyName: username
      }
    };
  }

  async register(companyName, password) {
    await this.delay(500);
    
    if (!companyName || !password) {
      throw new Error('Company name and password are required');
    }
    
    return {
      message: 'Registration successful',
      user: {
        username: companyName,
        companyName: companyName
      }
    };
  }

  // Account & Balance
  async getAccountBalance() {
    await this.delay(300);
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    return {
      companyName: "DBS",
      carbonBalance: 500,
      cashBalance: 10000.50
    };
  }

  // My Requests (Outgoing)
  async getMyRequests() {
    await this.delay(300);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    // Return all requests (both BUY and SELL that the user created)
    // In a real scenario, these would be filtered by the current user
    return [...mockRequests];
  }

  async createRequest(requestData) {
    await this.delay(500);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    if (!requestData.type || !requestData.price || !requestData.quantity) {
      throw new Error('Missing required fields: type, price, quantity');
    }
    
    const newRequest = {
      id: nextId++,
      requestDate: new Date().toISOString(),
      companyName: requestData.targetCompanyId 
        ? `Company ${requestData.targetCompanyId}` 
        : "Target Company",
      carbonUnitPrice: requestData.price,
      carbonQuantity: requestData.quantity,
      requestReason: requestData.reason || "No reason provided",
      requestType: requestData.type,
      status: "PENDING",
      isOverdue: false
    };
    
    mockRequests.push(newRequest);
    return newRequest;
  }

  async updateRequest(id, requestData) {
    await this.delay(300);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    const index = mockRequests.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Request not found');
    }
    
    // Only allow updating pending requests
    if (mockRequests[index].status !== 'PENDING') {
      throw new Error('Can only update pending requests');
    }
    
    // Map API field names to response field names
    const updates = {};
    if (requestData.price !== undefined) {
      updates.carbonUnitPrice = requestData.price;
    }
    if (requestData.quantity !== undefined) {
      updates.carbonQuantity = requestData.quantity;
    }
    if (requestData.reason !== undefined) {
      updates.requestReason = requestData.reason;
    }
    if (requestData.type !== undefined) {
      updates.requestType = requestData.type;
    }
    
    mockRequests[index] = {
      ...mockRequests[index],
      ...updates,
      // Preserve id and other fields
      id: mockRequests[index].id,
      requestDate: mockRequests[index].requestDate,
      companyName: mockRequests[index].companyName
    };
    
    return mockRequests[index];
  }

  async deleteRequest(id) {
    await this.delay(300);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    const index = mockRequests.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Request not found');
    }
    
    // Only allow deleting pending requests
    if (mockRequests[index].status !== 'PENDING') {
      throw new Error('Can only delete pending requests');
    }
    
    mockRequests = mockRequests.filter(r => r.id !== id);
    return { message: 'Request deleted successfully' };
  }

  // Incoming Requests
  async getIncomingRequests() {
    await this.delay(300);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    // Return incoming requests (requests from other companies to the current user)
    return [...incomingRequests];
  }

  async updateRequestStatus(id, status) {
    await this.delay(300);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      throw new Error('Invalid status. Must be ACCEPTED or REJECTED');
    }
    
    // Check both incoming and outgoing requests
    let request = incomingRequests.find(r => r.id === id);
    let isIncoming = true;
    
    if (!request) {
      request = mockRequests.find(r => r.id === id);
      isIncoming = false;
    }
    
    if (!request) {
      throw new Error('Request not found');
    }
    
    if (request.status !== 'PENDING') {
      throw new Error('Can only update pending requests');
    }
    
    request.status = status;
    
    return request;
  }

  async bulkUpdateStatus(ids, status) {
    await this.delay(500);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      throw new Error('Invalid status. Must be ACCEPTED or REJECTED');
    }
    
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('ids must be a non-empty array');
    }
    
    let updatedCount = 0;
    
    ids.forEach(id => {
      let request = incomingRequests.find(r => r.id === id);
      if (!request) {
        request = mockRequests.find(r => r.id === id);
      }
      
      if (request && request.status === 'PENDING') {
        request.status = status;
        updatedCount++;
      }
    });
    
    return {
      message: `Successfully updated ${updatedCount} request(s)`,
      updatedCount
    };
  }

  async getAlerts() {
    await this.delay(300);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    // Return overdue requests (both incoming and outgoing)
    const overdueIncoming = incomingRequests.filter(
      r => r.isOverdue && r.status === 'PENDING'
    );
    const overdueOutgoing = mockRequests.filter(
      r => r.isOverdue && r.status === 'PENDING'
    );
    
    return [...overdueIncoming, ...overdueOutgoing];
  }

  // Dashboard Analytics
  async getDashboardData(timeRange = 30) {
    await this.delay(300);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    // Generate mock time series data for request volume
    const requestTimeSeries = [];
    const priceTimeSeries = [];
    const days = parseInt(timeRange);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Simulate some variation in requests
      const buyRequests = Math.floor(Math.random() * 10) + 2;
      const sellRequests = Math.floor(Math.random() * 8) + 1;
      
      requestTimeSeries.push({
        date: dateStr,
        buyRequests,
        sellRequests,
      });
      
      // Simulate price variations
      const basePrice = 50;
      const variation = Math.random() * 20 - 10;
      const avgPrice = basePrice + variation;
      
      priceTimeSeries.push({
        date: dateStr,
        avgPrice: Math.round(avgPrice * 100) / 100,
        minPrice: Math.round((avgPrice - 5 - Math.random() * 5) * 100) / 100,
        maxPrice: Math.round((avgPrice + 5 + Math.random() * 5) * 100) / 100,
      });
    }
    
    // Approval rates data
    const approvalRates = [
      { name: 'Accepted', value: 45, color: '#00C49F' },
      { name: 'Rejected', value: 15, color: '#FF8042' },
      { name: 'Pending', value: 30, color: '#FFBB28' },
      { name: 'Cancelled', value: 10, color: '#999999' },
    ];
    
    // Top trading partners
    const topPartners = [
      { company: 'Tesla Inc', transactions: 25 },
      { company: 'Google LLC', transactions: 20 },
      { company: 'Apple Inc', transactions: 18 },
      { company: 'Microsoft', transactions: 15 },
      { company: 'Amazon AWS', transactions: 12 },
    ];
    
    // Volume by request type
    const volumeByType = [
      { type: 'Buy Requests', volume: 3500 },
      { type: 'Sell Requests', volume: 2800 },
    ];
    
    // Activity by day of week
    const activityByDay = [
      { day: 'Monday', requests: 45 },
      { day: 'Tuesday', requests: 52 },
      { day: 'Wednesday', requests: 48 },
      { day: 'Thursday', requests: 55 },
      { day: 'Friday', requests: 40 },
      { day: 'Saturday', requests: 15 },
      { day: 'Sunday', requests: 10 },
    ];
    
    // Calculate aggregate metrics
    const totalVolume = 6300; // tonnes
    const avgResponseTime = 24.5; // hours
    const successRate = 75.0; // percentage
    const avgPrice = 52.50; // SGD/tonne
    
    return {
      requestTimeSeries,
      priceTimeSeries,
      approvalRates,
      topPartners,
      volumeByType,
      activityByDay,
      totalVolume,
      avgResponseTime,
      successRate,
      avgPrice,
    };
  }
}

export default new MockApiService();

