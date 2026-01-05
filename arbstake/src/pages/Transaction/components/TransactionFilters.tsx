import React from 'react';
import { TransactionFilter } from '@/types';

interface TransactionFiltersProps {
  filters: TransactionFilter[];
  selectedFilter: TransactionFilter;
  onFilterChange: (filter: TransactionFilter) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ 
  filters, 
  selectedFilter, 
  onFilterChange 
}) => {
  return (
    <div className="filter-wrapper">
      <h3>Filter</h3>
      <ul className="filter-list clearfix">
        {filters.map((filter, index) => (
          <li key={index}>
            <div className="filter-box">
              <input
                type="radio"
                name="type"
                id={`trans-${index + 1}`}
                checked={selectedFilter === filter}
                onChange={() => onFilterChange(filter)}
              />
              <label htmlFor={`trans-${index + 1}`}>
                <span></span>
                {filter}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionFilters;
