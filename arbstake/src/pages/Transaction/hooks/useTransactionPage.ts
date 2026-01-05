import { useState, useEffect } from 'react';
import { Transaction, TransactionFilter } from '@/types';
import { useTransactions } from '@/hooks/useTransactions';

export const useTransactionPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<TransactionFilter>('All Transaction');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const { transactions: allTransactions, isLoading } = useTransactions();

  console.log('🎯 useTransactionPage - Current filter:', selectedFilter);
  console.log('🎯 All transactions from hook:', allTransactions.length);

  const filters: TransactionFilter[] = [
    'All Transaction',
    'Stake',
    'Unstake',
    'Claimed Earning',
    'Referral Reward'
  ];

  const filterTransactions = (txs: Transaction[], filter: TransactionFilter) => {
    console.log('🔍 Filtering', txs.length, 'transactions with filter:', filter);
    
    if (filter === 'All Transaction') {
      console.log('✅ Setting all transactions:', txs.length);
      setFilteredTransactions(txs);
      return;
    }

    const filtered = txs.filter(tx => {
      switch (filter) {
        case 'Stake':
          return tx.type === 'Stake';
        case 'Unstake':
          return tx.type === 'Unstake';
        case 'Claimed Earning':
          return tx.type === 'Claimed Earning';
        case 'Referral Reward':
          return tx.type === 'Referral Commission';
        default:
          return true;
      }
    });
    
    console.log('✅ Filtered to', filtered.length, 'transactions');
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    console.log('🎯 Transaction Page - All transactions:', allTransactions.length);
    filterTransactions(allTransactions, selectedFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, allTransactions]);

  console.log('📤 Returning transactions count:', filteredTransactions.length);

  return {
    selectedFilter,
    setSelectedFilter,
    transactions: filteredTransactions,
    filters,
    isLoading,
  };
};
