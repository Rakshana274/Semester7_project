import express from 'express';
import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';
import { OPDSession } from '../models/OPDSession.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all doctors (Supports /api/doctor or /api/doctors)
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
});

// GET /api/doctor/dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Find appointments for the logged-in doctor, or fallback to all for demo
    let appointments = await Appointment.find({ doctorName: new RegExp(req.user.name, 'i') }).sort({ priorityScore: -1 });
    if (appointments.length === 0) {
      appointments = await Appointment.find().sort({ priorityScore: -1 });
    }

    const activePatient = appointments.find(a => a.status === 'In Consultation') || null;
    const waitingQueue = appointments.filter(a => ['Checked In', 'Waiting'].includes(a.status));
    const completedToday = appointments.filter(a => a.status === 'Completed').length;

    res.json({
      activePatient,
      waitingCount: waitingQueue.length,
      completedToday,
      totalScheduledToday: appointments.length,
      queue: waitingQueue
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctor dashboard', error: err.message });
  }
});

// GET /api/doctor/queue
router.get('/queue', authenticateToken, async (req, res) => {
  try {
    let queue = await Appointment.find({ doctorName: new RegExp(req.user.name, 'i') }).sort({ priorityScore: -1 });
    if (queue.length === 0) {
      queue = await Appointment.find().sort({ priorityScore: -1 });
    }
    res.json({ queue });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching queue', error: err.message });
  }
});

// GET /api/doctor/queue/:id
router.get('/queue/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    let appointment = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      appointment = await Appointment.findById(id);
    }
    if (!appointment) {
      appointment = await Appointment.findOne({ appointmentCode: id });
    }
    if (!appointment) {
      appointment = await Appointment.findOne({ token: id });
    }

    if (!appointment) {
      return res.status(404).json({ message: 'Queue record not found' });
    }
    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching queue entry', error: err.message });
  }
});

// PUT /api/doctor/queue/:id/status
router.put('/queue/:id/status', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { status, notes, prescription } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.clinicalNotes = notes;
    if (prescription) updateData.prescription = prescription;

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

    // Emit live queue update to all listening clients
    const io = req.app.get('io');
    if (io) {
      io.emit('queue:updated', { type: 'STATUS_UPDATED', appointment });
    }

    res.json({
      message: `Status updated to ${status}`,
      appointment
    });
  } catch (err) {
    res.status(500).json({ message: 'Status update failed', error: err.message });
  }
});

// GET /api/doctor/schedule OR /api/doctors/schedule
router.get('/schedule', authenticateToken, async (req, res) => {
  try {
    const sessions = await OPDSession.find();
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sessions', error: err.message });
  }
});

// GET /api/doctors/:doctorId/schedule OR /api/doctor/:doctorId/schedule
router.get(['/:doctorId/schedule', '/schedule/:doctorId'], async (req, res) => {
  try {
    const { doctorId } = req.params;
    let session = await OPDSession.findOne({ doctorId });
    if (!session && doctorId && doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      const doc = await Doctor.findById(doctorId);
      if (doc) {
        session = await OPDSession.findOne({ doctorName: new RegExp(doc.name, 'i') });
      }
    }
    if (!session) {
      session = await OPDSession.findOne();
    }
    if (!session) {
      session = {
        doctorId: doctorId || '101',
        doctorName: 'Dr. Specialist',
        departmentName: 'General OPD',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00 AM',
        endTime: '01:00 PM',
        consultationDuration: 15,
        capacity: 20,
        booked: 0,
        remaining: 20,
        status: 'Active'
      };
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching schedule', error: err.message });
  }
});

// GET /api/doctors/:doctorId/queue OR /api/doctor/:doctorId/queue
router.get(['/:doctorId/queue', '/queue/:doctorId'], async (req, res) => {
  try {
    const { doctorId } = req.params;
    let queue = await Appointment.find({ doctorId }).sort({ priorityScore: -1 });
    if (queue.length === 0) {
      queue = await Appointment.find().sort({ priorityScore: -1 });
    }
    res.json(queue);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching queue', error: err.message });
  }
});

export default router;
