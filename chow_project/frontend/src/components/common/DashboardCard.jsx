import React from 'react';

export const DashboardCard = ({ title, value, icon, color = 'primary', subtitle, trend, onClick }) => {
  return (
    <div 
      className={`card card-custom h-100 p-3 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <span className="text-muted text-uppercase fw-semibold fs-7 tracking-wide">{title}</span>
          <h2 className="fw-bold my-1 text-dark">{value}</h2>
          {subtitle && <p className="text-secondary small mb-0">{subtitle}</p>}
          {trend && (
            <span className={`badge ${trend.isPositive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} mt-2`}>
              <i className={`bi bi-arrow-${trend.isPositive ? 'up' : 'down'} me-1`}></i>
              {trend.value}
            </span>
          )}
        </div>
        <div className={`rounded-circle bg-${color}-subtle text-${color} p-3 d-flex align-items-center justify-content-center`} style={{ width: '56px', height: '56px' }}>
          <i className={`bi ${icon} fs-3`}></i>
        </div>
      </div>
    </div>
  );
};

export const StatCard = ({ title, value, icon, variant = 'primary', note }) => {
  return (
    <div className={`card card-custom stat-card ${variant} h-100 p-3`}>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <span className="text-muted small fw-semibold text-uppercase">{title}</span>
          <h3 className="fw-bold text-dark my-1">{value}</h3>
          {note && <small className="text-muted">{note}</small>}
        </div>
        {icon && (
          <div className="text-secondary opacity-75">
            <i className={`bi ${icon} fs-2`}></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
