import { useState, useEffect } from 'react';
import api from '../services/api';
import './RequestModal.css';

const RequestModal = ({ request, onClose }) => {
  const isEditing = !!request;
  
  const [formData, setFormData] = useState({
    targetCompanyId: '',
    carbonUnitPrice: '',
    carbonQuantity: '',
    requestReason: '',
    requestType: 'BUY'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (request) {
      setFormData({
        targetCompanyId: request.targetCompanyId || '',
        carbonUnitPrice: request.carbonUnitPrice,
        carbonQuantity: request.carbonQuantity,
        requestReason: request.requestReason,
        requestType: request.requestType
      });
    }
  }, [request]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Map frontend field names to backend API field names
      const payload = {
        targetCompanyId: parseInt(formData.targetCompanyId),
        price: parseFloat(formData.carbonUnitPrice),
        quantity: parseInt(formData.carbonQuantity),
        reason: formData.requestReason,
        type: formData.requestType
      };

      if (isEditing) {
        await api.updateRequest(request.id, payload);
      } else {
        await api.createRequest(payload);
      }
      
      onClose(true); // true means refresh data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Request' : 'Create New Request'}</h2>
          <button className="modal-close" onClick={() => onClose(false)}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="targetCompanyId">Target Company ID</label>
            <input
              type="number"
              id="targetCompanyId"
              name="targetCompanyId"
              value={formData.targetCompanyId}
              onChange={handleChange}
              required
              disabled={isEditing}
            />
            <small>Enter the ID of the company you want to trade with</small>
          </div>

          <div className="form-group">
            <label htmlFor="requestType">Request Type</label>
            <select
              id="requestType"
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
              required
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="carbonUnitPrice">Price (SGD/Tonne)</label>
              <input
                type="number"
                id="carbonUnitPrice"
                name="carbonUnitPrice"
                value={formData.carbonUnitPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="carbonQuantity">Quantity (Tonnes)</label>
              <input
                type="number"
                id="carbonQuantity"
                name="carbonQuantity"
                value={formData.carbonQuantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="requestReason">Reason</label>
            <textarea
              id="requestReason"
              name="requestReason"
              value={formData.requestReason}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;

