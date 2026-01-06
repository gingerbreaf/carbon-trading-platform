import { useState, useEffect } from 'react';
import api from '../services/api';
import BalanceCard from '../components/BalanceCard';
import RequestTable from '../components/RequestTable';
import RequestModal from '../components/RequestModal';
import './Landing.css';

const Landing = () => {
  const [balance, setBalance] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [balanceData, requestsData] = await Promise.all([
        api.getAccountBalance(),
        api.getMyRequests()
      ]);
      setBalance(balanceData);
      setRequests(requestsData);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = () => {
    setEditingRequest(null);
    setShowModal(true);
  };

  const handleEditRequest = (request) => {
    setEditingRequest(request);
    setShowModal(true);
  };

  const handleDeleteRequest = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    
    try {
      await api.deleteRequest(id);
      await loadData();
    } catch (err) {
      alert('Failed to delete request: ' + err.message);
    }
  };

  const handleModalClose = async (shouldRefresh) => {
    setShowModal(false);
    setEditingRequest(null);
    if (shouldRefresh) {
      await loadData();
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="landing-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <button className="btn-primary" onClick={handleCreateRequest}>
          + New Request
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {balance && <BalanceCard balance={balance} />}

      <div className="section">
        <h2>My Requests</h2>
        <RequestTable
          requests={requests}
          onEdit={handleEditRequest}
          onDelete={handleDeleteRequest}
          showActions={true}
        />
      </div>

      {showModal && (
        <RequestModal
          request={editingRequest}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Landing;

