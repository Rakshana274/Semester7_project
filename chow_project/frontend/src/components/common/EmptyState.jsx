import React from 'react';

export const EmptyState = ({ title = 'No records found', message = 'There are no items to display at this time.', icon = 'bi-inbox', actionLabel, onAction }) => (
  <div className="text-center py-5 my-3 px-3 bg-white rounded-3 border">
    <div className="bg-light text-secondary rounded-circle d-inline-flex align-items-center justify-content-center p-4 mb-3">
      <i className={`bi ${icon} fs-1`}></i>
    </div>
    <h5 className="fw-bold text-dark mb-1">{title}</h5>
    <p className="text-muted max-w-md mx-auto small mb-3">{message}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn btn-primary btn-sm">
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
