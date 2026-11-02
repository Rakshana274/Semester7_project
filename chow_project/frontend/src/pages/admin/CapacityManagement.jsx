import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import StatCard from '../../components/common/DashboardCard';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../../components/common/LoadingSpinner';

const CapacityManagement = () => {
  const [capacity, setCapacity] = useState({
    normalBookingCapacity: 120,
    walkinCapacity: 30,
    totalCapacity: 150,
    currentBookedNormal: 86,
    currentBookedWalkin: 18,
    utilizationRate: '69.3%'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCapacity();
  }, []);

  const fetchCapacity = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCapacityConfig();
      setCapacity(data);
    } catch (err) {
      setError('Failed to fetch capacity configurations.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const total = Number(capacity.normalBookingCapacity) + Number(capacity.walkinCapacity);
    const booked = Number(capacity.currentBookedNormal) + Number(capacity.currentBookedWalkin);
    const utilPct = ((booked / total) * 100).toFixed(1) + '%';

    const updated = {
      ...capacity,
      totalCapacity: total,
      utilizationRate: utilPct
    };

    try {
      await adminApi.updateCapacityConfig(updated);
      setCapacity(updated);
      setSuccess('Capacity configuration updated successfully.');
    } catch (err) {
      setError('Failed to save capacity settings.');
    } finally {
      setSaving(false);
    }
  };

  const totalBooked = Number(capacity.currentBookedNormal) + Number(capacity.currentBookedWalkin);
  const totalCap = Number(capacity.totalCapacity);
  const utilPctNumber = Math.min(100, Math.round((totalBooked / totalCap) * 100));

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Capacity Management & Quota Limits</h3>
            <p className="text-muted">Configure normal booking quota, walk-in reservations & monitor real-time utilization</p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          {loading ? (
            <LoadingSpinner message="Fetching capacity metrics..." />
          ) : (
            <div className="row g-4">
              <div className="col-lg-7">
                <div className="card card-custom p-4">
                  <h5 className="fw-bold text-dark mb-3"><i className="bi bi-sliders me-2 text-danger"></i>Capacity Quotas Configuration</h5>
                  <form onSubmit={handleSave}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Normal Booking Capacity (Slots)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="1"
                        value={capacity.normalBookingCapacity}
                        onChange={(e) => setCapacity({ ...capacity, normalBookingCapacity: Number(e.target.value) })}
                      />
                      <small className="text-muted">Allocated for online/pre-booked appointments</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Walk-in Capacity (Slots)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="1"
                        value={capacity.walkinCapacity}
                        onChange={(e) => setCapacity({ ...capacity, walkinCapacity: Number(e.target.value) })}
                      />
                      <small className="text-muted">Reserved for same-day walk-in desk registrations</small>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Total Capacity (Calculated Limit)</label>
                      <input
                        type="number"
                        className="form-control bg-light fw-bold text-primary"
                        disabled
                        value={Number(capacity.normalBookingCapacity) + Number(capacity.walkinCapacity)}
                      />
                    </div>

                    <button type="submit" className="btn btn-danger" disabled={saving}>
                      {saving ? 'Updating Quotas...' : 'Save Capacity Configuration'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Display Capacity Utilization Progress */}
              <div className="col-lg-5">
                <div className="card card-custom p-4 h-100">
                  <h5 className="fw-bold text-dark mb-3"><i className="bi bi-pie-chart me-2 text-primary"></i>Capacity Utilization</h5>

                  <div className="text-center my-3">
                    <h1 className="display-4 fw-bold text-primary mb-1">{utilPctNumber}%</h1>
                    <span className="text-muted">Current OPD Capacity Utilization</span>
                  </div>

                  <div className="progress mb-3" style={{ height: '18px' }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${(capacity.currentBookedNormal / totalCap) * 100}%` }}
                      title="Normal Bookings"
                    ></div>
                    <div
                      className="progress-bar bg-warning"
                      style={{ width: `${(capacity.currentBookedWalkin / totalCap) * 100}%` }}
                      title="Walk-in Bookings"
                    ></div>
                  </div>

                  <div className="d-flex flex-column gap-2 small text-secondary border-top pt-3 mt-auto">
                    <div className="d-flex justify-content-between">
                      <span>Normal Bookings Used:</span>
                      <strong className="text-dark">{capacity.currentBookedNormal} / {capacity.normalBookingCapacity} Slots</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Walk-in Bookings Used:</span>
                      <strong className="text-dark">{capacity.currentBookedWalkin} / {capacity.walkinCapacity} Slots</strong>
                    </div>
                    <div className="d-flex justify-content-between border-top pt-2">
                      <span className="fw-bold">Total Remaining Capacity:</span>
                      <strong className="text-success fw-bold">{totalCap - totalBooked} Slots Free</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CapacityManagement;
