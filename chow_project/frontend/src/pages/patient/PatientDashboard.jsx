import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../services/appointmentApi';
import { notificationApi } from '../../services/notificationApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import DashboardCard from '../../components/common/DashboardCard';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

import { socket } from '../../services/socket';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [nextAppointment, setNextAppointment] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liveSyncTime, setLiveSyncTime] = useState(null);

  const fetchData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const apts = await appointmentApi.getAppointments({ patientId: user?.id || 201 });
      const upcoming = apts.find(a => a.status !== 'Completed' && a.status !== 'Cancelled') || apts[0];
      setNextAppointment(upcoming || null);

      const notifs = await notificationApi.getNotifications(user?.id || 201);
      const unread = notifs.filter(n => n.unread).length;
      setUnreadNotificationsCount(unread);
      setLiveSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Failed to load dashboard metrics.');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);

    // Socket listener for live updates
    const handleLiveQueueUpdate = () => {
      fetchData(false);
    };

    socket.on('queue:updated', handleLiveQueueUpdate);

    return () => {
      socket.off('queue:updated', handleLiveQueueUpdate);
    };
  }, [user]);

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <h3 className="fw-bold text-dark mb-1">Patient Dashboard</h3>
              <p className="text-muted mb-0">Welcome back, <strong className="text-dark">{user?.name || 'Patient'}</strong>. Track your appointments & queue status.</p>
            </div>
            <Link to="/patient/book" className="btn btn-primary d-inline-flex align-items-center gap-2">
              <i className="bi bi-calendar-plus"></i> Book New Appointment
            </Link>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner message="Loading patient dashboard details..." />
          ) : (
            <>
              {/* Required Dashboard Cards */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Next Appointment"
                    value={nextAppointment ? `${nextAppointment.departmentName}` : 'None'}
                    subtitle={nextAppointment ? `Doctor: ${nextAppointment.doctorName}` : 'No upcoming booking'}
                    icon="bi-calendar-event"
                    color="primary"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="card card-custom h-100 p-3">
                    <span className="text-muted text-uppercase fw-semibold fs-7">Priority Level</span>
                    <div className="mt-2">
                      {nextAppointment ? (
                        <PriorityBadge priority={nextAppointment.priority} />
                      ) : (
                        <span className="badge bg-secondary">N/A</span>
                      )}
                    </div>
                    <small className="text-muted mt-2">Score: {nextAppointment?.priorityScore || 'N/A'}</small>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Token Number"
                    value={nextAppointment ? nextAppointment.token : '---'}
                    subtitle={nextAppointment ? `Date: ${nextAppointment.date}` : 'Token not issued'}
                    icon="bi-ticket-perforated"
                    color="warning"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Consultation Time"
                    value={nextAppointment ? nextAppointment.consultationTime : '---'}
                    subtitle="Est. Time of Doctor Meeting"
                    icon="bi-clock-history"
                    color="info"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="card card-custom h-100 p-3">
                    <span className="text-muted text-uppercase fw-semibold fs-7">Appointment Status</span>
                    <div className="mt-2">
                      {nextAppointment ? (
                        <StatusBadge status={nextAppointment.status} />
                      ) : (
                        <span className="badge bg-secondary">No Active Booking</span>
                      )}
                    </div>
                    <small className="text-muted mt-2">Check-in status & queue state</small>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <DashboardCard
                    title="Unread Notifications"
                    value={unreadNotificationsCount}
                    subtitle="Queue & Token Alerts"
                    icon="bi-bell"
                    color="danger"
                  />
                </div>
              </div>

              {/* Next Appointment Detailed Highlight */}
              {nextAppointment && (
                <div className="card card-custom p-4 border-start border-4 border-primary mb-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-primary">Active Consultation Booking</span>
                        <PriorityBadge priority={nextAppointment.priority} />
                        <StatusBadge status={nextAppointment.status} />
                      </div>
                      <h4 className="fw-bold mb-1">{nextAppointment.departmentName} - {nextAppointment.doctorName}</h4>
                      <p className="text-muted mb-0">
                        <i className="bi bi-geo-alt me-1"></i> OPD Desk 2 | Date: <strong>{nextAppointment.date}</strong> | Token: <strong>{nextAppointment.token}</strong>
                      </p>
                      <p className="small text-secondary mt-1 mb-0">
                        <strong>Symptoms Submitted:</strong> {nextAppointment.symptoms}
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <Link to={`/patient/appointments/${nextAppointment.id}`} className="btn btn-outline-primary btn-sm">
                        View Details & Token
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PatientDashboard;
