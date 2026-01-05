import React, { useState } from 'react';
import { Transaction } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
  if (isLoading) {
    return (
      <div className="transactions">
        <h3>Your Transactions</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transactions">
        <h3>Your Transactions</h3>
        <p>No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="transactions">
      <h3>Your Transactions</h3>
      <ul className="transaction-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {currentTransactions.map((transaction) => (
          <li key={transaction.id} style={{ marginBottom: '10px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr',
              gap: '20px',
              alignItems: 'center',
              padding: '20px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={transaction.token === 'ETH' ? '/images/eth.svg' : `/images/${transaction.token.toLowerCase()}.png`}
                  className="trans-icon" 
                  alt={transaction.token}
                  style={{ width: '32px', height: '32px' }}
                />
                <div className={`trans-amount ${transaction.isPositive ? 'green' : 'red'}`} style={{ fontSize: '16px', fontWeight: '600' }}>
                  {transaction.isPositive ? '+' : '-'}{transaction.amount} <span style={{ opacity: 0.7 }}>{transaction.token}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: '500' }}>
                {transaction.type}
              </div>
              <div style={{ textAlign: 'right', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                {transaction.date}
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {totalPages > 1 && (
        <div className="pagination-wrapper" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px'
        }}>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="btn"
            style={{
              padding: '10px 20px',
              background: currentPage === 1 ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: currentPage === 1 ? '#666' : '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className="btn"
                style={{
                  padding: '10px 16px',
                  background: currentPage === page ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))' : 'transparent',
                  color: '#fff',
                  border: `1px solid ${currentPage === page ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: currentPage === page ? '700' : '500',
                  minWidth: '44px',
                  fontSize: '14px'
                }}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="btn"
            style={{
              padding: '10px 20px',
              background: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: currentPage === totalPages ? '#666' : '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Next
          </button>
          
          <span style={{ 
            color: 'rgba(255,255,255,0.6)', 
            marginLeft: '15px', 
            fontSize: '13px',
            fontWeight: '500'
          }}>
            Page {currentPage} of {totalPages} ({transactions.length} total)
          </span>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
