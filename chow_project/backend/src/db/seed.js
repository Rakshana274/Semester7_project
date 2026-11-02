import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Doctor } from '../models/Doctor.js';
import { Appointment } from '../models/Appointment.js';
import { OPDSession } from '../models/OPDSession.js';
import { Emergency } from '../models/Emergency.js';
import { Setting } from '../models/Setting.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial database data...');

      // 1. Seed Users
      const users = await User.create([
        {
          name: 'Janushiya (Admin)',
          username: 'janushiya',
          email: 'janushiya@hospital.org',
          password: 'januxh@19',
          role: 'admin'
        },
        {
          name: 'Chowz (Receptionist)',
          username: 'chowz',
          email: 'chowz@hospital.org',
          password: '123456',
          role: 'receptionist'
        },
        {
          name: 'Dr. Rakshana',
          username: 'rakshana',
          email: 'rakshana@hospital.org',
          password: '123456',
          role: 'doctor'
        },
        {
          name: 'Mythili (Patient)',
          username: 'mythili',
          email: 'mythili@hospital.org',
          password: '123456',
          role: 'patient',
          phone: '+1 555-9011',
          age: 28,
          gender: 'Female',
          chronicConditions: 'None'
        }
      ]);

      // 2. Seed Departments
      const departments = await Department.create([
        { name: 'Cardiology', code: 'CARD', description: 'Heart & Cardiovascular Care', doctorCount: 2, active: true },
        { name: 'General OPD', code: 'GOPD', description: 'Primary Care & Routine Consultations', doctorCount: 3, active: true },
        { name: 'Orthopedics', code: 'ORTH', description: 'Bones, Joints & Musculoskeletal Care', doctorCount: 2, active: true },
        { name: 'Pediatrics', code: 'PEDS', description: 'Child & Adolescent Health', doctorCount: 2, active: true },
        { name: 'Neurology', code: 'NEUR', description: 'Brain & Nervous System Care', doctorCount: 1, active: true },
        { name: 'Dermatology', code: 'DERM', description: 'Skin & Allergy Management', doctorCount: 1, active: true }
      ]);

      // 3. Seed Doctors
      const doctors = await Doctor.create([
        {
          name: 'Dr. Rakshana',
          email: 'rakshana@hospital.org',
          phone: '+1 555-0101',
          departmentId: departments[0]._id,
          departmentName: 'Cardiology',
          roomNo: 'Room 102',
          experience: '10 Years',
          status: 'Active',
          consultationTime: '15 mins'
        },
        {
          name: 'Dr. Robert Chen',
          email: 'r.chen@hospital.org',
          phone: '+1 555-0102',
          departmentId: departments[1]._id,
          departmentName: 'General OPD',
          roomNo: 'Room 205',
          experience: '8 Years',
          status: 'Active',
          consultationTime: '10 mins'
        },
        {
          name: 'Dr. Emily Vance',
          email: 'e.vance@hospital.org',
          phone: '+1 555-0103',
          departmentId: departments[2]._id,
          departmentName: 'Orthopedics',
          roomNo: 'Room 310',
          experience: '15 Years',
          status: 'Active',
          consultationTime: '20 mins'
        }
      ]);

      // 4. Seed Appointments
      const patientUser = users.find(u => u.username === 'mythili');
      const doctorUser = doctors[0];

      await Appointment.create([
        {
          appointmentCode: 'APT-1001',
          patientId: patientUser ? String(patientUser._id) : '201',
          patientName: 'Mythili (Patient)',
          patientPhone: '+1 555-9011',
          patientAge: 28,
          patientGender: 'Female',
          doctorId: String(doctorUser._id),
          doctorName: doctorUser.name,
          departmentId: String(departments[0]._id),
          departmentName: departments[0].name,
          date: new Date().toISOString().split('T')[0],
          token: 'CARD-001',
          priority: 'High',
          priorityScore: 82,
          consultationTime: '09:30 AM',
          status: 'Checked In',
          checkInTime: '09:12 AM',
          symptoms: 'Mild shortness of breath during exertion.',
          isEmergency: false
        },
        {
          appointmentCode: 'APT-1002',
          patientId: '202',
          patientName: 'Alice Smith',
          patientPhone: '+1 555-9012',
          patientAge: 29,
          patientGender: 'Female',
          doctorId: String(doctors[1]._id),
          doctorName: doctors[1].name,
          departmentId: String(departments[1]._id),
          departmentName: departments[1].name,
          date: new Date().toISOString().split('T')[0],
          token: 'GOPD-002',
          priority: 'Medium',
          priorityScore: 54,
          consultationTime: '09:45 AM',
          status: 'Waiting',
          checkInTime: null,
          symptoms: 'Persistent dry cough and mild fever.',
          isEmergency: false
        }
      ]);

      // 5. Seed OPD Sessions
      await OPDSession.create([
        {
          doctorId: String(doctorUser._id),
          doctorName: doctorUser.name,
          departmentName: doctorUser.departmentName,
          date: new Date().toISOString().split('T')[0],
          startTime: '09:00 AM',
          endTime: '01:00 PM',
          consultationDuration: 15,
          capacity: 20,
          booked: 1,
          remaining: 19,
          status: 'Active'
        }
      ]);

      // 6. Seed Emergencies
      await Emergency.create([
        {
          patientName: 'Emergency Walk-in',
          age: 62,
          condition: 'Acute Chest Discomfort',
          room: 'Emergency Bay 1',
          priority: 'Critical',
          status: 'Assigned to Dr. Rakshana'
        }
      ]);

      // 7. Seed Settings
      await Setting.create({
        maxDailyCapacityPerDoctor: 30,
        emergencyOverrideQuota: 5,
        autoPrioritizationEnabled: true,
        cancellationWindowHours: 2,
        walkinSlotPercentage: 30
      });

      console.log('✅ Initial database seed completed successfully!');
    }
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
};
