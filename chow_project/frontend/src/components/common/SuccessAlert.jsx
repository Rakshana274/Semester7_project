import React from 'react';

export const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2" role="alert">
      <i className="bi bi-check-circle-fill fs-5"></i>
      <div>{message}</div>
      {onClose && <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>}
    </div>
  );
};

export default SuccessAlert;
