import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-top py-3 px-4 text-center text-muted fs-7 mt-auto">
      <div className="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        <div>
          <span className="fw-semibold text-dark">MedOPD Queue & Booking Management System</span> &copy; {new Date().getFullYear()}
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-light text-dark border"><i className="bi bi-circle-fill text-success me-1" style={{ fontSize: '0.6rem' }}></i> Operational</span>
          <span className="text-secondary">v2.4.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
