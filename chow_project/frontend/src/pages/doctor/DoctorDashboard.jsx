import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../services/appointmentApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import DashboardCard from '../../components/common/DashboardCard';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true);
      try {
        const data = await appointmentApi.getAppointments({ doctorId: user?.id || 101 });
        setAppointments(data);
      } catch (err) {
        setError('Failed to fetch doctor dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, [user]);

  const totalPatients = appointments.length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const remainingCount = totalPatients - completedCount;
  const highPriorityCount = appointments.filter(a => a.priority === 'High' || a.priority === 'Emergency').length;
  const mediumPriorityCount = appointments.filter(a => a.priority === 'Medium').length;
  const lowPriorityCount = appointments.filter(a => a.priority === 'Low').length;

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <h3 className="fw-bold text-dark mb-1">Doctor Consultation Dashboard</h3>
              <p className="text-muted mb-0">Welcome, <strong className="text-dark">{user?.name || 'Dr. Sarah Jenkins'}</strong> (Cardiology OPD Room 102)</p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/doctor/schedule" className="btn btn-outline-primary btn-sm">
                <i className="bi bi-clock me-1"></i> Today's Schedule
              </Link>
              <Link to="/doctor/queue" className="btn btn-success btn-sm fw-semibold">
                <i className="bi bi-play-circle me-1"></i> Start Consultation Call
              </Link>
            </div>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner message="Loading doctor dashboard..." />
          ) : (
            <>
              {/* Required Dashboard Cards */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Today's Patients"
                    value={totalPatients}
                    subtitle="Total OPD bookings"
                    icon="bi-person-lines-fill"
                    color="primary"
                    onClick={() => navigate('/doctor/queue')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Completed"
                    value={completedCount}
                    subtitle="Consultations finished"
                    icon="bi-check2-all"
                    color="success"
                    onClick={() => navigate('/doctor/queue')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Remaining"
                    value={remainingCount}
                    subtitle="Patients awaiting consultation"
                    icon="bi-hourglass-split"
                    color="warning"
                    onClick={() => navigate('/doctor/queue')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="High Priority"
                    value={highPriorityCount}
                    subtitle="Triage Score > 75"
                    icon="bi-exclamation-triangle"
                    color="danger"
                    onClick={() => navigate('/doctor/queue')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Medium Priority"
                    value={mediumPriorityCount}
                    subtitle="Standard priority cases"
                    icon="bi-dash-circle"
                    color="info"
                    onClick={() => navigate('/doctor/queue')}
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Low Priority"
                    value={lowPriorityCount}
                    subtitle="Routine follow-ups"
                    icon="bi-check-circle"
                    color="purple"
                    onClick={() => navigate('/doctor/queue')}
                  />
                </div>
              </div>

              {/* Priority Ranked Live Queue Preview */}
              <div className="card card-custom p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-dark mb-0">Priority Ranked OPD Queue</h6>
                  <Link to="/doctor/queue" className="btn btn-outline-success btn-sm">Full Queue View</Link>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Token</th>
                        <th>Patient Name</th>
                        <th>Priority</th>
                        <th>Priority Score</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map(apt => (
                        <tr key={apt.id}>
                          <td><span className="badge bg-light text-dark border fw-bold">{apt.token}</span></td>
                          <td className="fw-semibold">{apt.patientName}</td>
                          <td><PriorityBadge priority={apt.priority} /></td>
                          <td><span className="fw-bold">{apt.priorityScore}</span>/100</td>
                          <td>{apt.consultationTime}</td>
                          <td><StatusBadge status={apt.status} /></td>
                          <td>
                            <Link to={`/doctor/queue/${apt.id}`} className="btn btn-sm btn-success">
                              Call Patient
                            </Link>
                          </td>
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

export default DoctorDashboard;
