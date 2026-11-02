import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/adminApi';
import { appointmentApi } from '../../services/appointmentApi';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import PriorityBadge from '../../components/common/PriorityBadge';
import { ErrorAlert } from '../../components/common/LoadingSpinner';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Tomorrow's date helper
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [bookingData, setBookingData] = useState({
    departmentId: '',
    doctorId: '',
    date: getTomorrowDate(),
    symptoms: '',
    isEmergency: false,
    priority: 'Medium',
    priorityScore: 50
  });

  const [createdAppointment, setCreatedAppointment] = useState(null);

  useEffect(() => {
    const loadDeptsAndDoctors = async () => {
      try {
        const depts = await adminApi.getDepartments();
        const docs = await adminApi.getDoctors();
        setDepartments(depts);
        setDoctors(docs);
      } catch (err) {
        setError('Failed to load department or doctor listings.');
      }
    };
    loadDeptsAndDoctors();
  }, []);

  const handleDepartmentSelect = (deptId) => {
    setBookingData({ ...bookingData, departmentId: deptId, doctorId: '' });
    const docs = doctors.filter(d => d.departmentId === Number(deptId));
    setFilteredDoctors(docs);
    setStep(2);
  };

  const handleDoctorSelect = (docId) => {
    setBookingData({ ...bookingData, doctorId: docId });
    setStep(3);
  };

  const handleSymptomsAndEmergency = () => {
    // Priority Assessment Algorithm Simulation
    let score = 40;
    let priority = 'Medium';

    if (bookingData.isEmergency) {
      score = 95;
      priority = 'Emergency';
    } else {
      const sym = bookingData.symptoms.toLowerCase();
      if (sym.includes('chest pain') || sym.includes('shortness of breath') || sym.includes('severe') || sym.includes('bleeding')) {
        score = 85;
        priority = 'High';
      } else if (sym.includes('fever') || sym.includes('pain') || sym.includes('cough')) {
        score = 60;
        priority = 'Medium';
      } else {
        score = 30;
        priority = 'Low';
      }
    }

    setBookingData(prev => ({ ...prev, priority, priorityScore: score }));
    setStep(6);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await appointmentApi.createAppointment({
        ...bookingData,
        patientId: user?.id || 201,
        patientName: user?.name || 'John Doe'
      });
      setCreatedAppointment(res);
      setStep(7);
    } catch (err) {
      setError(err.message || 'Failed to confirm booking.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDept = departments.find(d => d.id === Number(bookingData.departmentId));
  const selectedDoc = doctors.find(d => d.id === Number(bookingData.doctorId));

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar isOpen={true} />
        <main className="content-area">
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Book OPD Appointment</h3>
            <p className="text-muted">7-Step Next-Day OPD Booking & Triage Wizard</p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {/* Stepper Header */}
          <div className="card card-custom p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 text-center">
              {[
                { num: 1, label: 'Department' },
                { num: 2, label: 'Doctor' },
                { num: 3, label: 'Date' },
                { num: 4, label: 'Symptoms' },
                { num: 5, label: 'Emergency' },
                { num: 6, label: 'Priority' },
                { num: 7, label: 'Confirmation' }
              ].map(s => (
                <div key={s.num} className="d-flex flex-column align-items-center flex-grow-1" style={{ minWidth: '70px' }}>
                  <div className={`wizard-step ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}>
                    {step > s.num ? <i className="bi bi-check-lg"></i> : s.num}
                  </div>
                  <span className="small text-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: Department Selection */}
          {step === 1 && (
            <div className="card card-custom p-4">
              <h5 className="fw-bold mb-3"><i className="bi bi-building me-2 text-primary"></i>Step 1: Select Department</h5>
              <div className="row g-3">
                {departments.map(dept => (
                  <div key={dept.id} className="col-md-6 col-lg-4">
                    <div
                      className="card h-100 p-3 border cursor-pointer card-hover"
                      onClick={() => handleDepartmentSelect(dept.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <span className="badge bg-primary-subtle text-primary fw-bold mb-1">{dept.code}</span>
                          <h6 className="fw-bold text-dark mb-1">{dept.name}</h6>
                          <p className="text-muted small mb-0">{dept.description}</p>
                        </div>
                        <i className="bi bi-chevron-right text-muted fs-4"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Doctor Selection */}
          {step === 2 && (
            <div className="card card-custom p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0"><i className="bi bi-person-heart me-2 text-primary"></i>Step 2: Select Doctor for {selectedDept?.name}</h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setStep(1)}>Change Department</button>
              </div>
              <div className="row g-3">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map(doc => (
                    <div key={doc.id} className="col-md-6">
                      <div className="card p-3 border cursor-pointer" onClick={() => handleDoctorSelect(doc.id)} style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-success-subtle text-success rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                            <i className="bi bi-person-badge fs-3"></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-0">{doc.name}</h6>
                            <small className="text-muted d-block">{doc.departmentName} | {doc.roomNo}</small>
                            <small className="text-primary">{doc.experience} Experience</small>
                          </div>
                          <i className="bi bi-chevron-right text-muted fs-4"></i>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No doctors currently listed in this department. Choose another department.</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Next-day Date Selection */}
          {step === 3 && (
            <div className="card card-custom p-4">
              <h5 className="fw-bold mb-3"><i className="bi bi-calendar-event me-2 text-primary"></i>Step 3: Confirm Next-Day Date</h5>
              <p className="text-muted">OPD appointments are scheduled for the next operating day.</p>
              <div className="mb-4 max-w-sm">
                <label className="form-label fw-semibold">Next-Day Appointment Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(4)}>Proceed to Symptoms</button>
              </div>
            </div>
          )}

          {/* STEP 4: Symptoms Form */}
          {step === 4 && (
            <div className="card card-custom p-4">
              <h5 className="fw-bold mb-3"><i className="bi bi-file-earmark-medical me-2 text-primary"></i>Step 4: Describe Symptoms</h5>
              <div className="mb-4">
                <label className="form-label fw-semibold">Chief Symptoms & Duration</label>
                <textarea
                  className="form-control"
                  rows="4"
                  required
                  placeholder="Describe your current medical concern, pain severity, or symptoms..."
                  value={bookingData.symptoms}
                  onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                ></textarea>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={() => setStep(3)}>Back</button>
                <button className="btn btn-primary" disabled={!bookingData.symptoms.trim()} onClick={() => setStep(5)}>Proceed to Emergency Check</button>
              </div>
            </div>
          )}

          {/* STEP 5: Emergency Screening Check */}
          {step === 5 && (
            <div className="card card-custom p-4">
              <h5 className="fw-bold mb-3 text-danger"><i className="bi bi-shield-exclamation me-2"></i>Step 5: Emergency Screening Check</h5>
              <div className="alert alert-warning">
                <strong>Safety Notice:</strong> Are you experiencing acute life-threatening symptoms (such as sudden severe chest pain, extreme loss of consciousness, or severe trauma)?
              </div>
              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="emergencyCheck"
                  checked={bookingData.isEmergency}
                  onChange={(e) => setBookingData({ ...bookingData, isEmergency: e.target.checked })}
                />
                <label className="form-check-label fw-bold text-dark" htmlFor="emergencyCheck">
                  Yes, this is an acute emergency requiring immediate triage priority
                </label>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={() => setStep(4)}>Back</button>
                <button className="btn btn-danger" onClick={handleSymptomsAndEmergency}>Assess Priority & Review</button>
              </div>
            </div>
          )}

          {/* STEP 6: Priority Assessment & Review */}
          {step === 6 && (
            <div className="card card-custom p-4">
              <h5 className="fw-bold mb-3"><i className="bi bi-activity me-2 text-primary"></i>Step 6: Priority Assessment Result</h5>
              <div className="p-3 bg-light rounded mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <span className="text-muted small">Assigned Priority Tier:</span>
                    <div className="mt-1">
                      <PriorityBadge priority={bookingData.priority} />
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-muted small">Priority Score</span>
                    <h3 className="fw-bold text-dark mb-0">{bookingData.priorityScore}/100</h3>
                  </div>
                </div>

                <hr />
                <p className="mb-1"><strong>Department:</strong> {selectedDept?.name}</p>
                <p className="mb-1"><strong>Doctor:</strong> {selectedDoc?.name}</p>
                <p className="mb-1"><strong>Scheduled Date:</strong> {bookingData.date}</p>
                <p className="mb-0"><strong>Symptoms:</strong> {bookingData.symptoms}</p>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={() => setStep(5)}>Back</button>
                <button className="btn btn-success fw-bold" onClick={handleConfirmBooking} disabled={loading}>
                  {loading ? 'Confirming Appointment...' : 'Confirm & Issue Token'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Confirmation & Token Issued */}
          {step === 7 && createdAppointment && (
            <div className="card card-custom p-4 text-center">
              <div className="bg-success text-white rounded-circle p-3 mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-check-lg fs-1"></i>
              </div>
              <h4 className="fw-bold text-success mb-2">Appointment Successfully Booked!</h4>
              <p className="text-muted">Your OPD Consultation Token has been generated.</p>

              <div className="bg-light p-4 rounded max-w-md mx-auto my-3 text-start border">
                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span className="text-muted">Token Number:</span>
                  <span className="fw-bold text-primary fs-5">{createdAppointment.token}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span className="text-muted">Doctor:</span>
                  <span className="fw-semibold">{createdAppointment.doctorName}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span className="text-muted">Department:</span>
                  <span>{createdAppointment.departmentName}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span className="text-muted">Date & Time:</span>
                  <span>{createdAppointment.date} at {createdAppointment.consultationTime}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Priority:</span>
                  <PriorityBadge priority={createdAppointment.priority} />
                </div>
              </div>

              <div className="d-flex justify-content-center gap-2 mt-3">
                <button className="btn btn-primary" onClick={() => navigate('/patient/appointments')}>
                  View My Appointments
                </button>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/patient/dashboard')}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default BookAppointment;
