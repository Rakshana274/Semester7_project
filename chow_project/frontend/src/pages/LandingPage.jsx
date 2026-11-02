import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ErrorAlert } from '../components/common/LoadingSpinner';

const LandingPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ username, password });
      const role = res.user.role;

      // Single Sign-In Role-Based Redirection
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'receptionist') {
        navigate('/receptionist/dashboard');
      } else if (role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="bg-dark min-vh-100 d-flex flex-column justify-content-between">
      {/* Top Navbar */}
      <div className="bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom border-secondary">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
            <i className="bi bi-hospital fs-5"></i>
          </div>
          <span className="fw-bold fs-4 text-white">Med<span className="text-primary">OPD</span> Queue System</span>
        </div>
        <div>
          <Link to="/patient/register" className="btn btn-primary btn-sm fw-semibold">Patient Registration</Link>
        </div>
      </div>

      {/* Main Single Sign-in Card */}
      <div className="container py-5 my-auto">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card card-custom p-4 p-md-5 shadow-lg border-0 bg-white rounded-4">
              <div className="text-center mb-4">
                <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-shield-lock-fill fs-2"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">Unified Sign In</h3>
                <p className="text-muted small">Sign in with your assigned username to enter your portal</p>
              </div>

              <ErrorAlert message={error} onClose={() => setError('')} />

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">Username / Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-person-fill"></i></span>
                    <input
                      type="text"
                      className="form-control form-control-lg fs-6"
                      required
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-lock-fill"></i></span>
                    <input
                      type="password"
                      className="form-control form-control-lg fs-6"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold py-2 fs-6 shadow-sm" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In <i className="bi bi-arrow-right ms-2"></i>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Fill User Buttons (Passwords hidden) */}
              <div className="mt-4 pt-3 border-top">
                <p className="text-muted small fw-semibold mb-2 text-center">Select Account User:</p>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                    onClick={() => handleQuickFill('janushiya', 'januxh@19')}
                  >
                    <i className="bi bi-shield-fill text-danger"></i>
                    <span><strong>janushiya</strong> (Admin)</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning text-dark d-flex align-items-center gap-1"
                    onClick={() => handleQuickFill('chowz', '123456')}
                  >
                    <i className="bi bi-person-workspace text-warning"></i>
                    <span><strong>chowz</strong> (Reception)</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                    onClick={() => handleQuickFill('mythili', '123456')}
                  >
                    <i className="bi bi-person text-primary"></i>
                    <span><strong>mythili</strong> (Patient)</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                    onClick={() => handleQuickFill('rakshana', '123456')}
                  >
                    <i className="bi bi-heart-pulse text-success"></i>
                    <span><strong>rakshana</strong> (Doctor)</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center pt-2">
                <span className="text-muted small">New patient? </span>
                <Link to="/patient/register" className="fw-bold text-primary text-decoration-none small">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-muted py-3 text-center small border-top border-secondary">
        MedOPD Hospital Management System &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default LandingPage;
