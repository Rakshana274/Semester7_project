import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorApi } from '../../services/doctorApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import StatCard from '../../components/common/DashboardCard';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

const DoctorSchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const data = await doctorApi.getSchedule(user?.id || 101);
        setSchedule(data);
      } catch (err) {
        setError('Failed to fetch doctor schedule.');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [user]);

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Today's OPD Session Schedule</h3>
            <p className="text-muted">View session timing parameters, consultation duration, and slot capacity</p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner message="Fetching OPD schedule..." />
          ) : schedule ? (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card card-custom p-4">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                    <div>
                      <span className="badge bg-success text-uppercase mb-1">Session Active</span>
                      <h4 className="fw-bold text-dark mb-0">{schedule.departmentName} OPD</h4>
                    </div>
                    <span className="text-muted">Date: <strong>{schedule.date}</strong></span>
                  </div>

                  {/* Required OPD Schedule Display Fields */}
                  <div className="row g-4">
                    <div className="col-sm-6">
                      <div className="p-3 bg-light rounded border">
                        <span className="text-muted small text-uppercase">Start Time</span>
                        <h4 className="fw-bold text-dark mt-1 mb-0">{schedule.startTime}</h4>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-light rounded border">
                        <span className="text-muted small text-uppercase">End Time</span>
                        <h4 className="fw-bold text-dark mt-1 mb-0">{schedule.endTime}</h4>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-light rounded border">
                        <span className="text-muted small text-uppercase">Consultation Duration</span>
                        <h4 className="fw-bold text-primary mt-1 mb-0">{schedule.consultationDuration} Mins / Patient</h4>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-light rounded border">
                        <span className="text-muted small text-uppercase">Total Session Capacity</span>
                        <h4 className="fw-bold text-dark mt-1 mb-0">{schedule.capacity} Patients</h4>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-light rounded border">
                        <span className="text-muted small text-uppercase">Slots Booked</span>
                        <h4 className="fw-bold text-success mt-1 mb-0">{schedule.booked} Slots</h4>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-light rounded border">
                        <span className="text-muted small text-uppercase">Remaining Capacity</span>
                        <h4 className="fw-bold text-warning mt-1 mb-0">{schedule.remaining} Slots</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card card-custom p-4">
                  <h6 className="fw-bold text-dark mb-3"><i className="bi bi-sliders me-2 text-primary"></i>Session Status</h6>
                  <p className="text-muted small">OPD sessions are dynamically allocated by hospital administration based on patient intake volume.</p>
                  <div className="progress mb-2" style={{ height: '12px' }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${(schedule.booked / schedule.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <small className="text-muted d-block text-center mb-3">
                    {Math.round((schedule.booked / schedule.capacity) * 100)}% Capacity Occupied
                  </small>
                </div>
              </div>
            </div>
          ) : (
            <p>No active OPD session schedule found.</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorSchedule;
