import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { receptionistApi } from '../../services/receptionistApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import PriorityBadge from '../../components/common/PriorityBadge';
import { ErrorAlert, SuccessAlert } from '../../components/common/LoadingSpinner';

const WalkinRegistration = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    departmentId: '',
    doctorId: '',
    symptoms: '',
    isEmergency: false,
    walkinSlot: '11:30 AM'
  });

  const [priorityResult, setPriorityResult] = useState(null);
  const [registeredToken, setRegisteredToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadDeptsDocs = async () => {
      try {
        const depts = await adminApi.getDepartments();
        const docs = await adminApi.getDoctors();
        setDepartments(depts);
        setDoctors(docs);
      } catch (err) {
        setError('Failed to load department listings.');
      }
    };
    loadDeptsDocs();
  }, []);

  const handleDeptChange = (deptId) => {
    setFormData({ ...formData, departmentId: deptId, doctorId: '' });
    setFilteredDoctors(doctors.filter(d => d.departmentId === Number(deptId)));
  };

  const handleAssessPriority = () => {
    let result = 'Medium';
    if (formData.isEmergency) result = 'Emergency';
    else if (formData.symptoms.toLowerCase().includes('severe') || formData.symptoms.toLowerCase().includes('chest')) result = 'High';
    setPriorityResult(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await receptionistApi.registerWalkin({
        ...formData,
        priorityResult: priorityResult || 'Medium'
      });
      setRegisteredToken(res.token);
      setSuccess(`Walk-in patient registered successfully! Issued Token: ${res.token}`);
    } catch (err) {
      setError(err.message || 'Walk-in registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Walk-in Patient Registration</h3>
            <p className="text-muted">Register same-day walk-in consultations & assign walk-in slots</p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} onClose={() => setSuccess('')} />

          {registeredToken ? (
            <div className="card card-custom p-4 text-center max-w-lg mx-auto">
              <div className="bg-success text-white rounded-circle p-3 mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-ticket-perforated fs-1"></i>
              </div>
              <h4 className="fw-bold text-success mb-2">Walk-in Token Issued</h4>
              <h2 className="display-4 fw-bold text-primary my-2">{registeredToken}</h2>
              <p className="text-muted mb-4">Patient: <strong>{formData.patientName}</strong> | Assigned Slot: <strong>{formData.walkinSlot}</strong></p>
              
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-primary" onClick={() => navigate('/receptionist/queue')}>
                  View Today's Queue
                </button>
                <button className="btn btn-outline-secondary" onClick={() => { setRegisteredToken(null); setFormData({ patientName: '', patientPhone: '', departmentId: '', doctorId: '', symptoms: '', isEmergency: false, walkinSlot: '11:30 AM' }); }}>
                  Register Another Walk-in
                </button>
              </div>
            </div>
          ) : (
            <div className="card card-custom p-4 max-w-3xl">
              <form onSubmit={handleSubmit}>
                <h5 className="fw-bold text-dark mb-3"><i className="bi bi-person me-2 text-primary"></i>Patient Information</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Patient Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Full Name"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      required
                      placeholder="+1 555-..."
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    />
                  </div>
                </div>

                <h5 className="fw-bold text-dark mb-3"><i className="bi bi-hospital me-2 text-primary"></i>Department & Doctor</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Department</label>
                    <select
                      className="form-select"
                      required
                      value={formData.departmentId}
                      onChange={(e) => handleDeptChange(e.target.value)}
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Doctor</label>
                    <select
                      className="form-select"
                      required
                      value={formData.doctorId}
                      onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    >
                      <option value="">-- Select Doctor --</option>
                      {filteredDoctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name} ({doc.roomNo})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <h5 className="fw-bold text-dark mb-3"><i className="bi bi-activity me-2 text-primary"></i>Symptoms & Walk-in Slot</h5>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Symptoms Submitted</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    required
                    placeholder="Chief complaint..."
                    value={formData.symptoms}
                    onChange={(e) => {
                      setFormData({ ...formData, symptoms: e.target.value });
                      handleAssessPriority();
                    }}
                  ></textarea>
                </div>

                <div className="row g-3 mb-4 align-items-center">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Walk-in Consultation Slot</label>
                    <select
                      className="form-select"
                      value={formData.walkinSlot}
                      onChange={(e) => setFormData({ ...formData, walkinSlot: e.target.value })}
                    >
                      <option value="11:15 AM">11:15 AM Slot</option>
                      <option value="11:30 AM">11:30 AM Slot</option>
                      <option value="11:45 AM">11:45 AM Slot</option>
                      <option value="12:15 PM">12:15 PM Slot</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check mt-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="walkinEmergency"
                        checked={formData.isEmergency}
                        onChange={(e) => {
                          setFormData({ ...formData, isEmergency: e.target.checked });
                          handleAssessPriority();
                        }}
                      />
                      <label className="form-check-label fw-bold text-danger" htmlFor="walkinEmergency">
                        Emergency Priority Flag
                      </label>
                    </div>
                  </div>
                </div>

                {priorityResult && (
                  <div className="p-3 bg-light rounded mb-4 d-flex align-items-center justify-content-between border">
                    <span className="fw-semibold text-secondary">Priority Calculation Result:</span>
                    <PriorityBadge priority={priorityResult} />
                  </div>
                )}

                <button type="submit" className="btn btn-primary py-2 px-4 fw-semibold" disabled={loading}>
                  {loading ? 'Processing Walk-in Registration...' : 'Register Walk-in Patient & Issue Token'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default WalkinRegistration;
