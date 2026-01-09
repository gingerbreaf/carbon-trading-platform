import './OverdueAlertPopup.css';

const OverdueAlertPopup = ({ overdueRequests, onClose }) => {
  if (!overdueRequests || overdueRequests.length === 0) {
    return null;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <span className="popup-icon">⚠️</span>
          <h2>Overdue Requests Alert</h2>
        </div>
        
        <div className="popup-content">
          <p className="popup-message">
            You have <strong>{overdueRequests.length}</strong> request(s) that are overdue 
            (more than 7 days old) and require your attention.
          </p>
          
          <div className="overdue-list">
            {overdueRequests.map(request => (
              <div key={request.id} className="overdue-item">
                <span className="overdue-company">{request.companyName}</span>
                <span className="overdue-type">{request.requestType}</span>
                <span className="overdue-quantity">{request.carbonQuantity} tonnes</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="popup-actions">
          <button className="btn-popup-primary" onClick={onClose}>
            OK, I understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverdueAlertPopup;

