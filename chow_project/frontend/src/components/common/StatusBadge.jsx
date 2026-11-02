import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return <span className="badge bg-secondary">Unknown</span>;
  const s = status.toString().toLowerCase();
  let classNames = 'badge ';
  let icon = 'bi-circle';

  if (s.includes('scheduled')) { classNames += 'badge-status-scheduled'; icon = 'bi-calendar'; }
  else if (s.includes('waiting')) { classNames += 'badge-status-waiting'; icon = 'bi-clock'; }
  else if (s.includes('checked in') || s.includes('checkin')) { classNames += 'badge-status-checked-in'; icon = 'bi-person-check'; }
  else if (s.includes('consultation')) { classNames += 'badge-status-in-consultation'; icon = 'bi-activity'; }
  else if (s.includes('completed')) { classNames += 'badge-status-completed'; icon = 'bi-check2-all'; }
  else if (s.includes('cancel')) { classNames += 'badge-status-cancelled'; icon = 'bi-x-circle'; }
  else { classNames += 'bg-secondary text-white'; }

  return (
    <span className={`${classNames} px-2 py-1`}>
      <i className={`bi ${icon} me-1`}></i>
      {status}
    </span>
  );
};

export default StatusBadge;
