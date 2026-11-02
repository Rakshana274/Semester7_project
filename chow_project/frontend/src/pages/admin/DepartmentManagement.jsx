import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import { LoadingSpinner, ErrorAlert, SuccessAlert, ConfirmModal } from '../../components/common/LoadingSpinner';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states for Add/Edit/View
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedDept, setSelectedDept] = useState({ name: '', code: '', description: '' });

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getDepartments();
      setDepartments(data);
    } catch (err) {
      setError('Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedDept({ name: '', code: '', description: '' });
    setModalMode('add');
    setShowModal(true);
  };

  const handleOpenEdit = (dept) => {
    setSelectedDept(dept);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleOpenView = (dept) => {
    setSelectedDept(dept);
    setModalMode('view');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (modalMode === 'add') {
        await adminApi.addDepartment(selectedDept);
        setSuccess('Department added successfully.');
      } else if (modalMode === 'edit') {
        await adminApi.updateDepartment(selectedDept.id, selectedDept);
        setSuccess('Department updated successfully.');
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      setError('Failed to save department.');
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteDepartment(deleteId);
      setSuccess('Department deleted.');
      setDeleteId(null);
      fetchDepartments();
    } catch (err) {
      setError('Failed to delete department.');
    }
  };

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'ID', accessor: 'id', render: (r) => <span className="fw-bold">#{r.id}</span> },
    { header: 'Code', accessor: 'code', render: (r) => <span className="badge bg-primary">{r.code}</span> },
    { header: 'Department Name', accessor: 'name', render: (r) => <span className="fw-bold text-dark">{r.name}</span> },
    { header: 'Description', accessor: 'description' },
    { header: 'Doctors', accessor: 'doctorCount', render: (r) => <span className="badge bg-light text-dark border">{r.doctorCount || 0} Doctors</span> },
    {
      header: 'Actions',
      render: (r) => (
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-outline-info" onClick={() => handleOpenView(r)} title="View"><i className="bi bi-eye"></i></button>
          <button className="btn btn-sm btn-outline-primary" onClick={() => handleOpenEdit(r)} title="Edit"><i className="bi bi-pencil"></i></button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(r.id)} title="Delete"><i className="bi bi-trash"></i></button>
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
              <h3 className="fw-bold text-dark mb-1">Department Management</h3>
              <p className="text-muted mb-0">Configure OPD departments, codes, and assigned medical staff</p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleOpenAdd}>
              <i className="bi bi-plus-lg me-1"></i> Add Department
            </button>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          <div className="card card-custom p-4 mb-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search departments by Name or Code..." />
          </div>

          {loading ? (
            <LoadingSpinner message="Loading hospital departments..." />
          ) : (
            <div className="card card-custom p-3">
              <DataTable columns={columns} data={filteredDepts} keyField="id" emptyMessage="No departments found." />
            </div>
          )}

          {/* Add / Edit / View Modal */}
          {showModal && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">
                      {modalMode === 'add' ? 'Add New Department' : modalMode === 'edit' ? 'Edit Department' : 'View Department Details'}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <form onSubmit={handleSave}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Department Name</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          disabled={modalMode === 'view'}
                          value={selectedDept.name}
                          onChange={(e) => setSelectedDept({ ...selectedDept, name: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Department Code</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          disabled={modalMode === 'view'}
                          placeholder="e.g. CARD, GOPD"
                          value={selectedDept.code}
                          onChange={(e) => setSelectedDept({ ...selectedDept, code: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          disabled={modalMode === 'view'}
                          value={selectedDept.description}
                          onChange={(e) => setSelectedDept({ ...selectedDept, description: e.target.value })}
                        ></textarea>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-light border" onClick={() => setShowModal(false)}>Close</button>
                      {modalMode !== 'view' && (
                        <button type="submit" className="btn btn-danger">Save Department</button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <ConfirmModal
            isOpen={!!deleteId}
            title="Delete Department"
            message="Are you sure you want to delete this department? Associated doctor schedules may be affected."
            onConfirm={handleDelete}
            onCancel={() => setDeleteId(null)}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DepartmentManagement;
