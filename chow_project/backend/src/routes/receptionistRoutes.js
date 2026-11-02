import express from 'express';
import { Appointment } from '../models/Appointment.js';
import { Emergency } from '../models/Emergency.js';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Doctor } from '../models/Doctor.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/receptionist/dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const totalCheckedIn = await Appointment.countDocuments({ status: 'Checked In' });
    const totalWaiting = await Appointment.countDocuments({ status: 'Waiting' });
    const totalEmergency = await Emergency.countDocuments();
    const walkinToday = await Appointment.countDocuments({ token: new RegExp('WALK', 'i') });

    const recentEmergencies = await Emergency.find().sort({ createdAt: -1 }).limit(5);
    const queueSummary = await Appointment.find().sort({ priorityScore: -1 }).limit(10);

    res.json({
      totalCheckedIn,
      totalWaiting,
      totalEmergency,
      walkinToday,
      recentEmergencies,
      queueSummary
    });
  } catch (err) {
    res.status(500).json({ message: 'Error loading dashboard', error: err.message });
  }
});

// GET /api/receptionist/queue
router.get('/queue', authenticateToken, async (req, res) => {
  try {
    const queue = await Appointment.find().sort({ createdAt: -1 });
    res.json({ queue });
  } catch (err) {
    res.status(500).json({ message: 'Error loading queue', error: err.message });
  }
});

// PUT /api/receptionist/queue/:id/checkin
router.put('/queue/:id/checkin', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = {
      status: 'Checked In',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let appointment = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      appointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true });
    }
    if (!appointment) {
      appointment = await Appointment.findOneAndUpdate({ appointmentCode: id }, updateData, { new: true });
    }
    if (!appointment) {
      appointment = await Appointment.findOneAndUpdate({ token: id }, updateData, { new: true });
    }

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Emit live queue update
    const io = req.app.get('io');
    if (io) {
      io.emit('queue:updated', { type: 'PATIENT_CHECKED_IN', appointment });
    }

    res.json({
      message: 'Patient checked in successfully',
      appointment
    });
  } catch (err) {
    res.status(500).json({ message: 'Check-in failed', error: err.message });
  }
});

// POST /api/receptionist/walkin
router.post('/walkin', authenticateToken, async (req, res) => {
  try {
    const { name, phone, age, gender, departmentId, doctorId, symptoms, isEmergency } = req.body;

    let doctor = null;
    if (doctorId && doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      doctor = await Doctor.findById(doctorId);
    }
    if (!doctor) doctor = await Doctor.findOne();

    let department = null;
    if (departmentId && departmentId.match(/^[0-9a-fA-F]{24}$/)) {
      department = await Department.findById(departmentId);
    }
    if (!department) department = await Department.findOne();

    const count = await Appointment.countDocuments();
    const deptCode = department ? department.code : 'WALK';
    const nextNum = count + 1;
    const token = `${deptCode}-${String(nextNum).padStart(3, '0')}`;
    const appointmentCode = `APT-${1000 + nextNum}`;

    const newAppointment = await Appointment.create({
      appointmentCode,
      patientId: `WALK-${Date.now()}`,
      patientName: name || 'Walk-in Patient',
      patientPhone: phone || '+1 555-0000',
      patientAge: Number(age) || 35,
      patientGender: gender || 'Other',
      doctorId: doctor ? String(doctor._id) : '101',
      doctorName: doctor ? doctor.name : 'Duty Doctor',
      departmentId: department ? String(department._id) : '1',
      departmentName: department ? department.name : 'General OPD',
      date: new Date().toISOString().split('T')[0],
      token,
      priority: isEmergency ? 'Emergency' : 'High',
      priorityScore: isEmergency ? 95 : 75,
      consultationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Checked In',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      symptoms: symptoms || 'Walk-in Patient',
      isEmergency: !!isEmergency
    });

    // Emit live queue update for walk-in patient
    const io = req.app.get('io');
    if (io) {
      io.emit('queue:updated', { type: 'WALKIN_REGISTERED', appointment: newAppointment });
    }

    res.status(201).json({
      success: true,
      message: 'Walk-in patient registered and checked in',
      token,
      consultationTime: newAppointment.consultationTime,
      priorityResult: newAppointment.priority,
      appointment: newAppointment
    });
  } catch (err) {
    res.status(500).json({ message: 'Walk-in registration failed', error: err.message });
  }
});

// GET & POST /api/receptionist/emergencies
router.get('/emergencies', authenticateToken, async (req, res) => {
  try {
    const emergencies = await Emergency.find().sort({ createdAt: -1 });
    res.json(emergencies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching emergencies', error: err.message });
  }
});

router.post('/emergencies', authenticateToken, async (req, res) => {
  try {
    const { patientName, age, condition, room, priority } = req.body;
    const newEmergency = await Emergency.create({
      patientName: patientName || 'Emergency Patient',
      age: Number(age) || 45,
      condition: condition || 'Critical Triage Case',
      room: room || 'Emergency Triage',
      priority: priority || 'Critical'
    });

    // Broadcast emergency alert to all connected staff (Doctors, Receptionists, Admins)
    const io = req.app.get('io');
    if (io) {
      io.emit('emergency:alert', newEmergency);
    }

    res.status(201).json({
      message: 'Emergency alert dispatched',
      emergency: newEmergency
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating emergency', error: err.message });
  }
});

// GET /api/receptionist/patients OR /api/receptionist/patients/search
router.get(['/patients', '/patients/search'], authenticateToken, async (req, res) => {
  try {
    const q = req.query.query || req.query.search;
    let filter = { role: 'patient' };

    if (q) {
      filter = {
        role: 'patient',
        $or: [
          { name: new RegExp(q, 'i') },
          { email: new RegExp(q, 'i') },
          { phone: new RegExp(q, 'i') }
        ]
      };
    }

    const patients = await User.find(filter).select('-password');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Error searching patients', error: err.message });
  }
});

export default router;
