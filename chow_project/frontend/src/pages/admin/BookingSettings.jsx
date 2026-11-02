import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../../components/common/LoadingSpinner';

const BookingSettings = () => {
  const [settings, setSettings] = useState({
    bookingCutoffTime: '17:00',
    nextDayBookingRules: 'Allow next-day bookings up to 24 hours prior to OPD start time.',
    highPriorityThreshold: 75,
    mediumPriorityThreshold: 45,
    emergencyAutoOverride: true,
    maxDailyBookingsPerPatient: 2,
    walkinReservedPercentage: 20,
    queueGenerationMode: 'AI Dynamic Triage'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSettings();
      setSettings(data);
    } catch (err) {
      setError('Failed to fetch booking settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await adminApi.updateSettings(settings);
      setSuccess('Booking settings & priority algorithms updated.');
    } catch (err) {
      setError('Failed to save settings.');
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
            <h3 className="fw-bold text-dark mb-1">Global Booking & Queue Settings</h3>
            <p className="text-muted">Configure OPD booking cutoff times, next-day rules, priority thresholds & queue parameters</p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          {loading ? (
            <LoadingSpinner message="Fetching global booking settings..." />
          ) : (
            <div className="card card-custom p-4 max-w-3xl">
              <form onSubmit={handleSave}>
                <h5 className="fw-bold text-dark mb-3"><i className="bi bi-clock-history me-2 text-danger"></i>Booking Cutoff & Next-Day Rules</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Daily Booking Cutoff Time</label>
                    <input
                      type="time"
                      className="form-control"
                      required
                      value={settings.bookingCutoffTime}
                      onChange={(e) => setSettings({ ...settings, bookingCutoffTime: e.target.value })}
                    />
                    <small className="text-muted">Same-day online booking cutoff</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Next-Day Booking Rules Description</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={settings.nextDayBookingRules}
                      onChange={(e) => setSettings({ ...settings, nextDayBookingRules: e.target.value })}
                    />
                  </div>
                </div>

                <h5 className="fw-bold text-dark mb-3"><i className="bi bi-activity me-2 text-danger"></i>Priority Thresholds & Score Calibration</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">High Priority Score Threshold (0 - 100)</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="50"
                      max="95"
                      value={settings.highPriorityThreshold}
                      onChange={(e) => setSettings({ ...settings, highPriorityThreshold: Number(e.target.value) })}
                    />
                    <small className="text-muted">Scores above this score are flagged High Priority</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Medium Priority Score Threshold</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="20"
                      max="60"
                      value={settings.mediumPriorityThreshold}
                      onChange={(e) => setSettings({ ...settings, mediumPriorityThreshold: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <h5 className="fw-bold text-dark mb-3"><i className="bi bi-list-ol me-2 text-danger"></i>Queue Generation Settings</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Queue Generation Algorithm Mode</label>
                    <select
                      className="form-select"
                      value={settings.queueGenerationMode}
                      onChange={(e) => setSettings({ ...settings, queueGenerationMode: e.target.value })}
                    >
                      <option value="AI Dynamic Triage">AI Dynamic Triage Scoring</option>
                      <option value="First-Come First-Served">First-Come First-Served (FIFO)</option>
                      <option value="Strict Emergency Override">Strict Emergency Override</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Max Daily Bookings Per Patient</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="1"
                      value={settings.maxDailyBookingsPerPatient}
                      onChange={(e) => setSettings({ ...settings, maxDailyBookingsPerPatient: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-danger py-2 px-4 fw-semibold" disabled={saving}>
                  {saving ? 'Updating Global Settings...' : 'Save Configuration Changes'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default BookingSettings;
