import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getDashboardData(timeRange);
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data: ' + err.message);
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  const COLORS = {
    primary: '#8884d8',
    secondary: '#82ca9d',
    accent: '#ff7300',
    success: '#00C49F',
    warning: '#FFBB28',
    danger: '#FF8042',
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-selector"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Total Volume Traded</h3>
            <p className="metric-value">{dashboardData?.totalVolume || 0}</p>
            <p className="metric-unit">tonnes CO₂</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>Avg Response Time</h3>
            <p className="metric-value">{dashboardData?.avgResponseTime || 0}</p>
            <p className="metric-unit">hours</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>Success Rate</h3>
            <p className="metric-value">{dashboardData?.successRate || 0}%</p>
            <p className="metric-unit">approval rate</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Transaction Value</h3>
            <p className="metric-value">
              ${((dashboardData?.totalVolume || 0) * (dashboardData?.avgPrice || 0)).toLocaleString()}
            </p>
            <p className="metric-unit">SGD</p>
          </div>
        </div>
      </div>

      {/* Request Volume Over Time */}
      <div className="chart-container">
        <h2>Request Volume Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dashboardData?.requestTimeSeries || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="buyRequests" 
              stroke={COLORS.secondary} 
              name="Buy Requests"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="sellRequests" 
              stroke={COLORS.primary} 
              name="Sell Requests"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Carbon Price Trends */}
      <div className="chart-container">
        <h2>Average Carbon Price Trends (SGD/Tonne)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dashboardData?.priceTimeSeries || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="avgPrice" 
              stroke={COLORS.accent} 
              name="Avg Settlement Price"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="minPrice" 
              stroke={COLORS.success} 
              name="Min Price"
              strokeWidth={1}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="maxPrice" 
              stroke={COLORS.danger} 
              name="Max Price"
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Request Approval Rates and Top Partners */}
      <div className="metrics-grid">
        <div className="chart-container">
          <h2>Request Approval Rates</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData?.approvalRates || []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {(dashboardData?.approvalRates || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Top Trading Partners</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.topPartners || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="company" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="transactions" fill={COLORS.primary} name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Request Types Distribution */}
      <div className="chart-container">
        <h2>Carbon Volume by Request Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashboardData?.volumeByType || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="volume" fill={COLORS.secondary} name="Volume (tonnes)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trading Activity Heatmap */}
      <div className="chart-container">
        <h2>Trading Activity by Day of Week</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashboardData?.activityByDay || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="requests" fill={COLORS.accent} name="Total Requests" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

