import './BalanceCard.css';

const BalanceCard = ({ balance }) => {
  return (
    <div className="balance-card">
      <div className="balance-header">
        <h2>{balance.companyName}</h2>
        <p>Account Balances</p>
      </div>
      
      <div className="balance-grid">
        <div className="balance-item">
          <div className="balance-label">Carbon Credits</div>
          <div className="balance-value">{balance.carbonBalance.toLocaleString()} tonnes</div>
        </div>
        
        <div className="balance-item">
          <div className="balance-label">Cash Balance</div>
          <div className="balance-value">SGD ${balance.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;

