import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ErrorAlert } from '../../components/common/LoadingSpinner';

const PatientLogin = () => {
  const [username, setUsername] = useState('mythili');
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
      const res = await login({ username, password, role: 'patient' });
      const role = res.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'receptionist') navigate('/receptionist/dashboard');
      else if (role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5 px-3">
      <div className="card card-custom p-4 p-md-5 shadow-lg border-0" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
            <i className="bi bi-person-fill fs-3"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">Patient Portal Login</h3>
          <p className="text-muted small">Sign in as <strong>mythili</strong></p>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">Username / Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
              <input
                type="text"
                className="form-control"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
              <input
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In as Patient'}
          </button>
        </form>

        <div className="mt-4 text-center pt-3 border-top">
          <Link to="/" className="text-secondary small text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i> Unified Sign-in Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
