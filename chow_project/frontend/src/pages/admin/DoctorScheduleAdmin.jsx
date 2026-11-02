import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import DataTable from '../../components/common/DataTable';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../../components/common/LoadingSpinner';

const DoctorScheduleAdmin = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState({
    id: null,
    doctorName: '',
    departmentName: '',
    dayOfWeek: 'Monday',
    shiftStart: '09:00 AM',
    shiftEnd: '01:00 PM',
    enabled: true
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOPDSessions();
      const mapped = data.map((s, idx) => ({
        id: s.id || idx + 1,
        doctorName: s.doctorName,
        departmentName: s.departmentName,
        dayOfWeek: 'Weekdays (Mon-Fri)',
        shiftStart: s.startTime,
        shiftEnd: s.endTime,
        enabled: s.status === 'Active'
      }));
      setSchedules(mapped);
    } catch (err) {
      setError('Failed to fetch schedules.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSchedule = (id) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    setSuccess('Schedule status toggled.');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedSchedule.id) {
      setSchedules(prev => prev.map(s => s.id === selectedSchedule.id ? selectedSchedule : s));
      setSuccess('Schedule updated.');
    } else {
      setSchedules(prev => [...prev, { ...selectedSchedule, id: Date.now() }]);
      setSuccess('New schedule created.');
    }
    setShowModal(false);
  };

  const columns = [
    { header: 'ID', accessor: 'id', render: (r) => <span className="fw-bold">#{r.id}</span> },
    { header: 'Doctor', accessor: 'doctorName', render: (r) => <span className="fw-bold text-dark">{r.doctorName}</span> },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Active Days', accessor: 'dayOfWeek' },
    { header: 'Shift Timing', render: (r) => `${r.shiftStart} - ${r.shiftEnd}` },
    {
      header: 'Status',
      accessor: 'enabled',
      render: (r) => (
        <span className={`badge ${r.enabled ? 'bg-success' : 'bg-secondary'}`}>
          {r.enabled ? 'Enabled' : 'Disabled'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (r) => (
        <div className="d-flex gap-1">
          <button
            className={`btn btn-sm ${r.enabled ? 'btn-outline-warning' : 'btn-outline-success'}`}
            onClick={() => handleToggleSchedule(r.id)}
          >
            {r.enabled ? 'Disable' : 'Enable'}
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => { setSelectedSchedule(r); setShowModal(true); }}
          >
            <i className="bi bi-pencil"></i> Edit
          </button>
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
              <h3 className="fw-bold text-dark mb-1">Doctor Weekly Schedules</h3>
              <p className="text-muted mb-0">Create, edit, enable, or disable recurring doctor duty schedules</p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => { setSelectedSchedule({ id: null, doctorName: 'Dr. Robert Chen', departmentName: 'General OPD', dayOfWeek: 'Weekdays', shiftStart: '09:00 AM', shiftEnd: '02:00 PM', enabled: true }); setShowModal(true); }}>
              <i className="bi bi-plus-lg me-1"></i> Create Schedule
            </button>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          {loading ? (
            <LoadingSpinner message="Loading schedules..." />
          ) : (
            <div className="card card-custom p-3">
              <DataTable columns={columns} data={schedules} keyField="id" emptyMessage="No schedules configured." />
            </div>
          )}

          {showModal && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">{selectedSchedule.id ? 'Edit Schedule' : 'Create Schedule'}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <form onSubmit={handleSave}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Doctor Name</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={selectedSchedule.doctorName}
                          onChange={(e) => setSelectedSchedule({ ...selectedSchedule, doctorName: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Department</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={selectedSchedule.departmentName}
                          onChange={(e) => setSelectedSchedule({ ...selectedSchedule, departmentName: e.target.value })}
                        />
                      </div>
                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <label className="form-label fw-semibold">Shift Start</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedSchedule.shiftStart}
                            onChange={(e) => setSelectedSchedule({ ...selectedSchedule, shiftStart: e.target.value })}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label fw-semibold">Shift End</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedSchedule.shiftEnd}
                            onChange={(e) => setSelectedSchedule({ ...selectedSchedule, shiftEnd: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-light border" onClick={() => setShowModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-danger">Save Schedule</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorScheduleAdmin;
