import './RequestTable.css';

const RequestTable = ({ 
  requests, 
  onEdit, 
  onDelete, 
  onAccept, 
  onReject,
  showActions = false,
  showReceivedActions = false,
  selectedIds = [],
  onSelect,
  onSelectAll
}) => {
  if (requests.length === 0) {
    return <div className="empty-state">No requests found</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusBadge = (status) => {
    const classes = {
      'PENDING': 'status-badge status-pending',
      'ACCEPTED': 'status-badge status-accepted',
      'REJECTED': 'status-badge status-rejected'
    };
    return <span className={classes[status] || 'status-badge'}>{status}</span>;
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const allSelected = pendingRequests.length > 0 && selectedIds.length === pendingRequests.length;

  return (
    <div className="table-container">
      <table className="request-table">
        <thead>
          <tr>
            {showReceivedActions && (
              <th>
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={onSelectAll}
                />
              </th>
            )}
            <th>Request Date</th>
            <th>Company Name</th>
            <th>Type</th>
            <th>Price (SGD/Tonne)</th>
            <th>Quantity (Tonnes)</th>
            <th>Reason</th>
            <th>Status</th>
            {(showActions || showReceivedActions) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className={request.isOverdue ? 'row-overdue' : ''}>
              {showReceivedActions && (
                <td>
                  {request.status === 'PENDING' && (
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(request.id)}
                      onChange={() => onSelect(request.id)}
                    />
                  )}
                </td>
              )}
              <td>{formatDate(request.requestDate)}</td>
              <td>{request.companyName}</td>
              <td>
                <span className={`type-badge type-${request.requestType.toLowerCase()}`}>
                  {request.requestType}
                </span>
              </td>
              <td>${request.carbonUnitPrice.toFixed(2)}</td>
              <td>{request.carbonQuantity.toLocaleString()}</td>
              <td>{request.requestReason}</td>
              <td>{getStatusBadge(request.status)}</td>
              
              {showActions && (
                <td>
                  <div className="action-buttons">
                    {request.status === 'PENDING' && (
                      <>
                        <button 
                          className="btn-small btn-edit"
                          onClick={() => onEdit(request)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-small btn-delete"
                          onClick={() => onDelete(request.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              )}
              
              {showReceivedActions && (
                <td>
                  <div className="action-buttons">
                    {request.status === 'PENDING' ? (
                      <>
                        <button 
                          className="btn-small btn-accept"
                          onClick={() => onAccept(request.id)}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn-small btn-reject"
                          onClick={() => onReject(request.id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="action-label">{request.status}</span>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;

