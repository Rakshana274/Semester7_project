// In-memory Database Store for OPD Queue & Booking System

export const db = {
  departments: [
    { id: 1, name: 'Cardiology', code: 'CARD', description: 'Heart & Cardiovascular Care', doctorCount: 4, active: true },
    { id: 2, name: 'General OPD', code: 'GOPD', description: 'Primary Care & Routine Consultations', doctorCount: 6, active: true },
    { id: 3, name: 'Orthopedics', code: 'ORTH', description: 'Bones, Joints & Musculoskeletal Care', doctorCount: 3, active: true },
    { id: 4, name: 'Pediatrics', code: 'PEDS', description: 'Child & Adolescent Health', doctorCount: 4, active: true },
    { id: 5, name: 'Neurology', code: 'NEUR', description: 'Brain & Nervous System Care', doctorCount: 2, active: true },
    { id: 6, name: 'Dermatology', code: 'DERM', description: 'Skin & Allergy Management', doctorCount: 3, active: true }
  ],
  doctors: [
    { id: 101, name: 'Dr. Sarah Jenkins', email: 's.jenkins@hospital.org', phone: '+1 555-0101', departmentId: 1, departmentName: 'Cardiology', roomNo: 'Room 102', experience: '12 Years', status: 'Active', consultationTime: '15 mins' },
    { id: 102, name: 'Dr. Robert Chen', email: 'r.chen@hospital.org', phone: '+1 555-0102', departmentId: 2, departmentName: 'General OPD', roomNo: 'Room 205', experience: '8 Years', status: 'Active', consultationTime: '10 mins' },
    { id: 103, name: 'Dr. Emily Vance', email: 'e.vance@hospital.org', phone: '+1 555-0103', departmentId: 3, departmentName: 'Orthopedics', roomNo: 'Room 310', experience: '15 Years', status: 'Active', consultationTime: '20 mins' },
    { id: 104, name: 'Dr. Michael Ross', email: 'm.ross@hospital.org', phone: '+1 555-0104', departmentId: 4, departmentName: 'Pediatrics', roomNo: 'Room 108', experience: '10 Years', status: 'Active', consultationTime: '15 mins' },
    { id: 105, name: 'Dr. Anita Patel', email: 'a.patel@hospital.org', phone: '+1 555-0105', departmentId: 5, departmentName: 'Neurology', roomNo: 'Room 401', experience: '14 Years', status: 'Active', consultationTime: '25 mins' },
    { id: 106, name: 'Dr. David Miller', email: 'd.miller@hospital.org', phone: '+1 555-0106', departmentId: 2, departmentName: 'General OPD', roomNo: 'Room 206', experience: '6 Years', status: 'Active', consultationTime: '10 mins' }
  ],
  patients: [
    { id: 201, name: 'John Doe', email: 'patient@hospital.org', phone: '+1 555-9011', age: 42, gender: 'Male', chronicConditions: 'Hypertension, Type 2 Diabetes' },
    { id: 202, name: 'Alice Smith', email: 'alice.smith@example.com', phone: '+1 555-9012', age: 29, gender: 'Female', chronicConditions: 'Asthma' },
    { id: 203, name: 'Robert Johnson', email: 'robert.j@example.com', phone: '+1 555-9013', age: 65, gender: 'Male', chronicConditions: 'Coronary Artery Disease, Arthritis' },
    { id: 204, name: 'Emma Watson', email: 'emma.w@example.com', phone: '+1 555-9014', age: 34, gender: 'Female', chronicConditions: 'None' },
    { id: 205, name: 'Carlos Mendez', email: 'carlos.m@example.com', phone: '+1 555-9015', age: 58, gender: 'Male', chronicConditions: 'High Cholesterol' }
  ],
  appointments: [
    {
      id: 'APT-1001',
      patientId: 201,
      patientName: 'John Doe',
      patientPhone: '+1 555-9011',
      patientAge: 42,
      patientGender: 'Male',
      doctorId: 101,
      doctorName: 'Dr. Sarah Jenkins',
      departmentId: 1,
      departmentName: 'Cardiology',
      date: '2026-08-30',
      token: 'CARD-001',
      priority: 'High',
      priorityScore: 82,
      consultationTime: '09:30 AM',
      status: 'Checked In',
      checkInTime: '09:12 AM',
      symptoms: 'Chest discomfort, mild shortness of breath during exertion.',
      isEmergency: false
    },
    {
      id: 'APT-1002',
      patientId: 202,
      patientName: 'Alice Smith',
      patientPhone: '+1 555-9012',
      patientAge: 29,
      patientGender: 'Female',
      doctorId: 102,
      doctorName: 'Dr. Robert Chen',
      departmentId: 2,
      departmentName: 'General OPD',
      date: '2026-08-30',
      token: 'GOPD-002',
      priority: 'Medium',
      priorityScore: 54,
      consultationTime: '09:45 AM',
      status: 'Waiting',
      checkInTime: null,
      symptoms: 'Persistent dry cough and mild fever for 3 days.',
      isEmergency: false
    },
    {
      id: 'APT-1003',
      patientId: 203,
      patientName: 'Robert Johnson',
      patientPhone: '+1 555-9013',
      patientAge: 65,
      patientGender: 'Male',
      doctorId: 103,
      doctorName: 'Dr. Emily Vance',
      departmentId: 3,
      departmentName: 'Orthopedics',
      date: '2026-08-30',
      token: 'ORTH-003',
      priority: 'Emergency',
      priorityScore: 96,
      consultationTime: '10:00 AM',
      status: 'In Consultation',
      checkInTime: '09:40 AM',
      symptoms: 'Severe joint pain following a fall, unable to bear weight.',
      isEmergency: true
    },
    {
      id: 'APT-1004',
      patientId: 204,
      patientName: 'Emma Watson',
      patientPhone: '+1 555-9014',
      patientAge: 34,
      patientGender: 'Female',
      doctorId: 104,
      doctorName: 'Dr. Michael Ross',
      departmentId: 4,
      departmentName: 'Pediatrics',
      date: '2026-08-30',
      token: 'PEDS-004',
      priority: 'Low',
      priorityScore: 28,
      consultationTime: '10:30 AM',
      status: 'Scheduled',
      checkInTime: null,
      symptoms: 'Routine growth checkup and vaccination counseling.',
      isEmergency: false
    },
    {
      id: 'APT-1005',
      patientId: 205,
      patientName: 'Carlos Mendez',
      patientPhone: '+1 555-9015',
      patientAge: 58,
      patientGender: 'Male',
      doctorId: 102,
      doctorName: 'Dr. Robert Chen',
      departmentId: 2,
      departmentName: 'General OPD',
      date: '2026-08-30',
      token: 'GOPD-005',
      priority: 'Medium',
      priorityScore: 61,
      consultationTime: '11:00 AM',
      status: 'Completed',
      checkInTime: '10:45 AM',
      symptoms: 'Fasting blood sugar review and routine prescription renewal.',
      isEmergency: false
    }
  ],
  opdSessions: [
    { id: 1, doctorId: 101, doctorName: 'Dr. Sarah Jenkins', departmentName: 'Cardiology', date: '2026-08-30', startTime: '09:00 AM', endTime: '01:00 PM', consultationDuration: 15, capacity: 20, booked: 14, remaining: 6, status: 'Active' },
    { id: 2, doctorId: 102, doctorName: 'Dr. Robert Chen', departmentName: 'General OPD', date: '2026-08-30', startTime: '08:30 AM', endTime: '12:30 PM', consultationDuration: 10, capacity: 30, booked: 22, remaining: 8, status: 'Active' },
    { id: 3, doctorId: 103, doctorName: 'Dr. Emily Vance', departmentName: 'Orthopedics', date: '2026-08-30', startTime: '10:00 AM', endTime: '02:00 PM', consultationDuration: 20, capacity: 15, booked: 12, remaining: 3, status: 'Active' },
    { id: 4, doctorId: 104, doctorName: 'Dr. Michael Ross', departmentName: 'Pediatrics', date: '2026-08-30', startTime: '09:00 AM', endTime: '01:00 PM', consultationDuration: 15, capacity: 25, booked: 18, remaining: 7, status: 'Active' }
  ],
  emergencies: [
    { id: 1, patientName: 'Robert Johnson', age: 65, condition: 'Fall / Traumatic Injury', room: 'Emergency Bay 2', priority: 'Critical', reportedAt: '09:35 AM', status: 'Assigned to Dr. Vance' },
    { id: 2, patientName: 'Unidentified Male', age: 50, condition: 'Acute Chest Pain', room: 'Triage Room 1', priority: 'Critical', reportedAt: '09:50 AM', status: 'Pending Doctor Assignment' }
  ],
  notifications: [
    { id: 1, patientId: 201, title: 'Check-in Confirmed', message: 'You have checked in for Token CARD-001. Current queue position: #2.', time: '10 mins ago', read: false },
    { id: 2, patientId: 201, title: 'Estimated Delay', message: 'Dr. Jenkins is currently spending extra time with a priority case (+10m delay).', time: '25 mins ago', read: true },
    { id: 3, patientId: 201, title: 'Appointment Reminder', message: 'Your appointment is scheduled for 09:30 AM today in Room 102.', time: '1 hour ago', read: true }
  ],
  settings: {
    maxDailyCapacityPerDoctor: 30,
    emergencyOverrideQuota: 5,
    autoPrioritizationEnabled: true,
    cancellationWindowHours: 2,
    walkinSlotPercentage: 30
  }
};
