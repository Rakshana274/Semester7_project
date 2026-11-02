import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import { LoadingSpinner, ErrorAlert, SuccessAlert, ConfirmModal } from '../../components/common/LoadingSpinner';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedDoc, setSelectedDoc] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: '',
    roomNo: '',
    experience: '',
    consultationTime: '15 mins'
  });

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const docs = await adminApi.getDoctors();
      const depts = await adminApi.getDepartments();
      setDoctors(docs);
      setDepartments(depts);
    } catch (err) {
      setError('Failed to fetch doctor management records.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedDoc({ name: '', email: '', phone: '', departmentId: departments[0]?.id || '', roomNo: 'Room 101', experience: '5 Years', consultationTime: '15 mins' });
    setModalMode('add');
    setShowModal(true);
  };

  const handleOpenEdit = (doc) => {
    setSelectedDoc(doc);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleOpenView = (doc) => {
    setSelectedDoc(doc);
    setModalMode('view');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    const dept = departments.find(d => d.id === Number(selectedDoc.departmentId));
    const docPayload = {
      ...selectedDoc,
      departmentId: Number(selectedDoc.departmentId),
      departmentName: dept ? dept.name : 'General OPD'
    };

    try {
      if (modalMode === 'add') {
        await adminApi.addDoctor(docPayload);
        setSuccess('Doctor added & assigned to department.');
      } else if (modalMode === 'edit') {
        await adminApi.updateDoctor(selectedDoc.id, docPayload);
        setSuccess('Doctor record updated.');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError('Failed to save doctor details.');
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteDoctor(deleteId);
      setSuccess('Doctor removed.');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      setError('Failed to delete doctor.');
    }
  };

  const filteredDocs = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.departmentName.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'ID', accessor: 'id', render: (r) => <span className="fw-bold">#{r.id}</span> },
    { header: 'Doctor Name', accessor: 'name', render: (r) => <span className="fw-bold text-dark">{r.name}</span> },
    { header: 'Department', accessor: 'departmentName', render: (r) => <span className="badge bg-primary-subtle text-primary border">{r.departmentName}</span> },
    { header: 'Room No', accessor: 'roomNo' },
    { header: 'Phone / Email', render: (r) => <small>{r.phone}<br />{r.email}</small> },
    { header: 'Experience', accessor: 'experience' },
    { header: 'Status', accessor: 'status', render: (r) => <span className="badge bg-success">{r.status || 'Active'}</span> },
    {
      header: 'Actions',
      render: (r) => (
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-outline-info" onClick={() => handleOpenView(r)} title="View Doctor"><i className="bi bi-eye"></i></button>
          <button className="btn btn-sm btn-outline-primary" onClick={() => handleOpenEdit(r)} title="Edit / Reassign Department"><i className="bi bi-pencil"></i></button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(r.id)} title="Delete Doctor"><i className="bi bi-trash"></i></button>
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
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <h3 className="fw-bold text-dark mb-1">Doctor Management</h3>
              <p className="text-muted mb-0">Register doctors, assign departments, room numbers & consultation parameters</p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleOpenAdd}>
              <i className="bi bi-person-plus me-1"></i> Add Doctor
            </button>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          <div className="card card-custom p-4 mb-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search doctors by Name, Department, or Email..." />
          </div>

          {loading ? (
            <LoadingSpinner message="Loading doctor roster..." />
          ) : (
            <div className="card card-custom p-3">
              <DataTable columns={columns} data={filteredDocs} keyField="id" emptyMessage="No doctors match search criteria." />
            </div>
          )}

          {showModal && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content shadow">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">
                      {modalMode === 'add' ? 'Add New Doctor' : modalMode === 'edit' ? 'Edit Doctor & Department' : 'Doctor Profile'}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <form onSubmit={handleSave}>
                    <div className="modal-body">
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Doctor Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            disabled={modalMode === 'view'}
                            value={selectedDoc.name}
                            onChange={(e) => setSelectedDoc({ ...selectedDoc, name: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Assign Department</label>
                          <select
                            className="form-select"
                            required
                            disabled={modalMode === 'view'}
                            value={selectedDoc.departmentId}
                            onChange={(e) => setSelectedDoc({ ...selectedDoc, departmentId: e.target.value })}
                          >
                            <option value="">-- Select Department --</option>
                            {departments.map(d => (
                              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            required
                            disabled={modalMode === 'view'}
                            value={selectedDoc.email}
                            onChange={(e) => setSelectedDoc({ ...selectedDoc, email: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            required
                            disabled={modalMode === 'view'}
                            value={selectedDoc.phone}
                            onChange={(e) => setSelectedDoc({ ...selectedDoc, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Room No.</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            disabled={modalMode === 'view'}
                            value={selectedDoc.roomNo}
                            onChange={(e) => setSelectedDoc({ ...selectedDoc, roomNo: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Experience</label>
                          <input
                            type="text"
                            className="form-control"
                            disabled={modalMode === 'view'}
                            value={selectedDoc.experience}
                            onChange={(e) => setSelectedDoc({ ...selectedDoc, experience: e.target.value })}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Consultation Duration</label>
                          <input
                            type="text"
                            className="form-control"
                            disabled={modalMode === 'view'}
                            value={selectedDoc.consultationTime}
                            onChange={(e) => setSelectedDoc({ ...selectedDoc, consultationTime: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-light border" onClick={() => setShowModal(false)}>Close</button>
                      {modalMode !== 'view' && (
                        <button type="submit" className="btn btn-danger">Save Doctor Record</button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <ConfirmModal
            isOpen={!!deleteId}
            title="Delete Doctor Record"
            message="Are you sure you want to remove this doctor from the hospital roster?"
            onConfirm={handleDelete}
            onCancel={() => setDeleteId(null)}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorManagement;
