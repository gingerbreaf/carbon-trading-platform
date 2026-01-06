import { useState, useEffect } from 'react';
import api from '../services/api';
import RequestTable from '../components/RequestTable';
import './RequestsReceived.css';

const RequestsReceived = () => {
  const [requests, setRequests] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overdueAlerts, setOverdueAlerts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [requestsData, alertsData] = await Promise.all([
        api.getIncomingRequests(),
        api.getAlerts().catch(() => []) // Alerts are optional
      ]);
      setRequests(requestsData);
      
      // Show overdue alert if any
      const overdue = requestsData.filter(r => r.isOverdue && r.status === 'PENDING');
      if (overdue.length > 0) {
        setOverdueAlerts(overdue);
      }
    } catch (err) {
      setError('Failed to load requests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.updateRequestStatus(id, 'ACCEPTED');
      await loadData();
    } catch (err) {
      alert('Failed to accept request: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.updateRequestStatus(id, 'REJECTED');
      await loadData();
    } catch (err) {
      alert('Failed to reject request: ' + err.message);
    }
  };

  const handleBulkAccept = async () => {
    if (selectedIds.length === 0) {
      alert('Please select requests to accept');
      return;
    }
    
    try {
      await api.bulkUpdateStatus(selectedIds, 'ACCEPTED');
      setSelectedIds([]);
      await loadData();
    } catch (err) {
      alert('Failed to accept requests: ' + err.message);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) {
      alert('Please select requests to reject');
      return;
    }
    
    if (!confirm(`Are you sure you want to reject ${selectedIds.length} request(s)?`)) {
      return;
    }
    
    try {
      await api.bulkUpdateStatus(selectedIds, 'REJECTED');
      setSelectedIds([]);
      await loadData();
    } catch (err) {
      alert('Failed to reject requests: ' + err.message);
    }
  };

  const handleSelectRequest = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const pendingRequests = requests.filter(r => r.status === 'PENDING');
    if (selectedIds.length === pendingRequests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingRequests.map(r => r.id));
    }
  };

  const dismissAlert = () => {
    setOverdueAlerts([]);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="requests-received-page">
      <div className="page-header">
        <h1>Requests Received</h1>
        
        {selectedIds.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedIds.length} selected</span>
            <button className="btn-success" onClick={handleBulkAccept}>
              Accept Selected
            </button>
            <button className="btn-danger" onClick={handleBulkReject}>
              Reject Selected
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {overdueAlerts.length > 0 && (
        <div className="alert-banner">
          <div className="alert-content">
            <strong>⚠️ Overdue Requests!</strong>
            <p>You have {overdueAlerts.length} request(s) that are overdue (more than 7 days old)</p>
          </div>
          <button onClick={dismissAlert} className="alert-dismiss">×</button>
        </div>
      )}

      <RequestTable
        requests={requests}
        onAccept={handleAccept}
        onReject={handleReject}
        selectedIds={selectedIds}
        onSelect={handleSelectRequest}
        onSelectAll={handleSelectAll}
        showReceivedActions={true}
      />
    </div>
  );
};

export default RequestsReceived;

