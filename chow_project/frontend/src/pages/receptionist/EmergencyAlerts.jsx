import React, { useEffect, useState } from 'react';
import { receptionistApi } from '../../services/receptionistApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import PriorityBadge from '../../components/common/PriorityBadge';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

import { socket } from '../../services/socket';

const EmergencyAlerts = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmergencies(true);

    const handleEmergencyAlert = (newAlert) => {
      console.log('🚨 Live Emergency Alert Received:', newAlert);
      fetchEmergencies(false);
    };

    socket.on('emergency:alert', handleEmergencyAlert);

    return () => {
      socket.off('emergency:alert', handleEmergencyAlert);
    };
  }, []);

  const fetchEmergencies = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await receptionistApi.getEmergencies();
      setEmergencies(data);
    } catch (err) {
      setError('Failed to fetch emergency triage list.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          {/* Prominent Emergency Banner */}
          <div className="emergency-banner mb-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-exclamation-triangle-fill fs-1 text-warning"></i>
              <div>
                <h4 className="fw-bold mb-1">EMERGENCY TRIAGE DASHBOARD</h4>
                <p className="mb-0 opacity-90">Emergency patients are strictly separated from normal OPD queues and given immediate priority.</p>
              </div>
            </div>
            <button className="btn btn-light text-danger fw-bold btn-sm" onClick={fetchEmergencies}>
              <i className="bi bi-arrow-clockwise me-1"></i> Live Refresh
            </button>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner message="Fetching emergency triage alerts..." />
          ) : (
            <div className="row g-4">
              {emergencies.length > 0 ? (
                emergencies.map(emg => (
                  <div key={emg.id} className="col-lg-6">
                    <div className="card card-custom p-4 border-start border-4 border-danger h-100 shadow">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="badge bg-danger text-uppercase me-2">{emg.triageScore}</span>
                          <span className="badge bg-dark text-white me-2">{emg.id}</span>
                        </div>
                        <PriorityBadge priority="Emergency" />
                      </div>

                      <h5 className="fw-bold text-dark my-2">{emg.patientName}</h5>
                      <p className="text-secondary small mb-2"><i className="bi bi-telephone me-1"></i>{emg.phone}</p>
                      
                      <div className="p-3 bg-danger-subtle rounded text-danger mb-3 border border-danger-subtle">
                        <strong>Chief Symptoms:</strong> {emg.symptoms}
                      </div>

                      <div className="row g-2 small text-muted border-top pt-2 mt-auto">
                        <div className="col-6"><strong>Assigned Department:</strong> {emg.department}</div>
                        <div className="col-6"><strong>Attending Doctor:</strong> {emg.doctor}</div>
                        <div className="col-6"><strong>Triage Location:</strong> {emg.location}</div>
                        <div className="col-6"><strong>Alert Time:</strong> {emg.timestamp}</div>
                      </div>

                      <div className="d-flex gap-2 mt-3 pt-2 border-top">
                        <button className="btn btn-danger btn-sm w-100 fw-semibold">
                          <i className="bi bi-box-arrow-in-right me-1"></i> Transfer to Resuscitation Bay
                        </button>
                        <button className="btn btn-outline-secondary btn-sm">
                          Override Priority
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="card card-custom p-5 text-center">
                    <i className="bi bi-shield-check text-success fs-1 mb-2"></i>
                    <h5 className="fw-bold">No Active Emergency Triage Cases</h5>
                    <p className="text-muted">Normal OPD queues are operating without emergency interruptions.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default EmergencyAlerts;
