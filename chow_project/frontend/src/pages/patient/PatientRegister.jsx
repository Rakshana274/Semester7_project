import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ErrorAlert, SuccessAlert } from '../../components/common/LoadingSpinner';

const PatientRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    chronicConditions: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/patient/login'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5 px-3">
      <div className="card card-custom p-4 p-md-5 shadow-lg border-0" style={{ maxWidth: '520px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
            <i className="bi bi-person-plus-fill fs-3"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">Patient Registration</h3>
          <p className="text-muted small">Register to book OPD consultations</p>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />
        <SuccessAlert message={success} onClose={() => setSuccess('')} />

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              required
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                required
                placeholder="+1 555-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark">Age</label>
              <input
                type="number"
                name="age"
                className="form-control"
                required
                min="1"
                max="120"
                placeholder="e.g. 35"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">Pre-existing / Chronic Conditions</label>
            <textarea
              name="chronicConditions"
              className="form-control"
              rows="2"
              placeholder="e.g. Hypertension, Asthma (Leave blank if none)"
              value={formData.chronicConditions}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
            {loading ? 'Registering Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-4 text-center border-top pt-3">
          <span className="text-muted small me-2">Already registered?</span>
          <Link to="/patient/login" className="fw-semibold text-primary text-decoration-none">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;
