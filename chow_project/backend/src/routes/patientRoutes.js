import express from 'express';
import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';
import { Department } from '../models/Department.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/patient/dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const patientId = String(req.user.id);
    const appointments = await Appointment.find({
      $or: [{ patientId }, { patientName: new RegExp(req.user.name, 'i') }]
    }).sort({ createdAt: -1 });

    const activeAppointment = appointments.find(a =>
      ['Checked In', 'In Consultation', 'Waiting', 'Scheduled'].includes(a.status)
    ) || appointments[0] || null;

    const notificationsCount = await Notification.countDocuments({ patientId, read: false });

    res.json({
      activeAppointment,
      totalAppointments: appointments.length,
      upcomingCount: appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled').length,
      completedCount: appointments.filter(a => a.status === 'Completed').length,
      notificationsCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Error loading dashboard', error: err.message });
  }
});

// GET /api/patient/appointments OR /api/appointments OR /api/notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    // If mounted on /api/notifications
    if (req.baseUrl.includes('notifications')) {
      const targetUserId = req.query.userId || String(req.user.id);
      let notifs = await Notification.find({
        $or: [{ patientId: targetUserId }, { userId: targetUserId }]
      }).sort({ createdAt: -1 });
      if (notifs.length === 0) {
        notifs = await Notification.find().sort({ createdAt: -1 }).limit(10);
      }
      return res.json(notifs);
    }

    // If mounted on /api/patients
    if (req.baseUrl.includes('patients')) {
      const patients = await User.find({ role: 'patient' }).select('-password');
      return res.json(patients);
    }

    const { patientId, doctorId, status } = req.query;
    const filter = {};

    if (patientId) {
      filter.$or = [
        { patientId: String(patientId) },
        { patientName: new RegExp(req.user.name, 'i') }
      ];
    }

    if (doctorId) {
      const docQueries = [{ doctorId: String(doctorId) }];
      if (req.user && req.user.role === 'doctor') {
        docQueries.push({ doctorName: new RegExp(req.user.name, 'i') });
      }
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: docQueries }];
        delete filter.$or;
      } else {
        filter.$or = docQueries;
      }
    }

    if (status) filter.status = status;

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err.message });
  }
});

router.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const patientId = String(req.user.id);
    const appointments = await Appointment.find({
      $or: [{ patientId }, { patientName: new RegExp(req.user.name, 'i') }]
    }).sort({ createdAt: -1 });

    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
});

// GET /api/patient/appointments/:id OR /api/appointments/:id OR /api/patients/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;

    // If mounted on /api/patients/:id
    if (req.baseUrl.includes('patients')) {
      let user = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        user = await User.findById(id).select('-password');
      }
      if (!user) {
        user = await User.findOne({
          $or: [{ _id: req.user.id }, { username: id }, { email: id }]
        }).select('-password');
      }
      if (!user) {
        user = await User.findById(req.user.id).select('-password');
      }
      return res.json(user || { id, name: 'Patient' });
    }

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
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const queueBefore = await Appointment.countDocuments({
      doctorId: appointment.doctorId,
      date: appointment.date,
      status: { $in: ['Checked In', 'Waiting'] },
      _id: { $ne: appointment._id }
    });

    const aptObj = appointment.toObject ? appointment.toObject() : appointment;
    res.json({
      ...aptObj,
      appointment: aptObj,
      queuePosition: queueBefore + 1,
      estimatedWaitTimeMinutes: (queueBefore + 1) * 15
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointment', error: err.message });
  }
});

