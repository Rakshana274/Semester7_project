import express from 'express';
import { Department } from '../models/Department.js';
import { Doctor } from '../models/Doctor.js';
import { OPDSession } from '../models/OPDSession.js';
import { Setting } from '../models/Setting.js';
import { Appointment } from '../models/Appointment.js';
import { User } from '../models/User.js';
import { Emergency } from '../models/Emergency.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const totalDepartments = await Department.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointmentsToday = await Appointment.countDocuments();
    const activeSessions = await OPDSession.countDocuments({ status: 'Active' });
    const emergenciesHandled = await Emergency.countDocuments();

    const departments = await Department.find();
    const doctors = await Doctor.find();

    res.json({
      totalDepartments,
      totalDoctors,
      totalPatients,
      totalAppointmentsToday,
      activeSessions,
      emergenciesHandled,
      departments,
      doctors
    });
  } catch (err) {
    res.status(500).json({ message: 'Error loading admin dashboard', error: err.message });
  }
});

// Departments CRUD
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching departments', error: err.message });
  }
});

router.post('/departments', authenticateToken, async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const newDept = await Department.create({
      name,
      code: (code || name.substring(0, 4)).toUpperCase(),
      description: description || ''
    });
    res.status(201).json(newDept);
  } catch (err) {
    res.status(500).json({ message: 'Error creating department', error: err.message });
  }
});

router.put('/departments/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating department', error: err.message });
  }
});

router.delete('/departments/:id', authenticateToken, async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting department', error: err.message });
  }
});

// Doctors CRUD
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
});

router.post('/doctors', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, departmentId, roomNo, experience, consultationTime } = req.body;
    let deptName = 'General OPD';
    if (departmentId && departmentId.match(/^[0-9a-fA-F]{24}$/)) {
      const dept = await Department.findById(departmentId);
      if (dept) deptName = dept.name;
    }

    const newDoc = await Doctor.create({
      name,
      email,
      phone,
      departmentId,
      departmentName: deptName,
      roomNo: roomNo || 'Room 101',
      experience: experience || '5 Years',
      consultationTime: consultationTime || '15 mins',
      status: 'Active'
    });

    res.status(201).json(newDoc);
  } catch (err) {
    res.status(500).json({ message: 'Error creating doctor', error: err.message });
  }
});

router.put('/doctors/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating doctor', error: err.message });
  }
});

router.delete('/doctors/:id', authenticateToken, async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting doctor', error: err.message });
  }
});

// OPD Sessions
router.get('/opd-sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = await OPDSession.find();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sessions', error: err.message });
  }
});

router.post('/opd-sessions', authenticateToken, async (req, res) => {
  try {
    const { doctorId, startTime, endTime, capacity, consultationDuration } = req.body;
    let doctor = null;
    if (doctorId && doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      doctor = await Doctor.findById(doctorId);
    }

    const newSession = await OPDSession.create({
      doctorId: doctor ? String(doctor._id) : doctorId || '101',
      doctorName: doctor ? doctor.name : 'Dr. Specialist',
      departmentName: doctor ? doctor.departmentName : 'General OPD',
      date: new Date().toISOString().split('T')[0],
      startTime: startTime || '09:00 AM',
      endTime: endTime || '01:00 PM',
      consultationDuration: Number(consultationDuration) || 15,
      capacity: Number(capacity) || 20,
      booked: 0,
      remaining: Number(capacity) || 20,
      status: 'Active'
    });

    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ message: 'Error creating session', error: err.message });
  }
});

// Settings, Capacity, Walkins
router.get(['/settings', '/capacity', '/walkins'], authenticateToken, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error loading settings', error: err.message });
  }
});

router.put(['/settings', '/capacity', '/walkins'], authenticateToken, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error updating settings', error: err.message });
  }
});

// Statistics
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const departments = await Department.find();
    const doctors = await Doctor.find();
    const allAppointments = await Appointment.find();

    const totalAppointments = allAppointments.length;
    const completedAppointments = allAppointments.filter(a => a.status === 'Completed').length;
    const cancelledAppointments = allAppointments.filter(a => a.status === 'Cancelled').length;
    const noShows = allAppointments.filter(a => a.status === 'Scheduled' && a.date < new Date().toISOString().split('T')[0]).length;

    const priorityDistribution = {
      Emergency: allAppointments.filter(a => a.priority === 'Emergency').length,
      High: allAppointments.filter(a => a.priority === 'High').length,
      Medium: allAppointments.filter(a => a.priority === 'Medium').length,
      Low: allAppointments.filter(a => a.priority === 'Low').length
    };

    const departmentStats = departments.map(d => {
      const deptApts = allAppointments.filter(a => a.departmentName === d.name);
      return {
        department: d.name,
        total: deptApts.length,
        completed: deptApts.filter(a => a.status === 'Completed').length
      };
    });

    const doctorStats = doctors.map(doc => {
      const docApts = allAppointments.filter(a => a.doctorName === doc.name || a.doctorId === String(doc._id));
      return {
        name: doc.name,
        department: doc.departmentName,
        patientsSeen: docApts.filter(a => a.status === 'Completed').length,
        avgTime: doc.consultationTime || '15 mins'
      };
    });

    const departmentBreakdown = departments.map(d => ({
      name: d.name,
      count: allAppointments.filter(a => a.departmentName === d.name).length
    }));

    const capacityUtilization = totalAppointments > 0 ? Number(((completedAppointments / totalAppointments) * 100).toFixed(1)) : 0;
    const cancelRate = totalAppointments > 0 ? ((cancelledAppointments / totalAppointments) * 100).toFixed(1) + '%' : '0%';

    res.json({
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      noShows,
      priorityDistribution,
      departmentStats,
      doctorStats,
      capacityUtilization,
      departmentBreakdown,
      weeklyTrend: [
        { day: 'Mon', online: 45, walkin: 20 },
        { day: 'Tue', online: 52, walkin: 18 },
        { day: 'Wed', online: 60, walkin: 25 },
        { day: 'Thu', online: 48, walkin: 22 },
        { day: 'Fri', online: 58, walkin: 30 },
        { day: 'Sat', online: 70, walkin: 40 },
        { day: 'Sun', online: 35, walkin: 15 }
      ],
      avgWaitTimeMinutes: 18,
      cancellationRate: cancelRate
    });
  } catch (err) {
    res.status(500).json({ message: 'Error loading statistics', error: err.message });
  }
});

export default router;
