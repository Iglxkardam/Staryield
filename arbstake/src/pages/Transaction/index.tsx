import React from 'react';
import Header from '@components/Header';
import VideoBackground from '@components/VideoBackground';
import FeaturesMenu from '../Dashboard/components/FeaturesMenu';
import TransactionFilters from './components/TransactionFilters';
import TransactionList from './components/TransactionList';
import { useTransactionPage } from './hooks/useTransactionPage';

const TransactionPage: React.FC = () => {
  const {
    selectedFilter,
    setSelectedFilter,
    transactions,
    filters,
    isLoading
  } = useTransactionPage();

  return (
    <div className="admin">
      {/* Admin Header */}
      <div className="admin-header">
        <VideoBackground src="/images/galaxy-bg-2.mp4" className="hesder-video" />
        <Header isAdmin={true} />
      </div>

      {/* Dashboard Main */}
      <div className="top-stats">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <FeaturesMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="dashboard-body">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <TransactionFilters 
                filters={filters}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />
            </div>

            <div className="col-lg-8 offset-lg-1">
              <TransactionList transactions={transactions} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
