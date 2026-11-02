import React from 'react';

const ChartCard = ({ title, type = 'bar', data = [], labels = [], subtitle }) => {
  const maxVal = Math.max(...data, 1);

  const colors = [
    '#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899'
  ];

  return (
    <div className="card card-custom h-100 p-3">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
        <div>
          <h6 className="fw-bold text-dark mb-0">{title}</h6>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
        <span className="badge bg-light text-dark border text-uppercase">{type} chart</span>
      </div>

      <div className="py-2" style={{ minHeight: '220px' }}>
        {type === 'bar' || type === 'column' ? (
          <div className="d-flex align-items-end justify-content-between h-100 pt-4 px-2 gap-2" style={{ minHeight: '180px' }}>
            {data.map((val, idx) => {
              const heightPct = Math.round((val / maxVal) * 100);
              return (
                <div key={idx} className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end">
                  <span className="small fw-bold text-dark mb-1">{val}</span>
                  <div
                    className="w-100 rounded-top transition-all"
                    style={{
                      height: `${Math.max(heightPct, 8)}%`,
                      backgroundColor: colors[idx % colors.length],
                      minWidth: '20px',
                      maxWidth: '45px'
                    }}
                    title={`${labels[idx]}: ${val}`}
                  ></div>
                  <span className="text-muted mt-2 text-truncate small" style={{ maxWidth: '65px', fontSize: '0.75rem' }}>
                    {labels[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="d-flex flex-column gap-3 justify-content-center h-100 py-2">
            {data.map((val, idx) => {
              const widthPct = Math.round((val / maxVal) * 100);
              return (
                <div key={idx}>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold text-secondary">{labels[idx]}</span>
                    <span className="fw-bold text-dark">{val}</span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar rounded"
                      role="progressbar"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: colors[idx % colors.length]
                      }}
                      aria-valuenow={val}
                      aria-valuemin="0"
                      aria-valuemax={maxVal}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
