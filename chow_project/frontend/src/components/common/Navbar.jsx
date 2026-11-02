import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'receptionist': return '/receptionist/dashboard';
      case 'patient': default: return '/patient/dashboard';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isSubpage = !location.pathname.endsWith('/dashboard') && location.pathname !== '/';

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'doctor': return 'bg-success';
      case 'receptionist': return 'bg-warning text-dark';
      case 'patient': default: return 'bg-primary';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top border-bottom border-secondary shadow-sm px-3" style={{ height: '60px' }}>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center gap-2">
          {toggleSidebar && (
            <button className="btn btn-sm btn-outline-light me-1 d-md-none" onClick={toggleSidebar} aria-label="Toggle Navigation Menu">
              <i className="bi bi-list fs-4"></i>
            </button>
          )}

          <Link to={getDashboardPath()} className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px' }}>
              <i className="bi bi-hospital fs-6"></i>
            </div>
            <span className="fs-5 tracking-tight">Med<span className="text-primary">OPD</span></span>
          </Link>

          {isSubpage && (
            <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline-secondary text-white d-none d-sm-flex align-items-center gap-1 ms-2" title="Go Back">
              <i className="bi bi-arrow-left"></i> Back
            </button>
          )}
        </div>

        {/* Right side controls */}
        <div className="d-flex align-items-center gap-2 gap-sm-3">
          {user && (
            <span className={`badge ${getRoleBadge(user.role)} text-uppercase px-2 py-1`}>
              {user.role}
            </span>
          )}

          {user && user.role === 'patient' && (
            <Link to="/patient/notifications" className="btn btn-sm btn-outline-light position-relative p-1 px-2" title="Notifications">
              <i className="bi bi-bell"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </Link>
          )}

          {user ? (
            <div className="dropdown">
              <button className="btn btn-sm btn-dark dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="d-none d-sm-inline fw-semibold">{user.name}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li className="px-3 py-2 border-bottom">
                  <p className="mb-0 fw-bold">{user.name}</p>
                  <small className="text-muted">{user.email}</small>
                </li>
                {user.role === 'patient' && (
                  <li><Link className="dropdown-item" to="/patient/profile"><i className="bi bi-person-gear me-2"></i>Profile</Link></li>
                )}
                <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/" className="btn btn-sm btn-primary">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
