import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { appointmentApi } from '../../services/appointmentApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, ErrorAlert, SuccessAlert, ConfirmModal } from '../../components/common/LoadingSpinner';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await appointmentApi.getAppointmentById(id);
        setAppointment(data);
      } catch (err) {
        setError('Appointment details not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleCancelAppointment = async () => {
    try {
      await appointmentApi.cancelAppointment(id);
      setAppointment(prev => ({ ...prev, status: 'Cancelled' }));
      setSuccess('Appointment cancelled successfully.');
      setShowCancelModal(false);
    } catch (err) {
      setError('Failed to cancel appointment.');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="mb-4">
            <Link to="/patient/appointments" className="btn btn-outline-secondary btn-sm mb-2">
              <i className="bi bi-arrow-left me-1"></i> Back to My Appointments
            </Link>
            <h3 className="fw-bold text-dark mb-1">Appointment Details ({id})</h3>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          {loading ? (
            <LoadingSpinner message="Fetching appointment information..." />
          ) : appointment ? (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card card-custom p-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <div>
                      <span className="badge bg-light text-dark border me-2">{appointment.id}</span>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <PriorityBadge priority={appointment.priority} />
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <label className="text-muted small">Doctor</label>
                      <h6 className="fw-bold text-dark">{appointment.doctorName}</h6>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small">Department</label>
                      <h6 className="fw-bold text-dark">{appointment.departmentName}</h6>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small">Scheduled Date</label>
                      <h6 className="fw-bold text-dark">{appointment.date}</h6>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small">Consultation Time</label>
                      <h6 className="fw-bold text-dark">{appointment.consultationTime}</h6>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small">Token Number</label>
                      <h5 className="fw-bold text-primary">{appointment.token}</h5>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small">Priority Score</label>
                      <h5 className="fw-bold text-dark">{appointment.priorityScore} / 100</h5>
                    </div>
                  </div>

                  <div className="border-top pt-3">
                    <h6 className="fw-bold text-dark mb-2">Symptoms Submitted</h6>
                    <div className="p-3 bg-light rounded text-secondary">
                      {appointment.symptoms || 'No symptoms specified.'}
                    </div>
                  </div>

                  {/* Cancellation option */}
                  {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                    <div className="mt-4 pt-3 border-top d-flex justify-content-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => setShowCancelModal(true)}
                      >
                        <i className="bi bi-x-circle me-1"></i> Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Info Card */}
              <div className="col-lg-4">
                <div className="card card-custom p-4">
                  <h6 className="fw-bold text-dark mb-3"><i className="bi bi-info-circle text-primary me-2"></i>Instructions</h6>
                  <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                    <li><i className="bi bi-check2 text-success me-2"></i>Please report to Reception 15 minutes before your consultation time.</li>
                    <li><i className="bi bi-check2 text-success me-2"></i>Show your Token ID (<strong>{appointment.token}</strong>) at check-in.</li>
                    <li><i className="bi bi-check2 text-success me-2"></i>Keep notifications enabled to receive real-time token calls.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p>No appointment details found.</p>
          )}

          <ConfirmModal
            isOpen={showCancelModal}
            title="Cancel Appointment"
            message={`Are you sure you want to cancel appointment ${id}? This action cannot be undone.`}
            onConfirm={handleCancelAppointment}
            onCancel={() => setShowCancelModal(false)}
            confirmText="Yes, Cancel Booking"
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentDetails;
