import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import DataTable from '../../components/common/DataTable';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../../components/common/LoadingSpinner';

const OPDSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    doctorId: '',
    departmentId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    consultationDuration: 15,
    capacity: 20
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOPDSessions();
      const depts = await adminApi.getDepartments();
      const docs = await adminApi.getDoctors();
      setSessions(data);
      setDepartments(depts);
      setDoctors(docs);
    } catch (err) {
      setError('Failed to fetch OPD sessions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const doc = doctors.find(d => d.id === Number(sessionForm.doctorId));
    const dept = departments.find(d => d.id === Number(sessionForm.departmentId));

    try {
      await adminApi.saveOPDSession({
        ...sessionForm,
        doctorName: doc ? doc.name : 'Dr. Sarah Jenkins',
        departmentName: dept ? dept.name : 'General OPD'
      });
      setSuccess('OPD Session configured successfully.');
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError('Failed to configure OPD session.');
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', render: (r) => <span className="fw-bold">#{r.id}</span> },
    { header: 'Doctor', accessor: 'doctorName', render: (r) => <span className="fw-bold text-dark">{r.doctorName}</span> },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Timing', render: (r) => `${r.startTime} - ${r.endTime}` },
    { header: 'Duration', accessor: 'consultationDuration', render: (r) => `${r.consultationDuration} mins` },
    { header: 'Capacity', accessor: 'capacity', render: (r) => <span className="badge bg-info text-white">{r.capacity} Patients</span> },
    { header: 'Booked / Remaining', render: (r) => `${r.booked} / ${r.remaining}` }
  ];

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold text-dark mb-1">OPD Session Configuration</h3>
              <p className="text-muted mb-0">Configure doctor consultation sessions, start/end times, durations & capacity limits</p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-lg me-1"></i> Configure New Session
            </button>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          {loading ? (
            <LoadingSpinner message="Loading OPD session parameters..." />
          ) : (
            <div className="card card-custom p-3">
              <DataTable columns={columns} data={sessions} keyField="id" emptyMessage="No OPD sessions configured." />
            </div>
          )}

          {showModal && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content shadow">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">Configure OPD Session</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Doctor</label>
                          <select
                            className="form-select"
                            required
                            value={sessionForm.doctorId}
                            onChange={(e) => setSessionForm({ ...sessionForm, doctorId: e.target.value })}
                          >
                            <option value="">-- Select Doctor --</option>
                            {doctors.map(d => (
                              <option key={d.id} value={d.id}>{d.name} ({d.departmentName})</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Department</label>
                          <select
                            className="form-select"
                            required
                            value={sessionForm.departmentId}
                            onChange={(e) => setSessionForm({ ...sessionForm, departmentId: e.target.value })}
                          >
                            <option value="">-- Select Department --</option>
                            {departments.map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            required
                            value={sessionForm.date}
                            onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Start Time</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            placeholder="09:00 AM"
                            value={sessionForm.startTime}
                            onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">End Time</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            placeholder="01:00 PM"
                            value={sessionForm.endTime}
                            onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Consultation Duration (Mins)</label>
                          <input
                            type="number"
                            className="form-control"
                            required
                            min="5"
                            max="60"
                            value={sessionForm.consultationDuration}
                            onChange={(e) => setSessionForm({ ...sessionForm, consultationDuration: Number(e.target.value) })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Max Session Capacity</label>
                          <input
                            type="number"
                            className="form-control"
                            required
                            min="1"
                            value={sessionForm.capacity}
                            onChange={(e) => setSessionForm({ ...sessionForm, capacity: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-light border" onClick={() => setShowModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-danger">Save OPD Session Configuration</button>
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

export default OPDSessions;
