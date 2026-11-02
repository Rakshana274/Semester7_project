import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentApi } from '../../services/appointmentApi';
import { receptionistApi } from '../../services/receptionistApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import DashboardCard from '../../components/common/DashboardCard';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apts = await appointmentApi.getAppointments();
        const emgs = await receptionistApi.getEmergencies();
        setAppointments(apts);
        setEmergencies(emgs);
      } catch (err) {
        setError('Failed to fetch receptionist metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalToday = appointments.length;
  const checkedInCount = appointments.filter(a => a.status === 'Checked In').length;
  const waitingCount = appointments.filter(a => a.status === 'Waiting' || a.status === 'Scheduled').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const highPriorityCount = appointments.filter(a => a.priority === 'High' || a.priority === 'Emergency').length;
  const emergencyAlertsCount = emergencies.length;

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <h3 className="fw-bold text-dark mb-1">Receptionist Dashboard</h3>
              <p className="text-muted mb-0">Overview of today's OPD triage queue & desk operations</p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/receptionist/walkins" className="btn btn-primary btn-sm">
                <i className="bi bi-person-plus me-1"></i> Register Walk-in
              </Link>
              <Link to="/receptionist/emergencies" className="btn btn-danger btn-sm">
                <i className="bi bi-exclamation-triangle me-1"></i> Emergency Triage ({emergencyAlertsCount})
              </Link>
            </div>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner message="Loading reception desk stats..." />
          ) : (
            <>
              {/* Required Dashboard Cards */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Today's Patients"
                    value={totalToday}
                    subtitle="Total OPD registrations"
                    icon="bi-people"
                    color="primary"
                    onClick={() => navigate('/receptionist/queue')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Checked In"
                    value={checkedInCount}
                    subtitle="Reporting at desk"
                    icon="bi-person-check"
                    color="purple"
                    onClick={() => navigate('/receptionist/queue')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Waiting"
                    value={waitingCount}
                    subtitle="Awaiting doctor call"
                    icon="bi-clock-history"
                    color="warning"
                    onClick={() => navigate('/receptionist/queue')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Completed"
                    value={completedCount}
                    subtitle="Consultations finished"
                    icon="bi-check-circle"
                    color="success"
                    onClick={() => navigate('/receptionist/queue')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="High Priority"
                    value={highPriorityCount}
                    subtitle="Triage score > 75"
                    icon="bi-exclamation-circle"
                    color="danger"
                    onClick={() => navigate('/receptionist/queue')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Emergency Alerts"
                    value={emergencyAlertsCount}
                    subtitle="Immediate triage cases"
                    icon="bi-lightning-charge"
                    color="danger"
                    onClick={() => navigate('/receptionist/emergencies')}
                  />
                </div>
              </div>

              {/* Quick Queue Summary Table */}
              <div className="card card-custom p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Active OPD Queue Overview</h6>
                  <Link to="/receptionist/queue" className="btn btn-outline-primary btn-sm">View Full Queue</Link>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Token</th>
                        <th>Patient Name</th>
                        <th>Doctor</th>
                        <th>Priority</th>
                        <th>Consultation Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map(apt => (
                        <tr key={apt.id}>
                          <td><span className="badge bg-light text-dark border fw-bold">{apt.token}</span></td>
                          <td className="fw-semibold">{apt.patientName}</td>
                          <td>{apt.doctorName}</td>
                          <td><PriorityBadge priority={apt.priority} /></td>
                          <td>{apt.consultationTime}</td>
                          <td><StatusBadge status={apt.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ReceptionistDashboard;
