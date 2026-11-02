import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ErrorAlert } from '../../components/common/LoadingSpinner';

const ReceptionistLogin = () => {
  const [username, setUsername] = useState('chowz');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ username, password, role: 'receptionist' });
      const role = res.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'doctor') navigate('/doctor/dashboard');
      else if (role === 'patient') navigate('/patient/dashboard');
      else navigate('/receptionist/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5 px-3">
      <div className="card card-custom p-4 p-md-5 shadow-lg border-0" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
            <i className="bi bi-person-workspace fs-3"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">Receptionist Desk Login</h3>
          <p className="text-muted small">Sign in as <strong>chowz</strong></p>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">Username / Staff ID</label>
            <input
              type="text"
              className="form-control"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-warning w-100 py-2 fw-bold" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login to Reception Desk'}
          </button>
        </form>

        <div className="mt-4 text-center border-top pt-3">
          <Link to="/" className="text-secondary small text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i> Unified Sign-in Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistLogin;
