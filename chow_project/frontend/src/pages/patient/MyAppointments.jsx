import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../services/appointmentApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import DataTable from '../../components/common/DataTable';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await appointmentApi.getAppointments({ patientId: user?.id || 201 });
        setAppointments(data);
      } catch (err) {
        setError('Failed to fetch appointment history.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user]);

  const columns = [
    { header: 'Appointment ID', accessor: 'id', render: (row) => <span className="fw-bold text-dark">{row.id}</span> },
    { header: 'Doctor', accessor: 'doctorName' },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Token', accessor: 'token', render: (row) => <span className="badge bg-light text-dark border fw-bold">{row.token}</span> },
    { header: 'Priority', accessor: 'priority', render: (row) => <PriorityBadge priority={row.priority} /> },
    { header: 'Consultation Time', accessor: 'consultationTime' },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Action',
      render: (row) => (
        <Link to={`/patient/appointments/${row.id}`} className="btn btn-sm btn-outline-primary">
          <i className="bi bi-eye me-1"></i> Details
        </Link>
      )
    }
  ];

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <h3 className="fw-bold text-dark mb-1">My Appointments</h3>
              <p className="text-muted mb-0">View & track your consultation bookings</p>
            </div>
            <Link to="/patient/book" className="btn btn-primary btn-sm">
              <i className="bi bi-plus-lg me-1"></i> Book Appointment
            </Link>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner message="Loading your appointments..." />
          ) : (
            <div className="card card-custom p-3">
              <DataTable
                columns={columns}
                data={appointments}
                keyField="id"
                emptyMessage="You have no appointment bookings yet."
              />
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MyAppointments;
