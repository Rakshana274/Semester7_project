import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { appointmentApi } from '../../services/appointmentApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../../components/common/LoadingSpinner';

const PatientQueueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
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
    fetchAppointment();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await appointmentApi.updateStatus(id, newStatus);
      setAppointment(prev => ({ ...prev, status: newStatus }));
      setSuccess(`Consultation status updated to: ${newStatus}`);
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="mb-4">
            <Link to="/doctor/queue" className="btn btn-outline-secondary btn-sm mb-2">
              <i className="bi bi-arrow-left me-1"></i> Back to Today's Queue
            </Link>
            <h3 className="fw-bold text-dark mb-1">OPD Consultation Routing ({id})</h3>
            <p className="text-muted">Appointment routing information & consultation queue dispatch control</p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          {loading ? (
            <LoadingSpinner message="Loading appointment routing parameters..." />
          ) : appointment ? (
            <div className="row g-4">
              <div className="col-lg-8">
                {/* Appointment Information Card Required for OPD Consultation Routing */}
                <div className="card card-custom p-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <div>
                      <span className="badge bg-light text-dark border me-2">Token: {appointment.token}</span>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <PriorityBadge priority={appointment.priority} />
                  </div>

                  <h5 className="fw-bold text-dark mb-3">Patient Demographics & Queue Routing Info</h5>

                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <label className="text-muted small">Patient Name</label>
                      <h6 className="fw-bold text-dark">{appointment.patientName}</h6>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small">Contact Phone</label>
                      <h6 className="fw-bold text-dark">{appointment.patientPhone}</h6>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small">Age / Gender</label>
                      <h6 className="fw-bold text-dark">{appointment.patientAge} Years / {appointment.patientGender}</h6>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small">Assigned Doctor & Dept</label>
                      <h6 className="fw-bold text-dark">{appointment.doctorName} ({appointment.departmentName})</h6>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small">Consultation Slot</label>
                      <h6 className="fw-bold text-primary">{appointment.date} at {appointment.consultationTime}</h6>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small">Priority Score</label>
                      <h6 className="fw-bold text-dark">{appointment.priorityScore} / 100</h6>
                    </div>
                  </div>

                  <div className="border-top pt-3 mb-4">
                    <h6 className="fw-bold text-dark mb-2">Chief Complaint & Symptoms Submitted</h6>
                    <div className="p-3 bg-light rounded text-dark">
                      {appointment.symptoms || 'No symptoms reported.'}
                    </div>
                  </div>

                  {/* Consultation Status Dispatch Actions */}
                  <div className="border-top pt-3">
                    <h6 className="fw-bold text-dark mb-2">OPD Consultation Routing Actions</h6>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-outline-purple btn-sm btn-primary"
                        onClick={() => handleUpdateStatus('In Consultation')}
                      >
                        <i className="bi bi-person-video me-1"></i> Call Patient In
                      </button>
                      <button
                        className="btn btn-success btn-sm fw-semibold"
                        onClick={() => handleUpdateStatus('Completed')}
                      >
                        <i className="bi bi-check2-circle me-1"></i> Mark Consultation Completed
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card card-custom p-4 bg-light border-0">
                  <h6 className="fw-bold text-dark mb-2"><i className="bi bi-shield-check text-success me-2"></i>Routing Compliance</h6>
                  <p className="small text-muted mb-0">
                    This screen provides strict OPD queue routing data only. Clinical diagnosis, EHR, prescription, and lab entry are routed through external EMR modules.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p>No appointment details found.</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PatientQueueDetails;