// POST /api/patient/book OR POST /api/appointments
router.post(['/book', '/'], authenticateToken, async (req, res) => {
  try {
    const { departmentId, doctorId, date, timeSlot, consultationTime, symptoms, priority, patientName, patientPhone, patientAge, patientGender } = req.body;

    let doctor = null;
    if (doctorId && doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      doctor = await Doctor.findById(doctorId);
    }
    if (!doctor) {
      doctor = await Doctor.findOne();
    }

    let department = null;
    if (departmentId && departmentId.match(/^[0-9a-fA-F]{24}$/)) {
      department = await Department.findById(departmentId);
    }
    if (!department) {
      department = await Department.findOne();
    }

    const totalCount = await Appointment.countDocuments();
    const deptCode = department ? department.code : 'OPD';
    const nextTokenNum = totalCount + 1;
    const token = `${deptCode}-${String(nextTokenNum).padStart(3, '0')}`;
    const appointmentCode = `APT-${1000 + nextTokenNum}`;

    const newAppointment = await Appointment.create({
      appointmentCode,
      patientId: String(req.user.id),
      patientName: patientName || req.user.name || 'Patient',
      patientPhone: patientPhone || '+1 555-9011',
      patientAge: Number(patientAge) || 30,
      patientGender: patientGender || 'Other',
      doctorId: doctor ? String(doctor._id) : '101',
      doctorName: doctor ? doctor.name : 'Dr. Specialist',
      departmentId: department ? String(department._id) : '1',
      departmentName: department ? department.name : 'General OPD',
      date: date || new Date().toISOString().split('T')[0],
      token,
      priority: priority || 'Medium',
      priorityScore: priority === 'Emergency' ? 95 : priority === 'High' ? 80 : 50,
      consultationTime: timeSlot || consultationTime || '10:00 AM',
      status: 'Scheduled',
      symptoms: symptoms || 'Routine Consultation',
      isEmergency: priority === 'Emergency'
    });

    // Create Notification
    await Notification.create({
      patientId: String(req.user.id),
      title: 'Appointment Booked',
      message: `Confirmed with ${newAppointment.doctorName} for ${newAppointment.date}. Token: ${token}`
    });

    // Emit socket event for live queue update
    const io = req.app.get('io');
    if (io) {
      io.emit('queue:updated', { type: 'APPOINTMENT_BOOKED', appointment: newAppointment });
    }

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
});

// PATCH /api/appointments/:id/status OR PUT /api/appointments/:id/status
router.all(['/:id/status', '/appointments/:id/status'], authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { status, notes, prescription } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.clinicalNotes = notes;
    if (prescription) updateData.prescription = prescription;
    if (status === 'Checked In') {
      updateData.checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

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

    // Emit live socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('queue:updated', { type: 'STATUS_UPDATED', appointment });
    }

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      appointment
    });
  } catch (err) {
    res.status(500).json({ message: 'Status update failed', error: err.message });
  }
});

// POST /api/appointments/:id/cancel OR /api/patient/:id/cancel
router.post(['/:id/cancel', '/appointments/:id/cancel'], authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { status: 'Cancelled' };

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

    const io = req.app.get('io');
    if (io) {
      io.emit('queue:updated', { type: 'APPOINTMENT_CANCELLED', appointment });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed', error: err.message });
  }
});

// GET & PUT /api/patient/profile OR /api/patients/:id
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ patient: user, ...user?.toObject() });
  } catch (err) {
    res.status(500).json({ message: 'Profile fetch failed', error: err.message });
  }
});

router.put(['/profile', '/:id'], authenticateToken, async (req, res) => {
  try {
    const targetId = req.params.id && req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : req.user.id;
    const updated = await User.findByIdAndUpdate(targetId, req.body, { new: true }).select('-password');
    res.json({ message: 'Profile updated', patient: updated, ...updated?.toObject() });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
});

// GET /api/patient/notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ patientId: String(req.user.id) }, { userId: String(req.user.id) }]
    }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// PATCH /api/notifications/:id/read OR /api/patient/notifications/:id/read
router.patch(['/:id/read', '/notifications/:id/read'], authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    let notif = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      notif = await Notification.findByIdAndUpdate(id, { read: true, unread: false }, { new: true });
    } else {
      notif = await Notification.findOneAndUpdate({ id }, { read: true, unread: false }, { new: true });
    }
    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ message: 'Error marking notification read', error: err.message });
  }
});

export default router;
