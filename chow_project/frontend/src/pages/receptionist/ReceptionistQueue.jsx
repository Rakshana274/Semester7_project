import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentApi } from '../../services/appointmentApi';
import { socket } from '../../services/socket';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import DataTable from '../../components/common/DataTable';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../../components/common/LoadingSpinner';

const ReceptionistQueue = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    fetchQueue(true);

    // Real-Time Socket Listener
    const handleQueueUpdate = (data) => {
      console.log('⚡ [ReceptionistQueue] Live Queue Updated via Socket.io:', data);
      fetchQueue(false);
      setLastSync(new Date().toLocaleTimeString());
    };

    socket.on('queue:updated', handleQueueUpdate);

    return () => {
      socket.off('queue:updated', handleQueueUpdate);
    };
  }, []);

  const fetchQueue = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await appointmentApi.getAppointments();
      setAppointments(data);
    } catch (err) {
      setError('Failed to fetch queue list.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleCheckIn = async (record) => {
    try {
      const targetId = record._id || record.id || record.appointmentCode;
      await appointmentApi.updateStatus(targetId, 'Checked In');
      setSuccess(`Token ${record.token} (${record.patientName}) marked as Checked In.`);
      fetchQueue(false);
    } catch (err) {
      setError('Failed to check in patient.');
    }
  };

  const columns = [
    { header: 'Token', accessor: 'token', render: (r) => <span className="badge bg-light text-dark border fw-bold fs-6">{r.token}</span> },
    { 
      header: 'Patient', 
      accessor: 'patientName', 
      render: (r) => (
        <span className="fw-semibold text-dark">{r.patientName}</span>
      ) 
    },
    { header: 'Doctor', accessor: 'doctorName' },
    { header: 'Priority', accessor: 'priority', render: (r) => <PriorityBadge priority={r.priority} /> },
    { header: 'Consultation Time', accessor: 'consultationTime' },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Check-in Time', accessor: 'checkInTime', render: (r) => r.checkInTime || <span className="text-muted small">Not Checked In</span> },
    {
      header: 'Actions',
      render: (r) => (
        <div className="d-flex gap-1">
          {r.status !== 'Checked In' && r.status !== 'Completed' && (
            <button className="btn btn-sm btn-success" onClick={() => handleCheckIn(r)}>
              <i className="bi bi-check2-circle me-1"></i> Check-in
            </button>
          )}
          {r.status === 'Checked In' && (
            <span className="badge bg-success-subtle text-success py-2 px-2 border border-success-subtle">
              <i className="bi bi-check-all me-1"></i> In Waiting Area
            </span>
          )}
        </div>
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
                <h3 className="fw-bold text-dark mb-0">Today's Live Queue</h3>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1 small">
                  <span className="spinner-grow spinner-grow-sm text-primary" style={{ width: '7px', height: '7px' }}></span>
                  Live Socket
                </span>
              </div>
              <p className="text-muted mb-0 small">
                Receptionist OPD desk queue management & real-time patient check-in
                {lastSync && <span className="text-primary ms-2">• Last synced: {lastSync}</span>}
              </p>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={() => fetchQueue(true)}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Queue
            </button>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          {loading ? (
            <LoadingSpinner message="Loading live queue..." />
          ) : (
            <div className="card card-custom p-3 shadow-sm border-0">
              <DataTable
                columns={columns}
                data={appointments}
                keyField="_id"
                emptyMessage="No patients currently in queue."
              />
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ReceptionistQueue;
