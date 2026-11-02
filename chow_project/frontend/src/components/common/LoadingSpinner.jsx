import React from 'react';
import ErrorAlert from './ErrorAlert';
import SuccessAlert from './SuccessAlert';
import ConfirmModal from './ConfirmModal';
import SearchBar from './SearchBar';
import EmptyState from './EmptyState';
import Pagination from './Pagination';

export const LoadingSpinner = ({ message = 'Loading data...' }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 my-4">
    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3 text-muted fw-semibold">{message}</p>
  </div>
);

export { ErrorAlert, SuccessAlert, ConfirmModal, SearchBar, EmptyState, Pagination };

export default LoadingSpinner;
