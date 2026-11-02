import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import StatCard from '../../components/common/DashboardCard';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../../components/common/LoadingSpinner';

const WalkinManagement = () => {
  const [walkinConfig, setWalkinConfig] = useState({
    reservedSlots: 30,
    availableSlots: 12,
    usedSlots: 18,
    allowSameDayWalkins: true,
    walkinStartTime: '08:30 AM'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWalkinConfig();
  }, []);

  const fetchWalkinConfig = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getWalkinConfig();
      setWalkinConfig(data);
    } catch (err) {
      setError('Failed to fetch walk-in settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const avail = Number(walkinConfig.reservedSlots) - Number(walkinConfig.usedSlots);

    const updated = {
      ...walkinConfig,
      availableSlots: Math.max(0, avail)
    };

    try {
      await adminApi.updateWalkinConfig(updated);
      setWalkinConfig(updated);
      setSuccess('Walk-in quota & slot settings updated successfully.');
    } catch (err) {
      setError('Failed to save walk-in settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Walk-in Management & Slot Reservation</h3>
            <p className="text-muted">Configure reserved walk-in slot quotas, monitor available vs used slots</p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          {loading ? (
            <LoadingSpinner message="Fetching walk-in configurations..." />
          ) : (
            <>
              {/* Stat Cards for Reserved, Available, Used Slots */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <StatCard
                    title="Reserved Walk-in Slots"
                    value={walkinConfig.reservedSlots}
                    subtitle="Total walk-in allocation"
                    icon="bi-person-walking"
                    color="primary"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <StatCard
                    title="Available Slots"
                    value={walkinConfig.availableSlots}
                    subtitle="Free for desk allocation"
                    icon="bi-check-circle"
                    color="success"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <StatCard
                    title="Used Slots"
                    value={walkinConfig.usedSlots}
                    subtitle="Issued walk-in tokens"
                    icon="bi-ticket-perforated"
                    color="warning"
                  />
                </div>
              </div>

              {/* Form to Configure Walk-in Parameters */}
              <div className="card card-custom p-4 max-w-2xl">
                <h5 className="fw-bold text-dark mb-3"><i className="bi bi-gear me-2 text-danger"></i>Walk-in Slot Settings</h5>
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Reserved Walk-in Slots Quota</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="0"
                      value={walkinConfig.reservedSlots}
                      onChange={(e) => setWalkinConfig({ ...walkinConfig, reservedSlots: Number(e.target.value) })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Used Slots Count</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="0"
                      value={walkinConfig.usedSlots}
                      onChange={(e) => setWalkinConfig({ ...walkinConfig, usedSlots: Number(e.target.value) })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Available Slots (Calculated)</label>
                    <input
                      type="number"
                      className="form-control bg-light fw-bold text-success"
                      disabled
                      value={Math.max(0, Number(walkinConfig.reservedSlots) - Number(walkinConfig.usedSlots))}
                    />
                  </div>

                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="allowWalkins"
                        checked={walkinConfig.allowSameDayWalkins}
                        onChange={(e) => setWalkinConfig({ ...walkinConfig, allowSameDayWalkins: e.target.checked })}
                      />
                      <label className="form-check-label fw-semibold text-dark" htmlFor="allowWalkins">
                        Enable Same-Day Desk Walk-in Registration
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-danger" disabled={saving}>
                    {saving ? 'Updating Walk-in Rules...' : 'Save Walk-in Settings'}
                  </button>
                </form>
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default WalkinManagement;
