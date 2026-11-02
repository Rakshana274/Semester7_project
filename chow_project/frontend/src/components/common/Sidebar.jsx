import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const patientLinks = [
    { to: '/patient/dashboard', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
    { to: '/patient/book', icon: 'bi-calendar-plus', label: 'Book Appointment' },
    { to: '/patient/appointments', icon: 'bi-journal-check', label: 'My Appointments' },
    { to: '/patient/notifications', icon: 'bi-bell-fill', label: 'Notifications' },
    { to: '/patient/profile', icon: 'bi-person-circle', label: 'Profile' }
  ];

  const receptionistLinks = [
    { to: '/receptionist/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { to: '/receptionist/queue', icon: 'bi-people-fill', label: "Today's Queue" },
    { to: '/receptionist/patients', icon: 'bi-search', label: 'Patient Search' },
    { to: '/receptionist/walkins', icon: 'bi-person-plus-fill', label: 'Walk-ins' },
    { to: '/receptionist/emergencies', icon: 'bi-exclamation-triangle-fill', label: 'Emergency Alerts', badge: 'ALERT' }
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: 'bi-heart-pulse-fill', label: 'Dashboard' },
    { to: '/doctor/schedule', icon: 'bi-clock-history', label: "Today's Schedule" },
    { to: '/doctor/queue', icon: 'bi-list-ol', label: "Today's Queue" }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: 'bi-speedometer', label: 'Dashboard' },
    { to: '/admin/departments', icon: 'bi-building-gear', label: 'Departments' },
    { to: '/admin/doctors', icon: 'bi-person-vcard-fill', label: 'Doctors' },
    { to: '/admin/schedules', icon: 'bi-calendar-range-fill', label: 'Schedules' },
    { to: '/admin/opd-sessions', icon: 'bi-sliders', label: 'OPD Sessions' },
    { to: '/admin/capacity', icon: 'bi-pie-chart-fill', label: 'Capacity' },
    { to: '/admin/walkins', icon: 'bi-person-walking', label: 'Walk-ins' },
    { to: '/admin/settings', icon: 'bi-gear-wide-connected', label: 'Settings' },
    { to: '/admin/statistics', icon: 'bi-graph-up-arrow', label: 'Statistics' }
  ];

  let links = [];
  let roleTitle = 'Patient Portal';
  let badgeColor = 'bg-primary';

  switch (user.role) {
    case 'receptionist':
      links = receptionistLinks;
      roleTitle = 'Reception Desk';
      badgeColor = 'bg-warning text-dark';
      break;
    case 'doctor':
      links = doctorLinks;
      roleTitle = 'Doctor Portal';
      badgeColor = 'bg-success';
      break;
    case 'admin':
      links = adminLinks;
      roleTitle = 'Admin Portal';
      badgeColor = 'bg-danger';
      break;
    case 'patient':
    default:
      links = patientLinks;
      roleTitle = 'Patient Portal';
      badgeColor = 'bg-primary';
      break;
  }

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop d-md-none" onClick={onClose}></div>
      )}

      <aside className={`sidebar border-end ${isOpen ? 'mobile-open' : ''}`}>
        <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between">
          <div>
            <span className={`badge ${badgeColor} text-uppercase px-2 py-1`}>{user.role}</span>
            <h6 className="mb-0 text-white mt-1 fs-6 fw-semibold">{roleTitle}</h6>
          </div>
          {onClose && (
            <button className="btn btn-sm btn-link text-white text-decoration-none d-md-none" onClick={onClose}>
              <i className="bi bi-x-lg fs-5"></i>
            </button>
          )}
        </div>

        <div className="flex-grow-1 py-3 overflow-y-auto">
          <ul className="nav nav-pills flex-column list-unstyled">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className={`bi ${link.icon} fs-5`}></i>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="badge bg-danger ms-auto px-2">{link.badge}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 border-top border-secondary">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
