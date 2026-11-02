import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patientApi } from '../../services/patientApi';
import { appointmentApi } from '../../services/appointmentApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const pData = await patientApi.getProfile(id);
        const aData = await appointmentApi.getAppointments({ patientId: Number(id) });
        setPatient(pData);
        setAppointments(aData);
      } catch (err) {
        setError('Failed to fetch patient details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="mb-4">
            <Link to="/receptionist/patients" className="btn btn-outline-secondary btn-sm mb-2">
              <i className="bi bi-arrow-left me-1"></i> Back to Patient Search
            </Link>
            <h3 className="fw-bold text-dark mb-1">Patient Details (#{id})</h3>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner message="Fetching patient profile..." />
          ) : patient ? (
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="card card-custom p-4">
                  <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
                    <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                      <i className="bi bi-person-fill fs-2"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-0">{patient.name}</h5>
                      <small className="text-muted">Patient ID: #{patient.id}</small>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 text-secondary">
                    <div><strong>Email:</strong> {patient.email}</div>
                    <div><strong>Phone:</strong> {patient.phone}</div>
                    <div><strong>Age / Gender:</strong> {patient.age} years / {patient.gender}</div>
                    <div className="mt-2 pt-2 border-top">
                      <strong>Chronic Conditions:</strong>
                      <p className="mb-0 text-dark fw-semibold">{patient.chronicConditions || 'None reported'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="card card-custom p-4">
                  <h6 className="fw-bold text-dark mb-3">Appointment History & Queue Logs</h6>
                  {appointments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Token</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Priority</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map(apt => (
                            <tr key={apt.id}>
                              <td><span className="badge bg-light text-dark border fw-bold">{apt.token}</span></td>
                              <td>{apt.doctorName}</td>
                              <td>{apt.date}</td>
                              <td><PriorityBadge priority={apt.priority} /></td>
                              <td><StatusBadge status={apt.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No past appointment history found for this patient.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>Patient record not found.</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PatientDetails;
