import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../services/appointmentApi';
import { socket } from '../../services/socket';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import DataTable from '../../components/common/DataTable';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, ErrorAlert } from '../../components/common/LoadingSpinner';

const DoctorQueue = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchQueue(true);

    // Real-Time Socket Listener
    const handleLiveQueueUpdate = (data) => {
      console.log('⚡ [DoctorQueue] Live Queue Event received:', data);
      fetchQueue(false); // Seamless refresh without blocking spinner
      setLastUpdated(new Date().toLocaleTimeString());
    };

    socket.on('queue:updated', handleLiveQueueUpdate);

    return () => {
      socket.off('queue:updated', handleLiveQueueUpdate);
    };
  }, [user]);

  const fetchQueue = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await appointmentApi.getAppointments({ doctorId: user?.id || 101 });
      // Sort queue by priorityScore descending
      const sorted = [...data].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
      setQueue(sorted);
    } catch (err) {
      setError('Failed to fetch OPD queue.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const columns = [
    { header: 'Token', accessor: 'token', render: (r) => <span className="badge bg-light text-dark border fw-bold fs-6">{r.token}</span> },
    { header: 'Patient', accessor: 'patientName', render: (r) => <span className="fw-semibold text-dark">{r.patientName}</span> },
    { header: 'Priority', accessor: 'priority', render: (r) => <PriorityBadge priority={r.priority} /> },
    { header: 'Priority Score', accessor: 'priorityScore', render: (r) => <span className="fw-bold">{r.priorityScore || 50}/100</span> },
    { header: 'Consultation Time', accessor: 'consultationTime' },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Action',
      render: (r) => (
        <Link to={`/doctor/queue/${r._id || r.id || r.appointmentCode}`} className="btn btn-sm btn-success fw-semibold">
          <i className="bi bi-person-bounding-box me-1"></i> Consultation Info
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h3 className="fw-bold text-dark mb-0">Today's Doctor OPD Queue</h3>
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1 small">
                  <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '7px', height: '7px' }}></span>
                  Live Sync
                </span>
              </div>
              <p className="text-muted mb-0 small">
                Prioritized consultation sequence based on dynamic symptom triage scoring
                {lastUpdated && <span className="text-success ms-2">• Last synced: {lastUpdated}</span>}
              </p>
            </div>
            <button className="btn btn-outline-success btn-sm" onClick={() => fetchQueue(true)}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Queue
            </button>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner message="Fetching doctor queue..." />
          ) : (
            <div className="card card-custom p-3 shadow-sm border-0">
              <DataTable
                columns={columns}
                data={queue}
                keyField="_id"
                emptyMessage="No patients currently waiting in your OPD queue."
              />
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorQueue;
